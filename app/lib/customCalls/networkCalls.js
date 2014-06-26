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

function createNetworkErrorDialog(e){
	var dialog = Ti.UI.createAlertDialog({
	    cancel: 1,
	    buttonNames: ['Try Again'],
	    message: 'Poor network connection',
	    title: 'Error',
	    persistent: true
	});
	dialog.show();
	
	dialog.addEventListener('click', function(e){
		if (e.index == 0){		
			Alloy.Globals.navController.windowStack = []; //Reset windowStack
			var homeWindow = Alloy.createController('index').getView();
			Alloy.Globals.navController.open(homeWindow);
		}
		else if (e.index == e.source.cancel){
			createNetworkErrorDialog(e);
		}
	});
}

var networkCalls = {

	network : function(url, onSuccess) {
		var client = Ti.Network.createHTTPClient({
			onload : function() {
				var json = parseCalls.parse(this.responseText);
				onSuccess(json);
			},
			onerror : function(e) {
				createNetworkErrorDialog(e);
			}
		});

		return client;
	},
};

setPathForLibDirectory('apiCalls', 'parseCalls');
module.exports = networkCalls;
