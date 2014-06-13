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
		layout : "horizontal",
		width : "100%",
		height : "200dip"
	});
	$.viewShareBase.add(viewSharingTemp);

	//button to open text sharing
	var openMenuShareText = Ti.UI.createButton({
		id : 'openMenuShareText',
		//title : "Share",
		backgroundImage : "http://i.stack.imgur.com/P1ELC.png",
		height : "40dip",
		width : "40dip",
		// font : {
			// fontSize : 30
		// },
		left : "10%"
	});
	openMenuShareText.addEventListener('click', function(e) {
		openViewShareText();
	});
	formatButtonIOS(openMenuShareText);
	viewSharingTemp.add(openMenuShareText);

	//button to open photo sharing
	var shareImage = Ti.UI.createButton({
		id : 'shareImage',
		//title : "Camera",
		backgroundImage : "http://icons.iconarchive.com/icons/visualpharm/icons8-metro-style/512/Photo-Video-Slr-camera-icon.png",
		height : "40dip",
		width : "40dip",
		// font : {
			// fontSize : 30
		// },
		left : "30%"
	});
	shareImage.addEventListener('click', function(e) {
		//create invisible imageview to hold picture so that the intent is not triggered until after the picture is taken
		var viewImageCaptured = Ti.UI.createView({
			visible: false
		});
		viewImageCaptured.addEventListener('load', function(e){
			if (viewImageCaptured.image != ""){
				sendIntentImage();
			}
		});
		viewSharingTemp.add(viewImageCaptured);
		//open camera and save image to view
		openCamera();
		viewSharingTemp.image = imageFilePath;
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
		var intentImage = Ti.Android.createIntent({
			type : "image/*",
			action : Ti.Android.ACTION_SEND
		});
		intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
		intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, imageFilePath);
		Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share with..."));
	} else if (OS_IOS) {
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
	} else {
		alert("Unsupported platform");
	}

	//close sharing menu?
}

