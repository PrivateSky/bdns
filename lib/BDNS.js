const FILE_PATH = "../BDNS.hosts.json";

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
        const content = fs.readFileSync(FILE_PATH);
        hosts = JSON.parse(content.toString());
    };

    this.getRawInfo = (keySSI, callback) => {
        const rawInfo = hosts[keySSI.getDLDomain()];
        if (typeof rawInfo === "undefined") {
            //send swarm to parent's BDNS
        } else {
            callback(undefined, rawInfo);
        }
    };

    this.getBrickStorages = (keySSI, callback) => {
        const rawInfo = hosts[keySSI.getDLDomain()];
        if (typeof rawInfo === "undefined" || typeof rawInfo.brickStorages === "undefined") {
            //send swarm to parent's BDNS
        } else {
            callback(undefined, rawInfo.brickStorages);
        }
    };

    this.getAnchoringServices = (keySSI, callback) => {
        const rawInfo = hosts[keySSI.getDLDomain()];
        if (typeof rawInfo === "undefined" || typeof rawInfo.anchoringServices === "undefined") {
            //send swarm to parent's BDNS
        } else {
            callback(undefined, rawInfo.anchoringServices);
        }
    };

    this.getReplicas = (keySSI, callback) => {
        const rawInfo = hosts[keySSI.getDLDomain()];
        if (typeof rawInfo === "undefined" || typeof rawInfo.replicas === "undefined") {
            //send swarm to parent's BDNS
        } else {
            callback(undefined, rawInfo.replicas);
        }
    };

    initialize();
}

module.exports = new BDNS();