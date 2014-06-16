//separate android/iOS sections into separate functions

//top level vars
var imageName;
var imageFile;
var imageFilePath;

function formatButtonIOS(buttonName) {
	//Format buttons for IOS
	if (OS_IOS) {
		buttonName.borderWidth = "1";
		buttonName.borderColor = "#000000";
		buttonName.borderRadius = "1";
		//buttonName.backgroundColor = "F8F8F8";
	}
}

function createButtonsShare() {
	//Initialization, which ensures keyboard is hidden and creates share button

	//create view that will serve as temporary backing for sharing buttons
	var viewSharingTemp = Ti.UI.createView({
		layout : "vertical",
		width : "100%",
		height : "200dip"
	});
	$.viewShareBase.add(viewSharingTemp);

	//hidden label to aid image intent process
	var labelTemp = Ti.UI.createLabel({
		text : "0"
	});
	viewSharingTemp.add(labelTemp);
	
	//button to open text sharing
	var shareText = Ti.UI.createButton({
		id : 'shareText',
		title : "Text",
		backgroundImage : "../../Resources/shareImage.png",
		backgroundFocusedImage: "../../Resources/shareImage.png",
		backgroundSelectedImage: "../../Resources/shareImage.png",
		height : "40dip",
		width : "40dip",
		left : "0"
	});
	shareText.addEventListener('click', function(e) {
		sendIntentText();
	});
	formatButtonIOS(shareText);
	viewSharingTemp.add(shareText);

	//button to open photo sharing
	var shareImage = Ti.UI.createButton({
		id : 'shareImage',
		backgroundImage : "http://icons.iconarchive.com/icons/visualpharm/icons8-metro-style/512/Photo-Video-Slr-camera-icon.png",
		height : "40dip",
		width : "40dip",
		left : "0"
	});
	shareImage.addEventListener('click', function(e) {
		//create invisible imageview to hold picture so that the intent is not triggered until after the picture is taken

		//open camera and save image to view
		imageFilePath = "";
		openCamera();
		while (imageFilePath.text == "") {
			//do nothing
			Ti.API.info("itz going");
		};
		sendIntentImage();
	});
	formatButtonIOS(shareImage);
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
			imageName = fileName;
			//save file
			imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
			imageFile.write(event.media);
			//save file path to be shared
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				imageFilePath = event.media.nativePath;
			}
			labelTemp.text = "1";
			alert("path: " + imageFilePath);
		},
		cancel : function() {
		},
		error : function(Error) {
			alert("Camera functionality not working");
		}
	});
}

function sendIntentImage() {
	//create and send an image intent
	if (OS_ANDROID) {
		sendIntentImageAndroid();
	} else if (OS_IOS) {
		sendIntentImageiOS();
	} else {
		alert("Unsupported platform");
	}
}

function sendIntentImageAndroid(){
	var intentImage = Ti.Android.createIntent({
		type : "image/*",
		action : Ti.Android.ACTION_SEND
	});
	intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
	intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, imageFilePath);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share with..."));
}

function sendIntentImageiOS(){
	//Use TiSocial.Framework module
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			image : imageFilePath,
			url : 'http://www.cmhouston.org'
		});
	} else {
		alert("Sharing is not available on this device");
	}
}


function sendIntentText() {
	//function to create a text intent/iOS equivalent
	
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
		alert("Unsupported platform");
	}
}

function sendIntentTextAndroid(contentTextComment, contentTextSubject, contentTextURL){
	var intentText = Ti.Android.createIntent({
		action : Ti.Android.ACTION_SEND,
		type : 'text/plain'
	});
	contentTextComment = contentTextComment + " " + contentTextURL; //Android doesn't have a separate URL field
	intentText.putExtra(Ti.Android.EXTRA_SUBJECT, contentTextSubject);
	intentText.putExtra(Ti.Android.EXTRA_TEXT, contentTextComment);
	intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
	Ti.Android.createIntentChooser(intentText, "Send Message");
	Ti.Android.currentActivity.startActivity(intentText);
}

function sendIntentTextiOS(contentTextComment, contentTextSubject, contentTextURL){
	//Use TiSocial.Framework module
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			text : contentTextComment,
			url : contentTextURL
		});
		alert("Sharing is not available on this device");
	}
}

//Run initialization
createButtonsShare();
