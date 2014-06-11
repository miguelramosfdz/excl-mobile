
function parseJSON(responseText) {
	json = JSON.parse(responseText);
	Ti.API.debug(json);
	return json;
}

function onErrorHelper() {
	Ti.API.debug(e.error);
	alert("Could not retrieve data!");
}

function makeServiceCall(onSuccess, url) {
	var client = Ti.Network.createHTTPClient({
		onload : function() {
			var json = parseJSON(this.responseText);
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

module.exports.parseJSON = parseJSON;
module.exports.onErrorHelper = onErrorHelper;
module.exports.makeServiceCall = makeServiceCall; 
module.exports.getJsonData = getJsonData;
