function setPathForLibDirectory(libfile) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		networkSharingService = require("../../lib/" + libfile);
	} else {
		networkSharingService = require(libfile);
	}
}

function init() {
	//depreciated, file will not exist===
	var networkSharingService = setPathForLibDirectory('sharing/sharingNetwork');
	//===
	
	var sharingServiceImage = setPathForLibDirectory('sharing/sharing-service-image');
	var sharingServiceText = setPathForLibDirectory('sharing/sharing-service-text');
}






init();
module.exports = sharingService;