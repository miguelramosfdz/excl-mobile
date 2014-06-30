var apiCalls, networkCalls, parseCalls;

function setPathForLibDirectory(rootPath) {
	apiCalls = require(rootPath + 'apiCalls');
	networkCalls = require(rootPath + 'networkCalls');
	parseCalls = require(rootPath + 'parseCalls');

}

function parseJson(responseText) {
	json = parseCalls.parse(responseText);
	return json;
}

function fetchDataFromUrl(url, onSuccess) {
	var client = networkCalls.network(url, onSuccess);

	if (client) {
		client.open("GET", url);
		client.send();
	}

}

var rootPath = (typeof Titanium == 'undefined')? '../../lib/customCalls/' : 'customCalls/';
setPathForLibDirectory(rootPath);
module.exports.parseJson = parseJson;
module.exports.fetchDataFromUrl = fetchDataFromUrl;
