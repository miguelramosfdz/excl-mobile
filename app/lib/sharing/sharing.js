var dataRetriever = require("dataRetriever");
var imageFilePathInstagram = "";

/*
 * Functions to toggle activated buttons, changing the share buttons' enabled and backgroundimage status
 */
function toggleTextShareButtonStatusActive(shareTextButtonId) {
	//Changes background and enabled status of sharetextbutton to active/clicked mode
	shareTextButtonId.enabled = false;
	shareTextButtonId.backgroundImage = "/images/iconShareActive.png";
}

function toggleTextShareButtonStatusInactive(shareTextButtonId) {
	//Changes background and enabled status of sharetextbutton to inactive/ready mode
	shareTextButtonId.enabled = true;
	shareTextButtonId.backgroundImage = "/images/iconShareInactive.png";
}

function toggleImageShareButtonStatusActive(shareImageButtonId) {
	//Changes background and enabled status of shareimagebutton to active/clicked mode
	shareImageButtonId.enabled = false;
	shareImageButtonId.backgroundImage = "/images/iconCameraActive.png";
}

function toggleImageShareButtonStatusInactive(shareImageButtonId) {
	//Changes background and enabled status of shareimagebutton to inactive/ready mode
	shareImageButtonId.enabled = true;
	shareImageButtonId.backgroundImage = "/images/iconCameraInactive.png";
}

/*
 * Returns the button for text sharing
 * File that calls the function is responsible for placing it in the correct view
 */
function createTextShareButton(json) {
	//button to open text sharing
	var shareTextButton = Ti.UI.createButton({
		id : 'shareTextButton',
		title : "Text",
		height : "40dip",
		width : "40dip",
		left : "0",
		top : "0"
	});
	toggleTextShareButtonStatusInactive(shareTextButton);

	//Add a listener so that when clicked, retrieveTextPostTags is called (this function calls sendIntentText)
	shareTextButton.addEventListener('click', function(e) {
		toggleTextShareButtonStatusActive(shareTextButton);
		sendIntentText(json, shareTextButton);
	});
	eraseButtonTitleIfBackgroundPresent(shareTextButton);

	return shareTextButton;
}

/*
 * Returns the button for image sharing
 * When clicked, the openCamera function is called, which then calls sendIntentImage
 * File that calls the function is responsible for placing it in the correct view
 */
function createImageShareButton(json) {
	//button to open photo sharing
	var shareImageButton = Ti.UI.createButton({
		id : 'shareImageButton',
		text : "Camera",
		height : "40dip",
		width : "40dip",
		left : "70dip",
		top : "0"
	});
	toggleImageShareButtonStatusInactive(shareImageButton);
	//Add a listener so that when clicked, openCamera is called
	shareImageButton.addEventListener('click', function(e) {
		toggleImageShareButtonStatusActive(shareImageButton);
		openCamera(json, shareImageButton);
	});
	eraseButtonTitleIfBackgroundPresent(shareImageButton);

	return shareImageButton;
}

/*
 * Gets the postTag from the json
 */
function getPostTags(json) {
	//Retrieve social media message, which contains social media tags. This is used for text and image intents/iOS equivalents.
	postTags = json.social_media_message;
	
	return postTags;
}

/*
 * Calls the platform-appropriate sendIntentText function
 */
function sendIntentText(json, shareTextButtonId) {
	postTags = getPostTags(json);
	if (OS_ANDROID) {
		sendIntentTextAndroid(postTags, shareTextButtonId);
	} else if (OS_IOS) {
		sendIntentTextiOS(postTags, shareTextButtonId);
	} else {
		alert("Unsupported platform");
	}
}

/*
 * Sends an Android intent with prepopulated text content
 */
function sendIntentTextAndroid(postTags, shareTextButtonId) {
	//Reenable text share button
	toggleTextShareButtonStatusInactive(shareTextButtonId);
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
 * Opens iOS share menu and sends prepopulated text content
 */
function sendIntentTextiOS(postTags, shareTextButtonId) {
	//Reenable text share button
	toggleTextShareButtonStatusInactive(shareTextButtonId);
	//Use TiSocial.Framework module to share text
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			text : postTags
		});
	} else {
		alert("Text sharing is not available on this device");
	}
}

