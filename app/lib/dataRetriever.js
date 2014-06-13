var tiCalls;

function setPathForLibDirectory(nameOfLib) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		tiCalls = require('../lib/' + nameOfLib);
	} else {
		tiCalls = require(nameOfLib);
	}
}

function parseJson(responseText) {
	json = tiCalls.parse(responseText);
	return json;
}

function fetchDataFromUrl(url, onSuccess) {
	var client = tiCalls.network(url, onSuccess);

	if (client) {
		client.open("GET", url);
		client.send();
	}

}

setPathForLibDirectory('exclCommonTiApi');
module.exports.parseJson = parseJson;
module.exports.fetchDataFromUrl = fetchDataFromUrl;
