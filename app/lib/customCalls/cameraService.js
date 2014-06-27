function cameraService(){
	intentService = Alloy.Globals.setPathForLibDirectory('customCalls/intentService');
	intentService = new intentService();
};

cameraService.prototype.takePicture = function(postTags, shareImageButton, instagramAnchor) {
	var imageFilePath;
	Titanium.Media.showCamera({
		saveToPhotoGallery : true,
		mediaTypes : Titanium.Media.MEDIA_TYPE_PHOTO,
		success : function(event) {
			var fileName = 'excl' + new Date().getTime() + '.jpg';
			var imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
			imageFile.write(event.media);
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {				
				imageFilePath = imageFile.nativePath;
				if (OS_ANDROID){
					intentService.sendIntentImageAndroid(postTags, imageFilePath);
				}
				else if (OS_IOS){
					fileNameInstagram = "excl" + new Date().getTime() + "_temp.ig";
					imageFileInstagram = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fileNameInstagram);
					imageFileInstagram.write(event.media);
					alert("Instagram file saved: " + imageFileInstagram.nativePath);
					intentService.sendIntentImageiOS(postTags, imageFilePath, imageFileInstagram.nativePath, instagramAnchor);
				}
			}	
		},
		cancel : function() {
			//MAY NEED TO SET CAMERA ICON AS READY
		},
		error : function(Error) {
			alert("Camera not working");
		}
	});
};

module.exports = cameraService;