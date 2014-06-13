if ( typeof Titanium == 'undefined') {
	// this is required for jasmine-node to run via terminal
	var tiCalls = require('../lib/exclCommonTiApi');
} else {
	var tiCalls = require('exclCommonTiApi');
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

module.exports.parseJson = parseJson;
module.exports.fetchDataFromUrl = fetchDataFromUrl;
