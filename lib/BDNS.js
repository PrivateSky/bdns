function BDNS() {
    let hosts;

    const initialize = () => {
        if (typeof hosts !== "undefined") {
            return;
        }

        try {
            const path = require("swarmutils").path;
            const FILE_PATH = path.join(process.env.PSK_CONFIG_LOCATION, "BDNS.hosts.json");
            hosts = require(FILE_PATH);
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
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.notifications === "undefined") {
                return callback(err ? err : "Notification endpoints not available");
            }
            callback(undefined, rawInfo.notifications);
        });
    }

    this.getMQEndpoints = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.mq === "undefined") {
                return callback(err ? err : "Message Queue endpoints not available");
            }
            callback(undefined, rawInfo.mq);
        });
    }

    this.getBrickStorages = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.brickStorages === "undefined") {
                return callback(err ? err : "Brick Storages not available");
            }
            callback(undefined, rawInfo.brickStorages);
        });
    };

    this.getAnchoringServices = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.anchoringServices === "undefined") {
                return callback(err ? err : "Anchoring Services not available");
            }
            callback(undefined, rawInfo.anchoringServices);
        });
    };

    this.getReplicas = (dlDomain, callback) => {
        this.getRawInfo(dlDomain, (err, rawInfo) => {
            if (err || typeof rawInfo.replicas === "undefined") {
                return callback(err ? err : "Domain replicas not available");
            }
            callback(undefined, rawInfo.replicas);
        });
    };

    this.addRawInfo = (dlDomain, rawInfo) => {
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