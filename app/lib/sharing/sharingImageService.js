function sharingImageService(){
	buttonService = setPathForLibDirectory('customCalls/buttonService');
	buttonService = new buttonService();
	iconService = setPathForLibDirectory('customCalls/iconService');
	iconService = new iconService();
	intentService = setPathForLibDirectory('customCalls/intentService');
	intentService = new intentService();
	cameraService = setPathForLibDirectory('customCalls/cameraService');
	cameraService = new cameraService();
}

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

sharingImageService.prototype.initiateImageShareButton = function(json) {
	var shareImageButton = buttonService.createButton('shareImageButton', 'Image');
	sharingImageService.prototype.setIconReady(shareImageButton);

	shareImageButton.addEventListener('click', function(e) {
		sharingImageService.prototype.setIconBusy(shareImageButton);
		postTags = sharingImageService.prototype.getPostTags(json);
		//var intentFunction = function() { sharingImageService.prototype.initiateIntentImage(postTags, imageFilePath, shareImageButton); };
		cameraService.takePicture(postTags, shareImageButton);
		sharingImageService.prototype.setIconReady(shareImageButton);
	});
	
	buttonService.eraseButtonTitleIfBackgroundPresent(shareImageButton);
	return shareImageButton;
};


sharingImageService.prototype.setIconReady = function(shareImageButton){
	iconService.setIcon(shareImageButton, 'camera_ready.png');
};

sharingImageService.prototype.setIconBusy = function(shareImageButton){
	iconService.setIcon(shareImageButton, 'camera_busy.png');
};

sharingImageService.prototype.getPostTags = function(json) {
	postTags = json.social_media_message;
	return postTags;
};

//Not used at the moment, since we were forced to call the intent functions from within takePicture
sharingImageService.prototype.initiateIntentImage = function(postTags, imageFilePath, shareImageButton) {
	//Choose appropriate intent creator
	if (OS_ANDROID) {
		intentService.sendIntentImageAndroid(postTags, imageFilePath);
	} else if (OS_IOS) {
		intentService.sendIntentImageiOS(postTags, imageFilePath);
	}
	sharingImageService.prototype.setIconReady(shareImageButton);
};

module.exports = sharingImageService;