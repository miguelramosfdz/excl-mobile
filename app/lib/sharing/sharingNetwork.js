/*
 * This file contains all of the Titanium network calls related to Sharing functionality
 */

//associates retrieveSharing to sharing.js
var retrieveSharing;
function setPathForLibDirectory(retrieveSharingLib) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		retrieveSharing = require("../../lib/" + retrieveSharingLib);
	} else {
		retrieveSharing = require(retrieveSharingLib);
	}
}


/*
 * Returns the button for text sharing
 * File that calls the function is responsible for placing it in the correct view
 */
function createTextShareButton() {
	//button to open text sharing
	var shareTextButton = Ti.UI.createButton({
		id : 'shareTextButton',
		title : "Text",
		height : "40dip",
		width : "40dip",
		left : "0",
		top : "0"
	});
	return shareTextButton;
}

/*
 * Returns the button for image sharing
 * When clicked, the openCamera function is called, which then calls sendIntentImage
 * File that calls the function is responsible for placing it in the correct view
 */
function createImageShareButton() {
	//button to open photo sharing
	var shareImageButton = Ti.UI.createButton({
		id : 'shareImageButton',
		text : "Camera",
		height : "40dip",
		width : "40dip",
		left : "70dip",
		top : "0"
	});
	return shareImageButton;
}

/*
 * Opens the camera, saves the picture the user takes; calls sendIntent function
 */
function openCamera(json, shareImageButtonId, rightNavButton) {
	//Holds all functionality related to sharing image through camera

	//declare variable to store image file path
	var imageFilePath;
	//Save process for camera and updates view to display new picture
	Titanium.Media.showCamera({
		saveToPhotoGallery : true,
		mediaTypes : Titanium.Media.MEDIA_TYPE_PHOTO,
		success : function(event) {

			//create image file and save name for future use
			var fileName = 'excl' + new Date().getTime() + '.jpg';

			//save file
			var imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
			imageFile.write(event.media);

			if (OS_IOS) {
				//Instagram-specific code
				var fileNameInstagram = 'excl' + new Date().getTime() + '_temp.ig';
				var imageFileInstagram = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fileNameInstagram);

				if (!imageFileInstagram.exists()) {
					imageFileInstagram.write(event.media);
				}
			}

			//save file path to be shared
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				imageFilePath = imageFile.nativePath;
				if (OS_IOS) {
					imageFilePathInstagram = imageFileInstagram.nativePath;
				}

				//send file path to intent creation
				retrieveSharing.sendIntentImage(json, imageFilePath, shareImageButtonId, rightNavButton);
			}
		},
		cancel : function() {
			//reenable sharing button to account for premature exiting of camera
			retrieveSharing.toggleImageShareButtonStatusInactive(shareImageButtonId);
		},
		error : function(Error) {
			alert("Camera not working");
		}
	});
}

/*
 * iOS doesn't automatically deal with Instagram, so this function is called when the custom Instagram button is pressed in the iOS sharing menu
 */
function openInstagramView(imageFilePathInstagram) {
	var docViewer = Ti.UI.iOS.createDocumentViewer({
		url : imageFilePathInstagram
	});
	return docViewer;
}

/*
 * Sends an Android intent with prepopulated text content
 */
function sendIntentTextAndroid(postTags, shareTextButtonId) {
	//Create and send text intent for android. Includes area for main text and url text to be appended
	var intentText = Ti.Android.createIntent({
		action : Ti.Android.ACTION_SEND,
		type : 'text/plain'
	});
	intentText.putExtra(Ti.Android.EXTRA_TEXT, postTags);
	intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentText, "Send message via"));
}

/*
 * Sends an Android intent with prepopulated text content and the image that was just taken
 */
function sendIntentImageAndroid(postTags, imageFilePath) {
	//Create and send image intent for android.
	var intentImage = Ti.Android.createIntent({
		type : "image/*",
		action : Ti.Android.ACTION_SEND
	});
	intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
	intentImage.putExtra(Ti.Android.EXTRA_TEXT, postTags);
	intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, imageFilePath);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share photo via"));
}



///////////////////////////////////
//set associating with sharing.js
setPathForLibDirectory('sharing/sharing');

