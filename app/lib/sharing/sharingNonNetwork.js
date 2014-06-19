/*
 * This page handles functionality with Sharing that does not involve Ti calls
 */


/*
 * Defines path to sharingNetwork file
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
	//Note: inactive version of this function lives in sharingNetwork.js
	shareImageButtonId.enabled = false;
	shareImageButtonId.backgroundImage = "/images/iconCameraActive.png";
}

/*
 * Sets properties of the text sharing button as created by sharingNetwork and returns the button
 * File that calls the function is responsible for placing it in the correct view
 */
function initiateTextShareButton(json) {
	//button to open text sharing
	var shareTextButton = retrieveNetworkSharing.createTextShareButton();	
	toggleTextShareButtonStatusInactive(shareTextButton);
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

/*
 * Initializes camera operation
 */
function initiateCamera (json, shareImageButtonId, rightNavButton) {
	//retrieve tags from json
	var postTags = getPostTags(json);
	retrieveNetworkSharing.openCamera(postTags, shareImageButtonId, rightNavButton);
}


/*
 * Sets properties of the image sharing button as created by sharingNetwork and returns the button
 * The button points towards the openCamera function, which initializes the image intent. Both live in sharingNetwork
 * File that calls the function is responsible for placing it in the correct view
 */
function initiateImageShareButton(json, rightNavButton) {
	//button to open photo sharing
	var shareImageButton = retrieveNetworkSharing.createImageShareButton();
	retrieveNetworkSharing.toggleImageShareButtonStatusInactive(shareImageButton);
	//Add a listener so that when clicked, openCamera is called
	shareImageButton.addEventListener('click', function(e) {
		//disable camera button
		toggleImageShareButtonStatusActive(shareImageButton);
		//retrieve json tags
		var postTags = getPostTags(json);
		//open camera and send intents
		retrieveNetworkSharing.openCamera(postTags, shareImageButton, rightNavButton);
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
 * Points towards the platform specific text intent creator in sharingNetwork then toggles the text sharing button's active status
 * Note: equivalent platform chooser is embedded in openCamera, which lives in sharingNetwork
 */
function initiateIntentText(postTagsString, shareTextButtonId) {
	//Choose appropriate intent creator
	if (OS_ANDROID) {
		retrieveNetworkSharing.sendIntentTextAndroid(postTags, shareTextButtonId);
	} else if (OS_IOS) {
		retrieveNetworkSharing.sendIntentTextiOS(postTags, shareTextButtonId);
	} else {
		alert("Unsupported platform");
	}
	//Reenable share text button
	toggleTextShareButtonStatusInactive(shareTextButtonId);
}

/*
 * iOS doesn't automatically deal with Instagram, so this function is called when the custom Instagram button is pressed in the iOS sharing menu
 */
function openInstagram(imageFilePathInstagram, rightNavButton) {

	alert("About to try opening docViewer. imageFilePathInstagram: " + imageFilePathInstagram);

	var docViewer = retrieveNetworkSharing.openInstagramView(imageFilePathInstagram);
	docViewer.UTI = "com.instagram.exclusivegram";
	docViewer.show({
		view : rightNavButton,
		animated : true
	});
}

/*
 * If the background image is present, the title is unnecessary and removed
 */
function eraseButtonTitleIfBackgroundPresent(buttonName) {
	//removes the title field of a button if a background image is detected
	if (buttonName.backgroundImage != "") {
		buttonName.title = "";
	}
}

//Set path to sharingNetwork
setPathForLibDirectory('sharing/sharingNetwork');
//Export local functions
module.exports.initiateTextShareButton = initiateTextShareButton;
module.exports.initiateImageShareButton = initiateImageShareButton;