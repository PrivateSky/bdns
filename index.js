module.exports.createBDNS = ()=>{
    const BDNS = require("./lib/BDNS");
    return new BDNS();
}