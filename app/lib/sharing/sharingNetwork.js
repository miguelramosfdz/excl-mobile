/*
 * This page handles functionality with Sharing that involves Ti calls
 */

/*
 * Function to toggle activated buttons, changing the share button's enabled and backgroundimage status
 */
function toggleImageShareButtonStatusInactive(shareImageButtonId) {
	//Changes background and enabled status of shareimagebutton to inactive/ready mode
	shareImageButtonId.enabled = true;
	shareImageButtonId.backgroundImage = "/images/iconCameraInactive.png";
}

/*
 * Creates and returns the text sharing button to be used in initializeTextShareButton in sharingNonNetwork
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
 * Creates and returns the image sharing button to be used in initializeImageShareButton in sharingNonNetwork
 */
function createImageShareButton() {
	//button to open photo sharing
	var shareImageButton = Ti.UI.createButton({
		id : 'shareImageButton',
		text : "Camera",
		height : "40dip",
		width : "40dip",
		left : "40dip",
		top : "0"
	});
	return shareImageButton;
}

/*
 * Opens the camera, saves the picture the user takes; calls sendIntent function
 */
function openCamera(postTagsString, shareImageButtonId, rightNavButton) {
	//Holds all functionality related to sharing image through camera

	//declare variable to store image file path
	var imageFilePath, imageFilePathInstagram;
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
			//Instagram-specific code
			if (OS_IOS) {
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
				if (OS_ANDROID) {
					sendIntentImageAndroid(postTagsString, imageFilePath);
				} else if (OS_IOS) {
					sendIntentImageiOS(postTagsString, imageFilePath, rightNavButton);
				} else {
					alert("Unsupported platform (image sharing)");
				}
				//reenable sharing button to account for premature exiting of camera
				toggleImageShareButtonStatusInactive(shareImageButtonId);
			}
		},
		cancel : function() {
			//reenable sharing button to account for premature exiting of camera
			toggleImageShareButtonStatusInactive(shareImageButtonId);
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

/*
 * Opens iOS share menu and sends prepopulated text content
 */
function sendIntentTextiOS(postTags, shareTextButtonId) {
	//Use TiSocial.Framework module to share text
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			text : postTags
		});
		//Reenable share text button
		toggleTextShareButtonStatusInactive(shareTextButtonId);
	} else {
		alert("Text sharing is not available on this device");
	}
}

/*
 * Opens iOS share menu and sends prepopulated text content and image that was just taken
 */
function sendIntentImageiOS(postTags, imageFilePath, rightNavButton) {
	//Use TiSocial.Framework module to send image to other apps
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			image : imageFilePath,
			text : postTags
		}, [{
			title : "Instagram",
			type : "open.instagram",
			image : "/images/instagram-256.png",
			callback : function(e) {
				openInstagram(imageFilePathInstagram, rightNavButton);
				//Note: openInstagram lives in sharingNonNetwork
			}}]);
	} else {
		alert("Photo sharing is not available on this device");
	}
}

//Export functions for use by other files
module.exports.createTextShareButton = createTextShareButton;
module.exports.sendIntentTextAndroid = sendIntentTextAndroid;
module.exports.sendIntentTextiOS = sendIntentTextiOS;
module.exports.createImageShareButton = createImageShareButton;
module.exports.openCamera = openCamera;
module.exports.sendIntentImageAndroid = sendIntentImageAndroid;
module.exports.sendIntentImageiOS = sendIntentImageiOS;
module.exports.openInstagramView = openInstagramView;
module.exports.toggleImageShareButtonStatusInactive = toggleImageShareButtonStatusInactive; 