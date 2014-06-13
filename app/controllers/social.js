function formatButtonIOS(buttonName) {
	//Format buttons for IOS
	if (OS_IOS) {
		buttonName.borderWidth = "1";
		buttonName.borderColor = "#000000";
	}
}

function createButtonsShare() {
	//Initialization, which ensures keyboard is hidden and creates share button

	//Hide keyboard on initial load
	if (OS_ANDROID) {
		Ti.UI.Android.hideSoftKeyboard();
	}

	//button to open text sharing
	var openMenuShareText = Ti.UI.createButton({
		id : 'openMenuShareText',
		Title : "Share",
		backgroundImage : "http://i.stack.imgur.com/P1ELC.png",
		height : "40dip",
		width : "40dip",
		font : {
			fontSize : 30,
		},
		//backgroundColor: "#00FFFF"
		color : "#000000"
	});
	openMenuShareText.addEventListener('click', function(e) {
		openViewShareText();
	});
	formatButtonIOS(openMenuShareText);
	$.viewShareBase.add(openMenuShareText);

	//button to open photo sharing
	var openCamera = Ti.UI.createButton({
		id : 'openCamera',
		Title : "Share",
		backgroundImage : "http://i.stack.imgur.com/P1ELC.png",
		height : "40dip",
		width : "40dip",
		font : {
			fontSize : 30,
		},
		//backgroundColor: "#00FFFF"
		color : "#000000"
	});
	openCamera.addEventListener('click', function(e) {
		shareImage();
	});
	formatButtonIOS(openCamera);
	$.viewShareBase.add(openCamera);
}

