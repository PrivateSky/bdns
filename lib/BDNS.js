const path = require("swarmutils").path;
const FILE_PATH = path.join(process.env.PSK_ROOT_INSTALATION_FOLDER, "modules/bdns/BDNS.hosts.json");

function BDNS() {
    let hosts;

    const initialize = () => {
        if (typeof hosts !== "undefined") {
            return;
        }

        let fs;
        try {
            fs = require("fs");
        } catch (e) {
            return;
        }

        try {
            const content = fs.readFileSync(FILE_PATH);
            hosts = JSON.parse(content.toString());
        } catch (e) {
            hosts = {
                "default": {
                    "replicas": [],
                    "brickStorages": [
                        "http://localhost:8080"
                    ],
                    "anchoringServices": [
                        "http://localhost:8080"
                    ]
                }
            }
        }
    };

    this.getRawInfo = (dlDomain, callback) => {
        const rawInfo = hosts[dlDomain];
        if (typeof rawInfo === "undefined") {
            //TODO: send swarm to parent's BDNS

            callback(`[BDNS] - Unknown configuration for ${dlDomain}.`);
        } else {
            callback(undefined, rawInfo);
        }
    };

    this.getNotificationEndpoints = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo)=>{
            if(err || typeof rawInfo.notifications === "undefined"){
                return callback(err?err:"Notification endpoints not available");
            }
            callback(undefined, rawInfo.notifications);
        });
    }

    this.getMQEndpoints = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo)=>{
            if(err || typeof rawInfo.mq === "undefined"){
                return callback(err?err:"Message Queue endpoints not available");
            }
            callback(undefined, rawInfo.mq);
        });
    }

    this.getBrickStorages = (dlDomain, callback) => {
        const rawInfo = hosts[dlDomain];
        if (typeof rawInfo === "undefined" || typeof rawInfo.brickStorages === "undefined") {
            //send swarm to parent's BDNS
        } else {
            callback(undefined, rawInfo.brickStorages);
        }
    };

    this.getAnchoringServices = (dlDomain, callback) => {
        const rawInfo = hosts[dlDomain];
        if (typeof rawInfo === "undefined" || typeof rawInfo.anchoringServices === "undefined") {
            //send swarm to parent's BDNS
        } else {
            callback(undefined, rawInfo.anchoringServices);
        }
    };

    this.getReplicas = (dlDomain, callback) => {
        const rawInfo = hosts[dlDomain];
        if (typeof rawInfo === "undefined" || typeof rawInfo.replicas === "undefined") {
            //send swarm to parent's BDNS
        } else {
            callback(undefined, rawInfo.replicas);
        }
    };

    this.addRawInfo = (dlDomain, rawInfo) => {
        if (typeof hosts[dlDomain] !== "undefined") {
            throw Error(`Trying to overwrite the existing configuration for domain ${dlDomain}`);
        }

        hosts[dlDomain] = rawInfo;
    };

    this.addAnchoringServices = (dlDomain, anchoringServices) => {
        if (typeof hosts[dlDomain] === "undefined") {
            hosts[dlDomain] = {};
            hosts[dlDomain].anchoringServices = [];
        }

        if (typeof anchoringServices === "string") {
            anchoringServices = [anchoringServices];
        }

        if (!Array.isArray(anchoringServices)) {
            throw Error(`Invalid brick storages format. Expected string or array. Received ${typeof anchoringServices}`)
        }

        hosts[dlDomain].anchoringServices = hosts[dlDomain].anchoringServices.concat(anchoringServices);
    };

    this.addBrickStorages = (dlDomain, brickStorages) => {
        if (typeof hosts[dlDomain] === "undefined") {
            hosts[dlDomain] = {};
            hosts[dlDomain].brickStorages = [];
        }

        if (typeof brickStorages === "string") {
            brickStorages = [brickStorages];
        }

        if (!Array.isArray(brickStorages)) {
            throw Error(`Invalid brick storages format. Expected string or array. Received ${typeof brickStorages}`)
        }

        hosts[dlDomain].brickStorages = hosts[dlDomain].brickStorages.concat(brickStorages);
    };

    this.addReplicas = (dlDomain, replicas) => {
        if (typeof hosts[dlDomain] === "undefined") {
            hosts[dlDomain] = {};
            hosts[dlDomain].replicas = [];
        }

        if (typeof replicas === "string") {
            replicas = [replicas];
        }

        if (!Array.isArray(replicas)) {
            throw Error(`Invalid brick storages format. Expected string or array. Received ${typeof replicas}`)
        }

        hosts[dlDomain].replicas = hosts[dlDomain].replicas.concat(replicas);
    };

    initialize();
}

module.exports = BDNS;