var tiCalls = require('../lib/exclCommonTiApi');

function parseJson(responseText) {
	json = tiCalls.parse(responseText);
	return json;
}

function fetchDataFromUrl(url) {
	var client = tiCalls.network();
	if (client) {
		client.open("GET", url);
		client.send();
	}
}

module.exports.parseJson = parseJson;
module.exports.fetchDataFromUrl = fetchDataFromUrl; 