function shareImage() {
	//Holds all functionality related to sharing image through camera

	//top level vars
	var imageName;
	var imageFile;
	var imageFilePath;

	//Save process for camera and updates view to display new picture
	openCamera.addEventListener('click', function(e) {
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
		}
		else {
			alert("Unsupported platform");
		}

//close sharing menu?

	});
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

	//Back button closes sharing window and returns to app
	var closeViewSharingAllContent = Ti.UI.createButton({
		title : "Back",
		height : "45dip"
	});
	formatButtonIOS(closeViewSharingAllContent);
	rowOne.add(closeViewSharingAllContent);
	closeViewSharingAllContent.addEventListener("click", function(e) {
		$.viewShareBase.remove(viewSharingAllContent);
		if (OS_ANDROID) {
			Ti.UI.Android.hideSoftKeyboard();
		}
	});

	//clear all button that clears text in inputComment and picture in viewImageCaptured
	var clearAll = Ti.UI.createButton({
		id : 'clearAll',
		title : "Clear All",
		font : {
			size : "8"
		}
	});
	formatButtonIOS(clearAll);
	clearAll.addEventListener('click', function(e) {
		clearTextComment.fireEvent("click");
		removeImage.fireEvent("click");
		closeInputKeyboard.fireEvent("click");
	});
	rowFive.add(clearAll);

	function createIntentText(contentTextComment, contentTextSubject) {

		//MAKE SURE TO DISABLE CHOICE OF ALWAYS/JUST ONCE

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

	function createIntentTextAndImage(contentTextComment, contentTextSubject, contentImage) {
		//Generates intent for both text and image when given values for text comments, subject comments (optional), and image content
		if (OS_ANDROID) {
			//Code for sharing both text and image in Android
			//create and send intent
			var intentImageAndText = Ti.Android.createIntent({
				type : "image/*",
				action : Ti.Android.ACTION_SEND
			});
			intentImageAndText.addCategory(Ti.Android.CATEGORY_DEFAULT);
			intentImageAndText.putExtra(Ti.Android.EXTRA_SUBJECT, contentTextSubject);
			intentImageAndText.putExtra(Ti.Android.EXTRA_TEXT, contentTextComment);
			intentImageAndText.putExtraUri(Ti.Android.EXTRA_STREAM, imageFilePath);
			Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImageAndText, "Share with..."));

		} else if (OS_IOS) {
			//Code for sharing both text and image in iOS
			var Social = require('dk.napp.social');
			if (Social.isActivityViewSupported()) {
				Social.activityView({
					text : contentText,
					image : imageFilePath,
					url : 'http://www.cmhouston.org'
				});
			} else {
				alert("Sharing is not available on this device");
			}
		} else {
			alert("Unsupported platform");
		}
	}

	//Share both text and image button
	var shareBoth = Ti.UI.createButton({
		title : "Share"
	});
	formatButtonIOS(shareBoth);
	shareBoth.addEventListener('click', function(e) {
		//Validate what is to be shared based on switch values and what content was input by user
		if (switchShareText.value == true && switchShareImage.value == true) {
			//Share image and text selected - check for image and text
			if (viewImageCaptured.image == "" && inputComment.value == "") {
				alert("No content to share!");
			} else if (viewImageCaptured.image == "") {
				alert("No image to share!");
			} else if (inputComment.value == "") {
				alert("No text to share!");
			} else {
				//Image and text found. Share.

				//Copy backup of text in textCommentBackup (to be used to copy into facebook for comment sharing)
				Ti.UI.Clipboard.setText(inputComment.value);

				//send intent
				createIntentTextAndImage(inputComment.value, inputSubject.value, viewImageCaptured.image);

			}
		} else if (switchShareText.value == true) {
			//Share text selected - check for text
			if (inputComment.value == "") {
				alert("No text to share!");
			} else {
				//Text found - Share.
				//Copy backup of text in textCommentBackup (to be used to copy into facebook for comment sharing)
				Ti.UI.Clipboard.setText(inputComment.value);
				//send intent
				createIntentText(inputComment.value, inputSubject.value);
			}
		} else if (switchShareImage.value == true) {
			//Share image selected - check for image
			if (viewImageCaptured.image == "") {
				alert("No image to share!");
			} else {
				//Image found - Share.
				createIntentImage(viewImageCaptured.image);
			}
		} else {
			//Content may be there but nothing selected to share
			alert("Nothing selected to share!");
		}
	});
	rowOne.add(shareBoth);

	//Choose picture button
	var openGallery = Ti.UI.createButton({
		title : "Choose Photo",
		top : 0,
		font : {
			size : 8,
			color : "#000000"
		}
	});
	formatButtonIOS(openGallery);
	openGallery.addEventListener('click', function(e) {
		//choose photo from gallery
		Titanium.Media.openPhotoGallery({
			success : function(event) {
				viewImageCaptured.image = event.media;
				imageFilePath = event.media.nativePath;
			},
			cancel : function() {
			},
			error : function(error) {
			},
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
		});
	});
	rowSix.add(openGallery);

	//removes image from view but does not delete from gallery
	var removeImage = Ti.UI.createButton({
		title : "Clear Image",
		font : {
			color : "#FFFFFF",
			size : "8"
		},
		visible : false
	});
	formatButtonIOS(removeImage);
	removeImage.addEventListener("click", function(e) {
		viewImageCaptured.image = "";
		removeImage.visible = false;
		rotateLeft.visible = false;
		rotateRight.visible = false;
		viewScroll.scrollTo(0, 0);
	});
	rowFive.add(removeImage);

	function correctOrientation(viewImage, rotateLeft, rotateRight) {
		//corrects displayed picture based on which rotation is sent. booleans accepted for rotateLeft and rotateRight
		var rotateAngle;
		//set rotation direction
		if (rotateLeft == true) {
			rotateAngle = "-90";
		} else if (rotateRight == true) {
			rotateAngle = "90";
		}
		//rotate image
		var matrixRotation = Ti.UI.create2DMatrix();
		matrixRotation = matrixRotation.rotate(rotateAngle);
		var spinMatrix = Ti.UI.createAnimation({
			transform : matrixRotation,
			duration : 1000,
			autoreverse : false,
			repeat : 0
		});
		//rotate if image exists
		//Issue is that the view is being rotated, not the actual image, which means that when an additional picture is taken, it will orient to the orientation of the imageview and is not a permanent and doesn't reset with each additional photo
		viewImage.animate(spinMatrix);
	}

	//rotate left button
	var rotateLeft = Ti.UI.createButton({
		title : "<-",
		visible : false
	});
	formatButtonIOS(rotateLeft);
	rotateLeft.addEventListener('click', function(e) {
		if (viewImageCaptured.image != "") {
			correctOrientation(viewImageCaptured, true, false);
			Ti.API.info("rotated left");
		}
	});
	rowSeven.add(rotateLeft);

	//rotate right button
	var rotateRight = Ti.UI.createButton({
		title : "->",
		visible : false
	});
	formatButtonIOS(rotateRight);
	rotateRight.addEventListener('click', function(e) {
		if (viewImageCaptured.image != "") {
			correctOrientation(viewImageCaptured, false, true);
			Ti.API.info("rotated right");
		}
	});
	rowSeven.add(rotateRight);

	//Image view
	var viewImageCaptured = Ti.UI.createImageView({
		image : "",
		top : "0",
		left : "12.5%",
		height : "300dip",
		width : "275dip",
		anchorPoint : {
			x : 0.5,
			y : 0.5
		}
	});
	viewImageCaptured.addEventListener("load", function(e) {
		if (viewImageCaptured.image != "") {
			removeImage.visible = true;
			rotateLeft.visible = true;
			rotateRight.visible = true;
		} else {
			removeImage.visible = false;
			rotateLeft.visible = false;
			rotateRight.visible = false;
		}
	});
	rowSix.add(viewImageCaptured);

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