function openViewShareText() {
	//Holds all functionality related to sharing text

	//create scrolling view
	var viewScroll = Ti.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : true
	});
	//create viewSharingAllContent, which will serve as the background view for all sharing content, then post to page
	var viewSharingAllContent = Ti.UI.createView({
		backgroundColor : "#FFFFFF"
	});
	viewSharingAllContent.addEventListener('load', function(e) {
		//Set keyboard to hide for Android
		if (OS_ANDROID) {
			inputComment.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
			inputSubject.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
		}
	});
	viewScroll.add(viewSharingAllContent);
	$.viewShareBase.add(viewScroll);

	//Rows in the viewSharingAllContent
	var rowOne = Ti.UI.createView({
		layout : "horizontal",
		top : "0dip",
		width : "100%",
	});
	viewSharingAllContent.add(rowOne);
	var rowTwo = Ti.UI.createView({
		layout : "horizontal",
		top : "50dip",
		width : "100%",
	});
	viewSharingAllContent.add(rowTwo);
	var rowThree = Ti.UI.createView({
		layout : "horizontal",
		top : "100dip",
		width : "100%",
	});
	viewSharingAllContent.add(rowThree);
	var rowFour = Ti.UI.createView({
		layout : "horizontal",
		top : "250dip"
	});
	viewSharingAllContent.add(rowFour);
	var rowFive = Ti.UI.createView({
		layout : "horizontal",
		top : "325dip",
		left : 0
	});
	viewSharingAllContent.add(rowFive);
	var rowSix = Ti.UI.createView({
		layout : "horizontal",
		top : "375dip",
		width : "100%",
	});
	viewSharingAllContent.add(rowSix);
	var rowSeven = Ti.UI.createView({
		layout : "horizontal",
		top : "700dip",
		width : "50%",
		left : "20%"
	});
	viewSharingAllContent.add(rowSeven);

	//Back button closes sharing view and returns to app
	var closeViewSharingAllContent = Ti.UI.createButton({
		title : "Back",
		height : "45dip"
	});
	formatButtonIOS(closeViewSharingAllContent);
	closeViewSharingAllContent.addEventListener("click", function(e) {
		$.viewShareBase.remove(viewSharingAllContent);
		if (OS_ANDROID) {
			Ti.UI.Android.hideSoftKeyboard();
		}
	});
	rowOne.add(closeViewSharingAllContent);

	function createIntentText(contentTextComment, contentTextSubject) {
		//function to create a text intent/iOS equivalent
		if (OS_ANDROID) {
			var intentText = Ti.Android.createIntent({
				action : Ti.Android.ACTION_SEND,
				type : 'text/plain'
			});
			intentText.putExtra(Ti.Android.EXTRA_SUBJECT, contentTextSubject);
			intentText.putExtra(Ti.Android.EXTRA_TEXT, contentTextComment);
			intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
			Ti.Android.createIntentChooser(intentText, "Send Message");
			Ti.Android.currentActivity.startActivity(intentText);

		} else if (OS_IOS) {
			//Use TiSocial.Framework module
			var Social = require('dk.napp.social');
			if (Social.isActivityViewSupported()) {
				Social.activityView({
					text : contentText,
					url : 'http://www.cmhouston.org'
				});
			} else {
				alert("Sharing is not available on this device");
			}
		}//end text sharing for iOS
		else {
			alert("Unsupported platform");
		}
	}

	//Text area for subject input
	var textSubjectSelected = false;
	var inputSubject = Ti.UI.createTextArea({
		width : "100%",
		height : '45dip',
		borderRadius : "15",
		backgroundColor : "#FFFFFF",
		borderColor : "#000000",
		font : {
			fontSize : 12,
			color : "#000000"
		},
		keyboardType : Ti.UI.KEYBOARD_ASCII,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		textAlign : 'left',
		hintText : '(Subject, if applicable)',
		scrollable : true,
		borderColor : "#000000",
		borderWidth : "1"
	});

	//control focus/blur of inputSubject
	inputSubject.addEventListener('click', function(e) {
		if (OS_ANDROID) {
			inputSubject.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
		inputSubject.keyboardType = Ti.UI.KEYBOARD_ASCII;
		inputSubject.returnKeyType = Ti.UI.RETURNKEY_DONE;
		inputSubject.font.color = "#000000";
		inputSubject.focus();
		//show text editting buttons
		closeInputKeyboard.visible = true;
		clearTextComment.visible = true;
	});
	rowTwo.add(inputSubject);

	//Text area for comment input
	var textCommentSelected = false;
	var inputComment = Ti.UI.createTextArea({
		width : "100%",
		height : '95dip',
		borderRadius : "15",
		borderColor : "#000000",
		borderWidth : "1",
		backgroundColor : "#FFFFFF",
		borderColor : "#000000",
		font : {
			fontSize : 12,
			color : "#000000"
		},
		keyboardType : Ti.UI.KEYBOARD_ASCII,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		textAlign : 'left',
		hintText : '(Type here)\n\n\n(Double-tap box if "Hide Keyboard" button does not appear)',
		scrollable : true,
	});

	//control focus/blur of inputComment
	inputComment.addEventListener('click', function(e) {
		if (OS_ANDROID) {
			inputComment.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
		inputComment.keyboardType = Ti.UI.KEYBOARD_ASCII;
		inputComment.returnKeyType = Ti.UI.RETURNKEY_DONE;
		inputComment.font.color = "#000000";
		inputComment.focus();
		//show text editting buttons
		closeInputKeyboard.visible = true;
		clearTextComment.visible = true;
	});

	rowThree.add(inputComment);

	//Warning label for Facebook
	var labelWarningFacebookText = Ti.UI.createLabel({
		text : "Facebook & Instagram do not allow pre-population of text fields. Your comment will be copied to clipboard for you.",
		font : {
			size : 4,
			color : "#000000"
		}
	});
	if (OS_ANDROID) {
		rowFour.add(labelWarningFacebookText);
	}

	//clear text button for inputComment
	var clearTextComment = Ti.UI.createButton({
		title : "Clear Text",
		font : {
			size : 8,
			color : "#000000"
		},
		visible : false
	});
	formatButtonIOS(clearTextComment);
	clearTextComment.addEventListener('click', function(e) {
		inputComment.value = "";
		inputSubject.value = "";
	});
	rowThree.add(clearTextComment);
}

//Run initialization
createButtonsShare();
