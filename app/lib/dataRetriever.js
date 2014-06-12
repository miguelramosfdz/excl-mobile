var tiCalls = require('../lib/exclCommonTiApi');

function parseJson(responseText) {
	json = tiCalls.parse(responseText);
	tiCalls.heyhey();
	return json;
}

function onErrorHelper() {
	Ti.API.debug(e.error);
	alert("Could not retrieve data!");
}

function makeServiceCall(onSuccess, url) {
	var client = Ti.Network.createHTTPClient({
		onload : function() {
			var json = parseJson(this.responseText);
			onSuccess(json);
		},
		onerror : function() {
			onErrorHelper();
		}
	});
	client.open("GET", url);
	client.send();
}

function getJsonData(url, onSuccess) {
	Ti.API.info("Getting info from URL: " + url);
	makeServiceCall(onSuccess, url);
}

module.exports.parseJson = parseJson;
module.exports.onErrorHelper = onErrorHelper;
module.exports.makeServiceCall = makeServiceCall;
module.exports.getJsonData = getJsonData;
