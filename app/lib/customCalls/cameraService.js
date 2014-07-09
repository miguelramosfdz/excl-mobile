function setPathForLibDirectory(libFile){
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function cameraService(){
	intentService = setPathForLibDirectory('customCalls/intentService');
	intentService = new intentService();
	loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
	loadingSpinner = new loadingSpinner();
};

cameraService.prototype.takePicture = function(postTags, shareImageButton, instagramAnchor) {
	var imageFilePath;
	Titanium.Media.showCamera({
		saveToPhotoGallery : true,
		mediaTypes : Titanium.Media.MEDIA_TYPE_PHOTO,
		success : function(event) {
			win = Ti.UI.createWindow({ });
			loadingSpinner.addTo(win);
			loadingSpinner.show();
			win.open();
			var fileName = 'excl' + new Date().getTime() + '.jpg';
			var imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
			imageFile.write(event.media);
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {				
				imageFilePath = imageFile.nativePath;
				if (OS_ANDROID){
					loadingSpinner.hide();
					intentService.sendIntentImageAndroid(postTags, imageFilePath);
				}
				else if (OS_IOS){
					fileNameInstagram = "excl" + new Date().getTime() + "_temp.ig";
					imageFileInstagram = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fileNameInstagram);
					imageFileInstagram.write(event.media);
					loadingSpinner.hide();
					intentService.sendIntentImageiOS(postTags, imageFilePath, imageFileInstagram.getNativePath(), instagramAnchor);
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