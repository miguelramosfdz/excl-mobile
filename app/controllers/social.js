//top level vars
var imageFilePath;
var imageFilePathInstagram;

function formatButtonIOS(buttonName) {
	//Format buttons for IOS
	if (OS_IOS) {
		//remove title field if image is present
		if (buttonName.backgroundImage != "") {
			buttonName.title = "";
		}
	}
}

function formatButtonAndroid(buttonName) {
	//format buttons for Android
	if (OS_ANDROID) {
		//remove title field if image is present
		if (buttonName.backgroundImage != "") {
			buttonName.title = "";
		}
	}
}

function createShareButtons() {
	//create view that will serve as temporary backing for sharing buttons
	var viewSharingTemp = Ti.UI.createView({
		layout : "vertical",
		width : "100%",
		height : "200dip"
	});
	$.viewShareBase.add(viewSharingTemp);

	//button to open text sharing
	var shareText = Ti.UI.createButton({
		id : 'shareText',
		title : "Text",
		height : "70dip",
		width : "60dip",
		left : "0",
		backgroundImage : "/images/alexbutton.png"
	});
	shareText.addEventListener('click', function(e) {
		sendIntentText();
	});
	formatButtonIOS(shareText);
	formatButtonAndroid(shareText);
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
	formatButtonIOS(shareImage);
	formatButtonAndroid(shareImage);
	viewSharingTemp.add(shareImage);
}

function openCamera() {
	//Holds all functionality related to sharing image through camera

	//Save process for camera and updates view to display new picture
	Titanium.Media.showCamera({
		saveToPhotoGallery : true,
		mediaTypes : Titanium.Media.MEDIA_TYPE_PHOTO,
		success : function(event) {

			//create image file and save name for future use
			var fileName = 'cmh' + new Date().getTime() + '.jpg';
			var fileNameInstagram = 'cmh' + new Date().getTime() + '.jpg'; //Or .ig?
			alert("Instagram file name" + fileNameInstagram);
			//save file
			var imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
			imageFile.write(event.media);
			var imageFileInstagram = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileNameInstagram) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileNameInstagram);
			imageFileInstagram.write(event.media);
			//save file path to be shared

			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				imageFilePath = imageFile.nativePath;
				imageFilePathInstagram = imageFileInstagram.nativePath;
				sendIntentImage();
			}
		},
		cancel : function() {
		},
		error : function(Error) {
			alert("Camera not working");
		}
	});
}

function sendIntentImage() {
	//create and send an image intent

	//Get text to be sent from WP
	contentTextComment = "#cmh #awesome";
	contentTextSubject = "Having fun at Children's Museum of Houston!";
	contentTextURL = "http://www.cmhouston.org";

	if (OS_ANDROID) {
		sendIntentImageAndroid(contentTextComment, contentTextSubject, contentTextURL);
	} else if (OS_IOS) {
		sendIntentImageiOS(contentTextComment, contentTextSubject, contentTextURL);
	} else {
		alert("Unsupported platform (image sharing)");
	}
}

function sendIntentImageAndroid(contentTextComment, contentTextSubject, contentTextURL) {
	contentTextComment = contentTextComment + contentTextURL;
	//Android intents don't have a separate URL field

	//Create and send image intent for android.
	var intentImage = Ti.Android.createIntent({
		type : "image/*",
		action : Ti.Android.ACTION_SEND
	});
	intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
	intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, imageFilePath);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share photo via"));
}

function openInstagram(imageFilePathInstagram){
	alert("imageFilePathInstagram in openInstagram: " + imageFilePathInstagram);
	var docviewer = Ti.UI.iOS.createDocumentViewer({url: imageFilePathInstagram});
 	alert("Created docviewer");
    var annotationObj = new Object();
    annotationObj.InstagramCaption = "Caption sample";
 
    docviewer.UTI = "com.instagram.exclusivegram";
   // docviewer.annotation = annotationObj.InstagramCaption;
 
    docviewer.show();
    alert("Showed docviewer");
    
}

function sendIntentImageiOS(contentTextComment, contentTextSubject, contentTextURL) {
	//Use TiSocial.Framework module to send image to other apps
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			image : imageFilePath,
			text : contentTextComment, //Note that contentTextSubject is unused; there is no field for that
			url : contentTextURL
		},[
			{
				title : "Instagram",
				type : "open.instagram",
				image : "/images/instagram-256.png",
				//callback : openInstagram(imageFilePath)
				callback: function(e){
					openInstagram(imageFilePathInstagram);
				}
			}
		]);
	} else {
		alert("Photo sharing is not available on this device");
	}
}



function sendIntentText() {
	//function to send information to other apps

	//Get text to be sent from WP
	contentTextComment = "#cmh #awesome";
	contentTextSubject = "Having fun at Children's Museum of Houston!";
	contentTextURL = "http://www.cmhouston.org";

	//Note: in kiosk mode, restrict available apps to email only
	if (OS_ANDROID) {
		sendIntentTextAndroid(contentTextComment, contentTextSubject, contentTextURL);
	} else if (OS_IOS) {
		sendIntentTextiOS(contentTextComment, contentTextSubject, contentTextURL);
	} else {
		alert("Unsupported platform (text sharing)");
	}
}

function sendIntentTextAndroid(contentTextComment, contentTextSubject, contentTextURL) {
	//Create and send text intent for android. Includes area for main text and url text to be appended and a subject header
	var intentText = Ti.Android.createIntent({
		action : Ti.Android.ACTION_SEND,
		type : 'text/plain'
	});
	contentTextComment = contentTextComment + "\n" + contentTextURL;
	//Android doesn't have a separate URL field
	intentText.putExtra(Ti.Android.EXTRA_SUBJECT, contentTextSubject);
	intentText.putExtra(Ti.Android.EXTRA_TEXT, contentTextComment);
	intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentText, "Send message via"));
}

function sendIntentTextiOS(contentTextComment, contentTextSubject, contentTextURL) {
	//Use TiSocial.Framework module to share text
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			text : contentTextComment,
			url : contentTextURL
		});
	} else {
		alert("Text sharing is not available on this device");
	}
}

//Run initialization
createShareButtons();
