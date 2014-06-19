var apiCalls, parseCalls;

function setPathForLibDirectory(apiCallsLib, parseCallsLib) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		apiCalls = require('../../lib/customCalls/' + apiCallsLib);
		parseCalls = require('../../lib/customCalls/' + parseCallsLib);
	} else {
		apiCalls = require('customCalls/' + apiCallsLib);
		parseCalls = require('customCalls/' + parseCallsLib);
	}
}

var networkCalls = {

	network : function(url, onSuccess) {
		var client = Ti.Network.createHTTPClient({
			onload : function() {
				var json = parseCalls.parse(this.responseText);
				onSuccess(json);
			},
			onerror : function() {
				// apiCalls.debug(e.error);
				alert("Could not retrieve any data :(");
			}
		});

		return client;
	},
};

setPathForLibDirectory('apiCalls', 'parseCalls');
module.exports = networkCalls;
