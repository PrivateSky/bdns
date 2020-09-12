const BDNS = require("./lib/BDNS");
if (typeof $$.bdns === "undefined") {
    $$.bdns = new BDNS();
}
