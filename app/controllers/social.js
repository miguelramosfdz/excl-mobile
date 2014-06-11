function init() {
	//global vars
	var inputSelected = false;

	//Pop up window that contains specific app information
	// function windowPopupShare(viewName) {
	// var viewScrollShare = Ti.UI.createScrollView({
	// contentWidth : 'auto',
	// contentHeight : 'auto',
	// showVerticalScrollIndicator : true,
	// showHorizontalScrollIndicator : true
	// });
	// var windowPopupShare = Ti.UI.createWindow({
	// top : "50dip"
	// });
	// windowPopupShare.open({
	// modal : true
	// });
	// var closeWindowShare = Ti.UI.createButton({
	// top : 0,
	// title : "Close Window"
	// });
	// closeWindowShare.addEventListener('click', function(e) {
	// windowPopupShare.close();
	// });
	// windowPopupShare.add(closeWindowShare);
	// viewScrollShare.add(viewName);
	// windowPopupShare.add(viewScrollShare);
	// }

	////Social window////
	//When clicked, this button will open up the share menu
	var openMenuShare = Ti.UI.createButton({
		id : 'openMenuShare',
		Title : "Share",
		backgroundImage : "http://i.stack.imgur.com/P1ELC.png",
		font : {
			size : 8,
			color : "#000000"
		}
	});
	$.viewShareBase.add(openMenuShare);
	//Add button to XML

	openMenuShare.addEventListener('click', function(e) {
		//create viewSharingAllContent, which will serve as the background view for all sharing content, then post to page
		var viewSharingAllContent = Ti.UI.createView({
			backgroundColor : "#FFFFFF"
		});
		$.viewShareBase.add(viewSharingAllContent);

		//Window rows
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
			top : "150dip"
		});
		viewSharingAllContent.add(rowThree);
		var rowFour = Ti.UI.createView({
			layout : "horizontal",
			top : "200dip",
			left : 0
		});
		viewSharingAllContent.add(rowFour);
		var rowFive = Ti.UI.createView({
			layout : "horizontal",
			top : "250dip",
			width : "100%",
		});
		viewSharingAllContent.add(rowFive);

		//Back button closes sharing window and returns to app
		var closeViewSharingAllContent = Ti.UI.createButton({
			title : "Back",
			height : "45dip"
		});
		rowOne.add(closeViewSharingAllContent);
		closeViewSharingAllContent.addEventListener("click", function(e) {
			$.viewShareBase.remove(viewSharingAllContent);
		});

		//clear all button that clears text in inputComment and picture in viewImageCaptured
		var clearAll = Ti.UI.createButton({
			id : 'clearAll',
			title : "Clear All",
		});

		clearAll.addEventListener('click', function(e) {
			inputComment.value = "";
			viewImageCaptured.image = "";
		});
		rowOne.add(clearAll);

		function createIntentText(contentText) {
			//function to create a text intent/iOS equivalent
			if (OS_ANDROID) {
				var intentText = Ti.Android.createIntent({
					action : Ti.Android.ACTION_SEND,
					type : 'text/plain'
				});
				intentText.putExtra(Ti.Android.EXTRA_SUBJECT, "This is the subject.");
				intentText.putExtra(Ti.Android.EXTRA_TEXT, "This is some text to send.");
				intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
				Ti.Android.createIntentChooser(intentText, "Send Message");
				Ti.Android.currentActivity.startActivity(intentText);
			} else if (OS_IOS) {
				//Assume for now we're doing the same thing with iPhones and iPads
				var docViewer = Ti.UI.iOS.createDocumentViewer({
					url : "http://www.cmhouston.org"
				});
				docViewer.show({
					//view : rightNavBtn,
					animated : true
				});
			}
		}

		function createIntentImage(contentImage) {
			//function to create an image intent
			if (OS_ANDROID) {
				var intentImage = Ti.Android.createIntent({
					type : "image/*",
					action : Ti.Android.ACTION_PICK
				});
				intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
				intentImage.putExtra(Ti.Android.ACTION_ATTACH_DATA, contentImage);
				Ti.Android.createIntentChooser(intentImage, "Share Photo");
			}
		}

		//Share both text and image button
		var shareBoth = Ti.UI.createButton({
			title : "Share Both!"
		});
		shareBoth.addEventListener('click', function(e) {
			if (viewImageCaptured.image == "" && inputComment.value == "") {
				alert("No content to share!");
			} else if (viewImageCaptured.image == "") {
				alert("No photo to share!");
			} else if (inputComment.value == "") {
				alert("No text to share!");
			} else {
				createIntentImage(viewImageCaptured.image);
				createIntentText(inputComment.value);
			}
		});
		rowOne.add(shareBoth);

		//Send image intent
		var sendIntentImage = Ti.UI.createButton({
			id : 'sendIntentImage',
			title : "Share Photo",
			font : {
				size : 8,
				color : "#000000"
			},
			height : "45dip"
		});
		sendIntentImage.addEventListener("click", function(e) {
			if (viewImageCaptured.image != "") {
				createIntentImage(viewImageCaptured.image);
			} else {
				alert("There's no image to share!");
			}
		});
		rowFour.add(sendIntentImage);

		//Open camera button
		var openCamera = Ti.UI.createButton({
			title : "Take Photo",
			top : 0,
			font : {
				size : 8,
				color : "#000000"
			}
		});

		////Camera functionality////

		// function getOrientation(orientation) {
		// //Tracks orientation of picture taken by camera
		// switch (orientation) {
		// case Titanium.UI.PORTRAIT:
		// //1
		// return 'portrait';
		// case Titanium.UI.UPSIDE_PORTRAIT:
		// return 'upside portrait';
		// case Titanium.UI.LANDSCAPE_LEFT:
		// //2
		// return 'landscape left';
		// case Titanium.UI.LANDSCAPE_RIGHT:
		// return 'landscape right';
		// case Titanium.UI.FACE_UP:
		// return 'face up';
		// case Titanium.UI.FACE_DOWN:
		// return 'face down';
		// case Titanium.UI.UNKNOWN:
		// return 'unknown';
		// }
		// }

		// //tracks orientation of device
		// Ti.Gesture.addEventListener('orientationchange', function(e) {
		// Ti.API.info("Current Orientation: " + getOrientation(Ti.Gesture.orientation) + " (Code = " + Ti.Gesture.orientation + ")");
		// var orientation = getOrientation(e.orientation);
		// });

		//Save process for camera and updates view to display new picture
		openCamera.addEventListener('click', function(e) {
			Titanium.Media.showCamera({
				saveToPhotoGallery : true,
				success : function(event) {
					//Tracks orientation of picture
					// var orientationWhilePictureTakenCode = Ti.Gesture.orientation;
					// var orientationWhilePictureTakenName = getOrientation(orientationWhilePictureTakenCode);
					// Titanium.API.info("Picture Orientation: " + orientationWhilePictureTakenName + " (Code = " + orientationWhilePictureTakenCode + ")");

					//saves picture file and updates imageview
					var fileName = new Date().getTime() + '.jpg';
					var imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
					imageFile.write(event.media);
					if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
						viewImageCaptured.image = event.media;
						//pathPhoto = Ti.Filesystem.applicationDataDirectory + fileName;
					}
				},
				cancel : function() {
				},
				error : function(Error) {
				}
			});
		});
		//add open camera button
		rowFour.add(openCamera);

		//removes image from view but does not delete from gallery
		var removeImage = Ti.UI.createButton({
			title : "Clear Pic",
			visible : false
		});
		removeImage.addEventListener("click", function(e) {
			viewImageCaptured.image = "";
			removeImage.visible = false;
			rotateLeft.visible = false;
			rotateRight.visible = false;
		});
		rowFour.add(removeImage);

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
		rotateLeft.addEventListener('click', function(e) {
			if (viewImageCaptured.image != "") {
				correctOrientation(viewImageCaptured, true, false);
				Ti.API.info("rotated left");
			}
		});
		rowFive.add(rotateLeft);

		//rotate right button
		var rotateRight = Ti.UI.createButton({
			title : "->",
			visible : false
		});
		rotateRight.addEventListener('click', function(e) {
			if (viewImageCaptured.image != "") {
				correctOrientation(viewImageCaptured, false, true);
				Ti.API.info("rotated right");
			}
		});
		rowFive.add(rotateRight);

		// //Switch to determine if photo will be shared
		// var sharePhoto = Ti.UI.createSwitch({
		// titleOn : "Photo will post",
		// titleOff : "Photo won't post",
		// value : false
		// });
		// rowFour.add(sharePhoto);

		//Image view
		var viewImageCaptured = Ti.UI.createImageView({
			image : "",
			top : "0",
			left : "12.5%",
			height : "250dip",
			width : "250dip",
			anchorPoint : {
				x : 0.5,
				y : 0.5
			}
		});
		viewImageCaptured.addEventListener("load", function(e) {
			if (viewImageCaptured.image != "") {
				// sharePhoto.value = false;
				// sharePhoto.enabled = false;
				// } else {
				// sharePhoto.value = true;
				// sharePhoto.enabled = true;
				removeImage.visible = true;
				rotateLeft.visible = true;
				rotateRight.visible = true;
			} else {
				removeImage.visible = false;
				rotateLeft.visible = false;
				rotateRight.visible = false;
			}
		});
		rowFour.add(viewImageCaptured);

		//Text area for input
		var textSelected = false;
		var inputComment = Ti.UI.createTextArea({
			width : "100%",
			height : '95dip',
			borderRadius : "15",
			backgroundColor : "#E0E0E0",
			borderColor : "#000000",
			font : {
				fontSize : 12,
				color : "#000000"
			},
			keyboardType : Ti.UI.KEYBOARD_ASCII,
			returnKeyType : Ti.UI.RETURNKEY_DONE,
			textAlign : 'left',
			hintText : '(Type here)',
			scrollable : true,
		});

		//Set keyboard to hide for Android
		if (OS_ANDROID) {
			inputComment.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
		}

		//control focus/blur of inputComment
		inputComment.addEventListener('click', function() {
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

		// inputComment.addEventListener('blur', function() {
		// inputComment.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
		// });
		rowTwo.add(inputComment);

		//Send text intent
		var sendIntentText = Ti.UI.createButton({
			title : "Share Text",
			font : {
				size : 8,
				color : "#000000"
			},
			height : "45dip"
		});
		sendIntentText.addEventListener("click", function(e) {
			if (inputComment.value != "") {
				createIntentText(inputComment.value);
			} else {
				alert("There's no text to share!");
			}
		});
		rowThree.add(sendIntentText);

		//close keyboard button for inputComment
		var closeInputKeyboard = Ti.UI.createButton({
			title : "Done Typing",
			visible : false
		});
		closeInputKeyboard.addEventListener('click', function(e) {
			if (OS_ANDROID) {
				Ti.UI.Android.hideSoftKeyboard();
			}
			inputComment.blur();
			//hide text specific buttons
			closeInputKeyboard.visible = false;
			clearTextComment.visible = false;
		});
		rowThree.add(closeInputKeyboard);

		//clear text button for inputComment
		var clearTextComment = Ti.UI.createButton({
			title : "Clear Text",
			visible : false
		});
		clearTextComment.addEventListener('click', function(e) {
			inputComment.value = "";
		});
		rowThree.add(clearTextComment);

		////Twitter////
		/*Old way: use button for WebView
		var shareTwitter = Ti.UI.createButton({
		title : "Follow",
		backgroundImage : "http://icons.iconarchive.com/icons/uiconstock/round-papercut-social/256/twitter-icon.png",
		font : {
		size : 8,
		color : "#000000"
		},
		height : "45dip"
		});
		shareTwitter.addEventListener('click', function(e) {
		var twitterView = Ti.UI.createWebView({
		top : "45 dip",
		url : "https://twitter.com/cmhouston",
		height : "750dip"
		});
		rowOne.add(shareTwitter);

		*/

		/*
		////Share Twitter in Twitter app////
		var shareTwitter2 = Ti.UI.createButton({//Make another button
		title : "Follow",
		backgroundImage : "http://icons.iconarchive.com/icons/uiconstock/round-papercut-social/256/twitter-icon.png",
		font : {
		size : 8,
		color : "#000000"
		},
		height : "45dip"
		});

		shareTwitter2.addEventListener('click', function(e) {//When clicked, launch via intent
		try {
		Ti.API.info('Trying to Launch via Intent');

		var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_VIEW,
		data : 'twitter://user?screen_name=cmhouston' //Should open twitter app to cmhouston profile
		});
		Ti.Android.currentActivity.startActivity(intent);
		}//end try
		catch (e) {
		//If this intent fails, it means that the device does not have Twitter installed- open in WebView instead
		var twitterView = Ti.UI.createWebView({
		top : "50 dip",
		url : "https://twitter.com/cmhouston",
		height : "750dip"
		});
		//end createWebView
		windowPopupShare(twitterView);
		}//end catch
		});
		//end addEventListener

		rowOne.add(shareTwitter2);
		*/

		////Post on Twitter////
		/*Old way: using WebView
		var postTwitter = Ti.UI.createButton({
		title : "Tweet",
		backgroundImage : "http://icons.iconarchive.com/icons/uiconstock/round-papercut-social/256/twitter-icon.png",
		font : {
		size : 8,
		color : "#ffffff"
		},
		height : "45dip"
		});
		postTwitter.addEventListener('click', function(e) {
		var twitterView = Ti.UI.createWebView({
		top : "50 dip",
		url : "https://twitter.com/home?status=%23cmhouston%20%23awesome",
		height : "750dip"
		});
		windowPopupShare(twitterView);
		});
		rowOne.add(postTwitter);
		*/

		/*
		//New way: open in Twitter app
		var postTwitter = Ti.UI.createButton({
		title : "Tweet",
		backgroundImage : "http://icons.iconarchive.com/icons/uiconstock/round-papercut-social/256/twitter-icon.png",
		font : {
		size : 8,
		color : "#ffffff"
		},
		height : "45dip"
		});
		postTwitter.addEventListener('click', function(e) {//When clicked, launch via intent
		try {
		Ti.API.info('Trying to Launch via Intent');

		var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_SEND,
		type : "text/plain",
		//text: '#cmh #awesome http://www.cmhouston.org'
		//data: 'twitter://post?message=hello%20world' 	//Should open twitter app and post a message
		});
		intent.putExtra(Ti.Android.EXTRA_TEXT, 'Some text that we want to share');
		Ti.Android.currentActivity.startActivity(intent);
		}//end try
		catch (e) {
		//If this intent fails, it means that the device does not have Twitter installed- open in WebView instead
		var twitterView = Ti.UI.createWebView({
		top : "50 dip",
		url : "https://twitter.com/home?status=%23cmhouston%20%23awesome",
		height : "750dip"
		});
		//end createWebView
		windowPopupShare(twitterView);
		}//end catch
		});
		//end addEventListener
		rowOne.add(postTwitter);
		*/

		/*
		////Share Facebook////
		var shareFacebook = Ti.UI.createButton({
		title : "Share",
		backgroundImage : "http://icons.iconarchive.com/icons/uiconstock/round-papercut-social/256/facebook-icon.png",
		font : {
		size : 8,
		color : "#000000"
		},
		height : "45dip"
		});
		shareFacebook.addEventListener('click', function(e) {
		if (sharePhoto.value = false) {
		var facebookView = Ti.UI.createWebView({
		top : "50 dip",
		url : "http://www.facebook.com/share.php?u=http://www.cmhouston.org",
		height : "750dip"
		});
		windowPopupShare(facebookView);
		} else if (sharePhoto.value = true) {

		//Share photo

		}
		});
		rowOne.add(shareFacebook);
		*/

		/*
		////Send e-mail////
		var sendEmail = Ti.UI.createButton({
		title : "Send",
		backgroundImage : "http://icons.iconarchive.com/icons/uiconstock/round-papercut-social/256/email-icon.png",
		font : {
		size : 8,
		color : "#000000"
		},
		height : "45dip"
		});
		sendEmail.addEventListener('click', function(e) {
		var emailDialog = Ti.UI.createEmailDialog();

		if (!emailDialog.isSupported()) {
		Ti.UI.createAlertDialog({
		title : 'Error',
		message : 'Email not available on this device.'
		}).show();
		return;
		}

		emailDialog.subject = "Hello from Titanium";
		emailDialog.messageBody = 'Check out this cool stuff from the Children\'s Museum of Houston: \n http://www.cmhouston.org/howdoesitwork/';
		emailDialog.open();
		});
		rowOne.add(sendEmail);
		*/

		/*
		////Share on Instagram////
		var shareInstagram = Ti.UI.createButton({
		title : "Share",
		backgroundImage : "http://icons.iconarchive.com/icons/uiconstock/round-papercut-social/256/instagram-icon.png",
		font : {
		size : 8,
		color : "#000000"
		},
		height : "45dip"
		});
		if (sharePhoto.value==true){
		rowOne.add(shareInstagram);
		}
		*/

	});
	//End openMenuShare listener
}

init();
