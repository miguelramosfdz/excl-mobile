function createTextShareButton(json) {
	var shareTextButton = buttonService.createButton();
	setReadyStateOfButton(shareTextButton);
	
	
	networkSharingService.toggleTextShareButtonStatusInactive(shareTextButton);
	//Add a listener so that when clicked, retrieveTextPostTags is called (this function calls sendIntentText)
	shareTextButton.addEventListener('click', function(e) {
		//Disable share button
		toggleTextShareButtonStatusActive(shareTextButton);
		//retrieve json tags
		postTags = getPostTags(json);
		//initialize intent creation
		initiateIntentText(postTags, shareTextButton);
	});
	eraseButtonTitleIfBackgroundPresent(shareTextButton);
	return shareTextButton;
}

function setReadyStateOfButton(buttonId){
	
}

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
	
	var buttonService = setPathForLibDirectory('customCalls/button-service');
}

init();
module.exports = sharingServiceText;