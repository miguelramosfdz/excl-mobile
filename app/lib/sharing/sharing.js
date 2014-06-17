function retrievePostTags(componentId, postId) {
	//Retrieve social media message, which contains social media tags
	var postTags = "";
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			alert("length: " + returnedData.data.component.posts.length);
			for (var i = 0; i < returnedData.data.component.posts.length; i++) {
				//find correct post
				alert("post id: " + returnedData.data.component.posts[i].id);
				if (returnedData.data.component.posts[i].id == postId) {
					alert("found post");
					//pull tags to array
					postTags = returnedData.data.component.posts[i].jsonObj['social-media-message'];
					alert("postTags = " + postTags);
				};
			};
		}
	});
	alert("passed everything");
	return postTags;
}

function eraseButtonTitleIfBackgroundPresent(buttonName) {
	//removes the title field of a button if a background image is detected
	if (buttonName.backgroundImage != "") {
		buttonName.title = "";
	}
}

function createShareButtons() {
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
		sendIntentText();
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
		openCamera();
	});
	eraseButtonTitleIfBackgroundPresent(shareImage);
	viewSharingTemp.add(shareImage);

	//JSON test button
	var getTags = Ti.UI.createButton({
		text : "Get tags",
		height : "40dip",
		width : "40dip",
		left : "0"
	});
	getTags.addEventListener('click', function(e) {
		var test = retrievePostTags(componentId, postId);
		alert("returned: " + test);
	});
	viewSharingTemp.add(getTags);
	
	// $.viewShareBase.add(viewSharingTemp);
	return viewSharingTemp;

}

function openCamera() {
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
				alert("Instagram file name" + fileNameInstagram);
				var imageFileInstagram = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileNameInstagram) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileNameInstagram);
				imageFileInstagram.write(event.media);
			}

			//save file path to be shared
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				imageFilePath = imageFile.nativePath;
				imageFilePathInstagram = imageFileInstagram.nativePath;
				sendIntentImage(imageFilePath);
			}
		},
		cancel : function() {
		},
		error : function(Error) {
			alert("Camera not working");
		}
	});
}

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

function sendIntentImageAndroid(contentTextComment, imageFilePath) {

	//Create and send image intent for android.
	var intentImage = Ti.Android.createIntent({
		type : "image/*",
		action : Ti.Android.ACTION_SEND
	});
	intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
	intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, imageFilePath);
	intentImage.putExtra(Ti.Android.EXTRA_TEXT, contentTextComment);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share photo via"));
}

function openInstagram(imageFilePathInstagram) {
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

}

function sendIntentImageiOS(contentTextComment, imageFilePath) {
	//Use TiSocial.Framework module to send image to other apps
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			image : imageFilePath,
			text : contentTextComment, 
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

function sendIntentText() {
	//function to send information to other apps

	//Get text to be sent from WP
	contentTextComment = "#cmh #awesome http://www.cmhouston.org";

	//Note: in kiosk mode, restrict available apps to email only
	if (OS_ANDROID) {
		sendIntentTextAndroid(contentTextComment);
	} else if (OS_IOS) {
		sendIntentTextiOS(contentTextComment);
	} else {
		alert("Unsupported platform (text sharing)");
	}
}

function sendIntentTextAndroid(contentTextComment) {
	//Create and send text intent for android. Includes area for main text and url text to be appended
	var intentText = Ti.Android.createIntent({
		action : Ti.Android.ACTION_SEND,
		type : 'text/plain'
	});

	intentText.putExtra(Ti.Android.EXTRA_TEXT, contentTextComment);
	intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentText, "Send message via"));
}

function sendIntentTextiOS(contentTextComment) {
	//Use TiSocial.Framework module to share text
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			text : contentTextComment
		});
	} else {
		alert("Text sharing is not available on this device");
	}
}

module.exports.retrievePostTags = retrievePostTags;
module.exports.createShareButtons = createShareButtons;
