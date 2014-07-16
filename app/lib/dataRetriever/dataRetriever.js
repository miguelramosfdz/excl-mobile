var apiCalls, networkCalls, parseCalls, alloyCalls;

function setPathForLibDirectory(rootPath) {
	apiCalls = require(rootPath + 'apiCalls');
	networkCalls = require(rootPath + 'networkCalls');
	parseCalls = require(rootPath + 'parseCalls');
	alloyCalls = require(rootPath + 'alloyService');
}

function parseJson(responseText) {
	json = parseCalls.parse(responseText);
	return json;
}

function fetchDataFromUrl(url, onSuccess) {
	url = addLanguageToURL(url);
	var client = networkCalls.network(url, onSuccess);
	apiCalls.info("url: " + url);
	if (client) {
		client.open("GET", url);
		client.send();
	}
}

function addLanguageToURL(url) {
	if (alloyCalls.Models.app) {
		url += "?language=" + alloyCalls.Models.app.get('currentLanguage');
	}
	return url;
}

function sendJsonToUrl(url, jsonData, onSuccess) {
	var client = networkCalls.network(url, onSuccess);

	if (client) {
		client.setRequestHeader("Content-Type", "application/json");
		client.open("POST", url);
		client.send(JSON.stringify(jsonData));
	}

}

var rootPath = (typeof Titanium == 'undefined')? '../../lib/customCalls/' : 'customCalls/';
setPathForLibDirectory(rootPath);
module.exports.parseJson = parseJson;
module.exports.fetchDataFromUrl = fetchDataFromUrl;
module.exports.sendJsonToUrl = sendJsonToUrl;
