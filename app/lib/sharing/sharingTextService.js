function sharingTextService(){
	buttonService = sharingTextService.prototype.setPathForLibDirectory('customCalls/buttonService');
	buttonService = new buttonService();
	iconService = sharingTextService.prototype.setPathForLibDirectory('customCalls/iconService');
	iconService = new iconService();
	intentService = sharingTextService.prototype.setPathForLibDirectory('customCalls/intentService');
	this.setIntentService( new intentService() );
}

sharingTextService.prototype.setIntentService = function(service){
	intentService = service;
};

sharingTextService.prototype.getIntentService = function(){
	return intentService;
};

sharingTextService.prototype.setPathForLibDirectory = function(libFile){
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

sharingTextService.prototype.initiateTextShareButton = function(json) {
	var shareTextButton = buttonService.createButton('shareTextButton', 'Text');
	this.setIconReady(shareTextButton);

	shareTextButton.addEventListener('click', function(e) {
		this.setIconBusy(shareTextButton);
		postTags = this.getPostTags(json);
		this.initiateIntentText(postTags, shareTextButton);
	});
	
	buttonService.eraseButtonTitleIfBackgroundPresent(shareTextButton);
	return shareTextButton;
};

sharingTextService.prototype.setIconReady = function(shareTextButton){
	iconService.setIcon(shareTextButton, 'share_ready.png');
	buttonService.setButtonEnabled(shareTextButton, true);
};

sharingTextService.prototype.setIconBusy = function(shareTextButton){
	iconService.setIcon(shareTextButton, 'share_busy.png');
	buttonService.setButtonEnabled(shareTextButton, false);
};

sharingTextService.prototype.getPostTags = function(json) {
	postTags = json.social_media_message;
	return postTags;
};

sharingTextService.prototype.initiateIntentText = function(postTags, shareTextButton) {
	//Choose appropriate intent creator
	if (OS_ANDROID) {
		intentService.sendIntentTextAndroid(postTags);
	} else if (OS_IOS) {
		intentService.sendIntentTextiOS(postTags);
	}
	sharingTextService.prototype.setIconReady(shareTextButton);
};

module.exports = sharingTextService;