/*
 * Opens the camera, saves the picture the user takes; calls sendIntent function
 */
function openCamera(json, shareImageButtonId) {
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

			//Instagram-specific code
			var fileNameInstagram = 'excl' + new Date().getTime() + '_temp.ig';
			var imageFileInstagram = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fileNameInstagram);

			if (!imageFileInstagram.exists()) {
				imageFileInstagram.write(event.media);
			}

			//save file path to be shared
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				imageFilePath = imageFile.nativePath;
				imageFilePathInstagram = imageFileInstagram.nativePath;

				//send file path to intent creation
				sendIntentImage(json, imageFilePath, shareImageButtonId);
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
 * Calls the platform-specific sendIntent function for an image
 */
function sendIntentImage(json, imageFilePath, shareImageButtonId) {
	postTags = getPostTags(json);
	//reenable share button
	toggleImageShareButtonStatusInactive(shareImageButtonId);
	if (OS_ANDROID) {
		sendIntentImageAndroid(postTags, imageFilePath);
	} else if (OS_IOS) {
		sendIntentImageiOS(postTags, imageFilePath);
	} else {
		alert("Unsupported platform (image sharing)");
	}
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
 * Opens iOS share menu and sends prepopulated text content and image that was just taken
 */
function sendIntentImageiOS(postTags, imageFilePath) {
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
			//callback : openInstagram(imageFilePath)
			callback : function(e) {
				openInstagram(imageFilePathInstagram);
			}
		}]);
	} else {
		alert("Photo sharing is not available on this device");
	}
}

/*
 * iOS doesn't automatically deal with Instagram, so this function is called when the custom Instagram button is pressed in the iOS sharing menu
 */
function openInstagram(imageFilePathInstagram) {

	/*
	 alert("imageFilePathInstagram in openInstagram: " + imageFilePathInstagram);
	 var docviewer = Ti.UI.iOS.createDocumentViewer({
	 url : "/images/alexbutton.png"
	 });
	 //Testing a sample image
	 alert("Created docviewer");
	 var annotationObj = new Object();
	 annotationObj.InstagramCaption = "Caption sample";

	 docviewer.UTI = "com.instagram.exclusivegram";
	 // docviewer.annotation = annotationObj.InstagramCaption;

	 docviewer.show();
	 alert("Showed docviewer");
	 */

	/*//Use iPhone URL schemes to open app- doesn't reliably open to a specific page, haven't gotten the caption to work
	 //Doesn't seem like there's an easy way to upload a recently taken photo
	 var instagramURL = "instagram://camera&caption=hello%20world";
	 if (Titanium.Platform.canOpenURL(instagramURL)){
	 Titanium.Platform.openURL(instagramURL);
	 }
	 */

	/*
	 //WebView attempt
	 instaWebView = Titanium.UI.createWebView({
	 url : 'www.instagram.com'
	 });
	 var instaWindow = Titanium.UI.createWindow();
	 instaWindow.add(instaWebView);
	 instaWindow.open({
	 modal : true
	 });
	 */

	alert("About to try opening docViewer. imageFilePathInstagram: " + imageFilePathInstagram);

	var docViewer = Ti.UI.iOS.createDocumentViewer({
		url : imageFilePathInstagram
	});
	docViewer.UTI = "com.instagram.exclusivegram";
	docViewer.show({
		view : Ti.UI.currentWindow,
		animated : true
	});
}

/*
 * If the background image is present, the title is unnecessary
 */
function eraseButtonTitleIfBackgroundPresent(buttonName) {
	//removes the title field of a button if a background image is detected
	if (buttonName.backgroundImage != "") {
		buttonName.title = "";
	}
}

//These functions can be called by outside files:
module.exports.createTextShareButton = createTextShareButton;
module.exports.createImageShareButton = createImageShareButton;
