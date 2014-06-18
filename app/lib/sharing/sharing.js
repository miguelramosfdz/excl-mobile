/*
 * This page contains everything that is left with sharing
 */

var retrieveNetworkSharing;
function setPathForLibDirectory(retrieveNetworkSharingLib) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		retrieveNetworkSharing = require("../../lib/" + retrieveNetworkSharingLib);
	} else {
		retrieveNetworkSharing = require(retrieveNetworkSharingLib);
	}
}

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
	var shareTextButton = retrieveSharing.createTextShareButton();	
	toggleTextShareButtonStatusInactive(shareTextButton);
	//Add a listener so that when clicked, retrieveTextPostTags is called (this function calls sendIntentText)
	shareTextButton.addEventListener('click', function(e) {
		//toggleTextShareButtonStatusActive(shareTextButton);
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
function createImageShareButton(json, rightNavButton) {
	//button to open photo sharing
	var shareImageButton = retrieveSharing.createImageShareButton();
	toggleImageShareButtonStatusInactive(shareImageButton);
	//Add a listener so that when clicked, openCamera is called
	shareImageButton.addEventListener('click', function(e) {
		toggleImageShareButtonStatusActive(shareImageButton);
		retrieveNetworkSharing.openCamera(json, shareImageButton, rightNavButton);
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
		retrieveNetworkSharing.sendIntentTextAndroid(postTags, shareTextButtonId);
	} else if (OS_IOS) {
		sendIntentTextiOS(postTags, shareTextButtonId);
	} else {
		alert("Unsupported platform");
	}
	//Reenable share text button
	toggleTextShareButtonStatusInactive(shareTextButtonId);
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
 * Calls the platform-specific sendIntent function for an image
 */
function sendIntentImage(json, imageFilePath, shareImageButtonId, rightNavButton) {
	postTags = getPostTags(json);
	//reenable share button
	toggleImageShareButtonStatusInactive(shareImageButtonId);
	if (OS_ANDROID) {
		retrieveNetworkSharing.sendIntentImageAndroid(postTags, imageFilePath);
	} else if (OS_IOS) {
		sendIntentImageiOS(postTags, imageFilePath, rightNavButton);
	} else {
		alert("Unsupported platform (image sharing)");
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
			//callback : openInstagram(imageFilePath)
			callback : function(e) {
				openInstagram(imageFilePathInstagram, rightNavButton);
			}
		}]);
	} else {
		alert("Photo sharing is not available on this device");
	}
}

/*
 * iOS doesn't automatically deal with Instagram, so this function is called when the custom Instagram button is pressed in the iOS sharing menu
 */
function openInstagram(imageFilePathInstagram, rightNavButton) {

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

	var docViewer = retrieveNetworkSharing.openInstagramView(imageFilePathInstagram);
	docViewer.UTI = "com.instagram.exclusivegram";
	docViewer.show({
		view : rightNavButton,
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

setPathForLibDirectory('retrieveNetworkSharing');
//These functions can be called by outside files:
module.exports.createTextShareButton = createTextShareButton;
module.exports.createImageShareButton = createImageShareButton;
