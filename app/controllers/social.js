function init() {
	//top level vars
	var imageName;
	var imageFile;

	//Hide keyboard on initial load
	if (OS_ANDROID) {
		Ti.UI.Android.hideSoftKeyboard();
	}

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
			fontSize : 30,
		},
		//backgroundColor: "#00FFFF"
		color : "#000000"
	});
	$.viewShareBase.add(openMenuShare);
	//Add button to XML

	openMenuShare.addEventListener('click', function(e) {
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
			top : "200dip"
		});
		viewSharingAllContent.add(rowFour);
		var rowFive = Ti.UI.createView({
			layout : "horizontal",
			top : "250dip",
			left : 0
		});
		viewSharingAllContent.add(rowFive);
		var rowSix = Ti.UI.createView({
			layout : "horizontal",
			top : "300dip",
			width : "100%",
		});
		viewSharingAllContent.add(rowSix);
		var rowSeven = Ti.UI.createView({
			layout : "horizontal",
			top : "550dip",
			width : "50%",
			left : "20%"
		});
		viewSharingAllContent.add(rowSeven);

		//Back button closes sharing window and returns to app
		var closeViewSharingAllContent = Ti.UI.createButton({
			title : "Back",
			height : "45dip"
		});
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
		});

		clearAll.addEventListener('click', function(e) {
			clearTextComment.fireEvent("click");
			removeImage.fireEvent("click");
			closeInputKeyboard.fireEvent("click");
		});
		rowOne.add(clearAll);

		function createIntentText(contentText) {
			//function to create a text intent/iOS equivalent
			if (OS_ANDROID) {
				var intentText = Ti.Android.createIntent({
					action : Ti.Android.ACTION_SEND,
					type : 'text/plain'
				});
				intentText.putExtra(Ti.Android.EXTRA_SUBJECT, inputSubject.value);
				intentText.putExtra(Ti.Android.EXTRA_TEXT, inputComment.value);
				intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
				Ti.Android.createIntentChooser(intentText, "Send Message");
				Ti.Android.currentActivity.startActivity(intentText);
			} else if (OS_IOS) {
				/* DocumentViewer attempt: http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.UI.iOS.DocumentViewer
				// Use a NavigationWindow to create a navigation bar for the window
				var docWindow = Ti.UI.createWindow({
					backgroundColor: 'blue',
					title: "Blue window"
				});
				var navWin = Ti.UI.iOS.createNavigationWindow({window: docWindow});
				docWindow.add(navWin);
				
				var winButton = Titanium.UI.createButton({
				    title : 'Launch',
				    height : 40,
				    width : 200,
				    top : 270
				});
				docWindow.add(winButton);
				
				// Create a document viewer to preview a PDF file
				docViewer = Ti.UI.iOS.createDocumentViewer({url : '/Users/parivedadeveloper/Downloads/Apple-logo.jpg'});
				//docViewer.setUrl('');
				// Opens the options menu and when the user clicks on 'Quick Look'
				// the document viewer launches with an animated transition

				// The document viewer immediately launches without an animation
				winButton.addEventListener('click', function(){ docViewer.show(); Ti.API.info("winButton pressed");});
				navWin.open();
				*/ //End DocumentViewer attempt
				
				//Use Ti.Social module
				var Social = require('dk.napp.social');
				Social.activityView({
					url: 'www.facebook.com'
				});
			}
		}

		function createIntentImage(contentImage) {
			//function to create an image intent
			if (OS_ANDROID) {
				if (viewImageCaptured.image != "") {
					var fileImage = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, imageName);
					var filePath = fileImage.read();
					var intentImage = Ti.Android.createIntent({
						type : "image/*",
						action : Ti.Android.ACTION_SEND
					});
					
					//Must determine appropriate category to call only image handling apps
					
					//intentImage.addCategory(Ti.Android.CATEGORY_APP_GALLERY);
					intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
					intentImage.putExtra(Ti.Android.EXTRA_TITLE, "Taken at the Children's Museum of Houston");
					intentImage.putExtra(Ti.Android.EXTRA_TEXT, "Taken at the Children's Museum of Houston");
					intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, imageFile.getNativePath());
					Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share Picture"));
				} else {
					//Choose file
					var intentImage = Ti.Android.createIntent({
						type : "image/*",
						action : Ti.Android.ACTION_GET_CONTENT
					});
					intentImage.addCategory(Ti.Android.CATEGORY_OPENABLE);
					var file = Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share Picture"));
					
					alert("This feature is not ready");
					
					//Must find a way to retrieve content from above intent and send it
					
				/*	//send file
					var intentImageSend = Ti.Android.createIntent({
						type : "image/*",
						action : Ti.Android.ACTION_SEND
					});
					intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, file);
					Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImageSend, "Share Picture"));
					
					//openPhotoGallery();
					*/
					
					
				}
			}
		}

		//Share both text and image button
		var shareBoth = Ti.UI.createButton({
			title : "Share Both!"
		});
		shareBoth.addEventListener('click', function(e) {
			if (viewImageCaptured.image == "" && inputComment.value == "") {
				alert("You're missing any content!");
			} else if (viewImageCaptured.image == "") {
				alert("You're missing an image!");
			} else if (inputComment.value == "") {
				alert("You're missing text!");
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
			//if photo is not taken within app then option to select image from gallery will appear
			createIntentImage(viewImageCaptured.image);
		});
		rowFive.add(sendIntentImage);

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
				mediaTypes : Titanium.Media.MEDIA_TYPE_PHOTO,
				success : function(event) {
					//Tracks orientation of picture
					// var orientationWhilePictureTakenCode = Ti.Gesture.orientation;
					// var orientationWhilePictureTakenName = getOrientation(orientationWhilePictureTakenCode);
					// Titanium.API.info("Picture Orientation: " + orientationWhilePictureTakenName + " (Code = " + orientationWhilePictureTakenCode + ")");

					//create image file and save name for future use
					var fileName = 'cmh' + new Date().getTime() + '.jpg';
					imageName = fileName;
					//save file
					imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
					imageFile.write(event.media);
					//set viewImageCaptured to show new image
					if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
						viewImageCaptured.image = event.media;
						//pathPhoto = Ti.Filesystem.applicationDataDirectory + fileName;
					}
				},
				cancel : function() {
				},
				error : function(Error) {
					alert("Camera functionality not working");
				}
			});
		});
		//add open camera button
		rowFive.add(openCamera);

		//removes image from view but does not delete from gallery
		var removeImage = Ti.UI.createButton({
			title : "Clear Image",
			visible : false
		});
		removeImage.addEventListener("click", function(e) {
			viewImageCaptured.image = "";
			removeImage.visible = false;
			rotateLeft.visible = false;
			rotateRight.visible = false;
			viewScroll.scrollTo(0,0);
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
		rowSix.add(viewImageCaptured);

		//Text area for subject input
		var textSubjectSelected = false;
		var inputSubject = Ti.UI.createTextArea({
			width : "100%",
			height : '45dip',
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
			hintText : '(Subject, if applicable)',
			scrollable : true,
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

		// inputComment.addEventListener('blur', function() {
		// inputComment.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
		// });
		rowThree.add(inputComment);

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
		rowFour.add(sendIntentText);

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
		rowFour.add(closeInputKeyboard);

		//clear text button for inputComment
		var clearTextComment = Ti.UI.createButton({
			title : "Clear Text",
			visible : false
		});
		clearTextComment.addEventListener('click', function(e) {
			inputComment.value = "";
			inputSubject.value = "";
		});
		rowFour.add(clearTextComment);

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
