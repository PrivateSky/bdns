let or = require("overwrite-require");
const domain = "default";
const defaultURL = "http://localhost:8080";

function buildConfig(domainName, url) {
	let config = {};
	config[domainName] = {
		"replicas": [],
		"brickStorages": [url],
		"anchoringServices": [url]
	};
	return config;
}

function defaultConfigInit() {
	let hosts = buildConfig(domain, "http://localhost:8080");
	return hosts;
}

function browserConfigInit() {
	const protocol = window.location.protocol;
	const host = window.location.hostname;
	const port = window.location.port;

	let url = `${protocol}//${host}:${port}`;
	return buildConfig(domain, url);
}

function swConfigInit() {
	let scope = self.registration.scope;

	let parts = scope.split("/");
	let url  = parts[0] + "//" + parts[2];

	return buildConfig(domain, url);
}

function nodeConfigInit() {
	let hosts;
	try {
		const path = require("swarmutils").path;
		const FILE_PATH = path.join(process.env.PSK_CONFIG_LOCATION, "BDNS.hosts.json");
		hosts = require(FILE_PATH);
	} catch (e) {
		console.log("BDNS config file not found. Using defaults.");
		hosts = buildConfig(domain, defaultURL);
	}
	return hosts;
}

let result = {};
switch ($$.environmentType) {
	case or.constants.BROWSER_ENVIRONMENT_TYPE:
		result.init = browserConfigInit;
		break;
	case or.constants.SERVICE_WORKER_ENVIRONMENT_TYPE:
		result.init = swConfigInit;
		break;
	case or.constants.NODEJS_ENVIRONMENT_TYPE:
		result.init = nodeConfigInit;
		break;
	default:
		result.init = defaultConfigInit;
}

module.exports = result;