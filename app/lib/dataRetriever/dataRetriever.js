var apiCalls, networkCalls, parseCalls;

// there is probably cleaner way of doing writing this function...
function setPathForLibDirectory(apiCallsLib, networkCallsLib, parseCallsLib) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		apiCalls = require('../../lib/customCalls/' + apiCallsLib);
		networkCalls = require('../../lib/customCalls/' + networkCallsLib);
		parseCalls = require('../../lib/customCalls/' + parseCallsLib);
	} else {
		apiCalls = require('customCalls/' + apiCallsLib);
		networkCalls = require('customCalls/' + networkCallsLib);
		parseCalls = require('customCalls/' + parseCallsLib);
	}
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

setPathForLibDirectory('apiCalls', 'networkCalls', 'parseCalls');
module.exports.parseJson = parseJson;
module.exports.fetchDataFromUrl = fetchDataFromUrl;
