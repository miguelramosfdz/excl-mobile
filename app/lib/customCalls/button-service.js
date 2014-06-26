function setPathForLibDirectory(libfile) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		networkSharingService = require("../../lib/" + libfile);
	} else {
		networkSharingService = require(libfile);
	}
}

var androidService = setPathForLibDirectory('customCalls/platforms/android-service');
var iosService = setPathForLibDirectory('customCalls/platforms/ios-service');

function createButton() {
	//button to open text sharing
	var button = Ti.UI.createButton({
		height : "40dip",
		width : "40dip",
		left : "0",
		top : "0"
	});
	return button;
}

function setButtonEnabled(buttonId, bol) {
	buttonId.enabled = bol;
}

module.exports = buttonService;
