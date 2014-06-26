function sharingTextService(){
	buttonService = setPathForLibDirectory('customCalls/buttonService');
	buttonService = new buttonService();
	iconService = setPathForLibDirectory('customCalls/iconService');
	iconService = new iconService();
	intentService = setPathForLibDirectory('customCalls/intentService');
	intentService = new intentService();
}

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

sharingTextService.prototype.initiateTextShareButton = function(json) {
	var shareTextButton = buttonService.createTextShareButton();
	sharingTextService.prototype.setIconReady(shareTextButton);

	shareTextButton.addEventListener('click', function(e) {
		sharingTextService.prototype.setIconBusy(shareTextButton);
		postTags = sharingTextService.prototype.getPostTags(json);
		sharingTextService.prototype.initiateIntentText(postTags, shareTextButton);
	});
	
	buttonService.eraseButtonTitleIfBackgroundPresent(shareTextButton);
	return shareTextButton;
};

sharingTextService.prototype.setIconReady = function(shareTextButton){
	iconService.setIcon(shareTextButton, 'share_ready.png');
};

sharingTextService.prototype.setIconBusy = function(shareTextButton){
	iconService.setIcon(shareTextButton, 'share_busy.png');
};

sharingTextService.prototype.getPostTags = function(json) {
	postTags = json.social_media_message;
	return postTags;
};

sharingTextService.prototype.initiateIntentText = function(postTagsString, shareTextButton) {
	//Choose appropriate intent creator
	if (OS_ANDROID) {
		intentService.sendIntentTextAndroid(postTags);
	} else if (OS_IOS) {
		intentService.sendIntentTextiOS(postTags);
	}
	sharingTextService.prototype.setIconReady(shareTextButton);
};

module.exports = sharingTextService;
