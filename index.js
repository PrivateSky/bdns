module.exports.create = () => {
    const BDNS = require("./lib/BDNS");
    return new BDNS()
};
