function setPathForLibDirectory(libfile) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		networkSharingService = require("../../lib/" + libfile);
	} else {
		networkSharingService = require(libfile);
	}
}

function init() {
	//depreciated===
	var networkSharingService = setPathForLibDirectory('sharing/sharingNetwork');
	//===
	
	var sharingServiceImage = setPathForLibDirectory('sharing/sharing-service-image');
	var sharingServiceText = setPathForLibDirectory('sharing/sharing-service-text');
	var androidService = setPathForLibDirectory('customCalls/platforms/android-service');
	var iosService = setPathForLibDirectory('customCalls/platforms/ios-service');
}








init();
module.exports = sharingService;