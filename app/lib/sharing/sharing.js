var dataRetriever = require("dataRetriever");

/*
 * Deprecated; split into createTextShareButton and createImageShareButton
 * By splitting it, we also have no need for viewSharingTemp, which was the view that held the two buttons
 * Instead, each function now returns their respective button, and the file that calls the function is responsible for placing it in the correct view
 */
function createShareButtons(postId, jsonURL) {
	//create view that will serve as temporary backing for sharing buttons
	var viewSharingTemp = Ti.UI.createView({
		layout : "vertical",
		width : "100%",
		height : "200dip"
	});

	//button to open text sharing
	var shareText = Ti.UI.createButton({
		id : 'shareText',
		title : "Text",
		height : "40dip",
		width : "40dip",
		left : "0",
		backgroundImage : "/images/iconShare.png"
	});
	shareText.addEventListener('click', function(e) {
		retrieveTextPostTags(postId, jsonURL);
	});
	eraseButtonTitleIfBackgroundPresent(shareText);
	viewSharingTemp.add(shareText);

	//button to open photo sharing
	var shareImage = Ti.UI.createButton({
		id : 'shareImage',
		text : "Camera",
		height : "40dip",
		width : "40dip",
		left : "0",
		backgroundImage : "/images/iconCamera.png"
	});
	shareImage.addEventListener('click', function(e) {
		openCamera(postId, jsonURL);
	});
	eraseButtonTitleIfBackgroundPresent(shareImage);
	viewSharingTemp.add(shareImage);

	// $.viewShareBase.add(viewSharingTemp);
	return viewSharingTemp;

}

/*
 * Returns the button for text sharing
 * File that calls the function is responsible for placing it in the correct view
 */
function createTextShareButton(postId, jsonURL) {
	//button to open text sharing
	var shareTextButton = Ti.UI.createButton({
		id : 'shareTextButton',
		title : "Text",
		height : "40dip",
		width : "40dip",
		left : "0",
		backgroundImage : "/images/iconShare.png"
	});

	//Add a listener so that when clicked, retrieveTextPostTags is called (this function calls sendIntentText)
	shareTextButton.addEventListener('click', function(e) {
		retrieveTextPostTags(postId, jsonURL);
	});
	eraseButtonTitleIfBackgroundPresent(shareTextButton);

	return shareTextButton;
}

/*
 * Returns the button for image sharing
 * When clicked, the openCamera function is called, which then calls sendIntentImage
 * File taht calls the function is responsible for placing it in the correct view
 */
function createImageShareButton(postId, jsonURL) {
	//button to open photo sharing
	var shareImageButton = Ti.UI.createButton({
		id : 'shareImageButton',
		text : "Camera",
		height : "40dip",
		width : "40dip",
		left : "0",
		backgroundImage : "/images/iconCamera.png"
	});

	//Add a listener so that when clicked, openCamera is called
	shareImageButton.addEventListener('click', function(e) {
		openCamera(postId, jsonURL);
	});
	eraseButtonTitleIfBackgroundPresent(shareImageButton);

	return shareImageButton;
}

/*
 * Calls the platform-specific sendIntent function for text
 */
function retrieveTextPostTags(postId, jsonURL) {
	//Retrieve social media message, which contains social media tags. This is used for text intents/iOS equivalents.
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			var foundPost = false;
			for (var i = 0; i < returnedData.data.component.posts.length; i++) {
				//find correct post
				if (returnedData.data.component.posts[i].id == postId && foundPost == false) {
					//pull tags from post if you have not found the post yet
					foundPost = true;
					var postTags = returnedData.data.component.posts[i].social_media_message;
					//send tags to intents and start intents
					if (OS_ANDROID) {
						sendIntentTextAndroid(postTags);
					} else if (OS_IOS) {
						sendIntentTextiOS(postTags);
					} else {
						alert("Unsupported platform (text sharing)");
					}
				}
			}
			if (found == false) {
				alert("Specified post ID not found");
			}
		}
	});
}

/*
 * Sends an Android intent with prepopulated text content
 */
function sendIntentTextAndroid(postTags) {
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
function sendIntentTextiOS(postTags) {
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
 * Opens camera and saves the photo the user takes; calls sendIntentImage
 */
function retrieveImagePostTags(postId, jsonURL, imageFilePath) {
	//Retrieve social media message, which contains social media tags. This is used for image intents/iOS equivalent
	var postTags = "";
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			var foundPost = false;
			for (var i = 0; i < returnedData.data.component.posts.length; i++) {
				//find correct post
				if (returnedData.data.component.posts[i].id == postId) {
					//pull tags from post
					foundPost = true;
					postTags = returnedData.data.component.posts[i].social_media_message;
					//send tags to intents and start intents
					if (OS_ANDROID) {
						sendIntentImageAndroid(postTags, imageFilePath);
					} else if (OS_IOS) {
						sendIntentImageiOS(postTags, imageFilePath);
					} else {
						alert("Unsupported platform (photo sharing)");
					}
				}
			}
			if (found == false) {
				alert("Specified post ID not found");
			}
		}
	});
}

function openCamera(postId, jsonURL) {
	//Holds all functionality related to sharing image through camera

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
			if (OS_IOS) {
				var fileNameInstagram = 'excl' + new Date().getTime() + '.jpg';
				//Or .ig?
				var imageFileInstagram = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileNameInstagram) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileNameInstagram);
				imageFileInstagram.write(event.media);
			}

			//save file path to be shared
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				imageFilePath = imageFile.nativePath;
				imageFilePathInstagram = imageFileInstagram.nativePath;

				//send file path to intent creation
				retrieveImagePostTags(postId, jsonURL, imageFilePath);
			}
		},
		cancel : function() {
		},
		error : function(Error) {
			alert("Camera not working");
		}
	});
}

/*
 * Calls the platform-specific sendIntent function for an image
 */
function sendIntentImage(imageFilePath) {
	//create and send an image intent

	//Get text to be sent from WP
	contentTextComment = "#cmh #awesome http://www.cmhouston.org";

	if (OS_ANDROID) {
		sendIntentImageAndroid(contentTextComment, imageFilePath);
	} else if (OS_IOS) {
		sendIntentImageiOS(contentTextComment, imageFilePath);
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

	//WebView attempt
	instaWebView = Titanium.UI.createWebView({
		url : 'www.instagram.com'
	});
	var instaWindow = Titanium.UI.createWindow();
	instaWindow.add(instaWebView);
	instaWindow.open({
		modal : true
	});

}

function eraseButtonTitleIfBackgroundPresent(buttonName) {
	//removes the title field of a button if a background image is detected
	if (buttonName.backgroundImage != "") {
		buttonName.title = "";
	}
}

//These functions can be called by outside files:
module.exports.createTextShareButton = createTextShareButton;
module.exports.createImageShareButton = createImageShareButton;