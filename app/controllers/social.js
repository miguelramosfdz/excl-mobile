function init() {
	//global vars
	var defaultNoImage = "http://www.freestockphotos.biz/pictures/4/4398/border.png";
	var pathImage;
	var inputSelected = false;

	function shareWindow(viewName) {
		var shareScrollView = Ti.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true
		});
		var shareWindow = Ti.UI.createWindow({
			top : "50dip"
		});
		shareWindow.open({
			modal : true
		});
		var btnCancelShare = Ti.UI.createButton({
			top : 0,
			title : "Close Window"
		});
		btnCancelShare.addEventListener('click', function(e) {
			shareWindow.close();
		});
		shareWindow.add(btnCancelShare);
		shareScrollView.add(viewName);
		shareWindow.add(shareScrollView);
	}

	////Social window////
	var btnShare = Ti.UI.createButton({
		Title : "Share",
		backgroundImage : "http://i.stack.imgur.com/P1ELC.png",
		font : {
			size : 8,
			color : "#000000"
		}
	});
	socialView.add(btnShare);

	btnShare.addEventListener('click', function(e) {
		var socialWin = Ti.UI.createWindow({});
		socialWin.open({
			modal : true
		});

		//Window rows
		var rowOne = Ti.UI.createView({
			layout : "horizontal",
			top : "0dip",
			width : "100%",
		});
		socialWin.add(rowOne);
		var rowTwo = Ti.UI.createView({
			layout : "horizontal",
			top : "50dip",
			width : "75%",
			left : "12.5%"
		});
		socialWin.add(rowTwo);
		var rowThree = Ti.UI.createView({
			layout : "horizontal",
			top : "150dip"
		});
		socialWin.add(rowThree);
		var rowFour = Ti.UI.createView({
			layout : "horizontal",
			top : "405dip",
			left : 0
		});
		socialWin.add(rowFour);

		//Cancel button
		var btnCancel = Ti.UI.createButton({
			title : "Cancel",
			height : "45dip"
		});
		rowOne.add(btnCancel);
		btnCancel.addEventListener("click", function(e) {
			socialWin.close();
		});

		//Take picture button
		var takePicture = Ti.UI.createButton({
			title : "Take Photo",
			top : 0,
			font : {
				size : 8,
				color : "#000000"
			}
		});

		////Camera functionality////

		////Begin orientation tracking
		function getOrientation(orientation) {
			switch (orientation) {
				case Titanium.UI.PORTRAIT:
					//1
					return 'portrait';
				case Titanium.UI.UPSIDE_PORTRAIT:
					return 'upside portrait';
				case Titanium.UI.LANDSCAPE_LEFT:
					//2
					return 'landscape left';
				case Titanium.UI.LANDSCAPE_RIGHT:
					return 'landscape right';
				case Titanium.UI.FACE_UP:
					return 'face up';
				case Titanium.UI.FACE_DOWN:
					return 'face down';
				case Titanium.UI.UNKNOWN:
					return 'unknown';
			}
		}

		function correctOrientation(imageViewName, orientationCode) {
			//To correct orientation of an image
			if ( orientationCode = "1") {
				//portrait
				var matrix2d = Ti.UI.create2DMatrix();
				matrix2d = matrix2d.rotate(90);
				var spin = Ti.UI.createAnimation({
					transform : matrix2d,
					duration : 1000,
					autoreverse : false,
					repeat : 0
				});
				imageViewName.animate(spin);
			} else if ( orientationCode = '2') {
				//left landscape
				var matrix2d = Ti.UI.create2DMatrix();
				matrix2d = matrix2d.rotate(-90);
				var spin = Ti.UI.createAnimation({
					transform : matrix2d,
					duration : 1000,
					autoreverse : false,
					repeat : 0
				});
				imageViewName.animate(spin);
			}
		}


		Ti.Gesture.addEventListener('orientationchange', function(e) {
			Ti.API.info("Current Orientation: " + getOrientation(Ti.Gesture.orientation) + " (Code = " + Ti.Gesture.orientation + ")");
			var orientation = getOrientation(e.orientation);
		});
		////End orientation tracking

		takePicture.addEventListener('click', function(e) {
			Titanium.Media.showCamera({
				saveToPhotoGallery : true,
				success : function(event) {
					//Tracks orientation of picture
					var orientationWhilePictureTakenCode = Ti.Gesture.orientation;
					var orientationWhilePictureTakenName = getOrientation(orientationWhilePictureTakenCode);
					Titanium.API.info("Picture Orientation: " + orientationWhilePictureTakenName + " (Code = " + orientationWhilePictureTakenCode + ")");

					//saves picture file and updates imageview
					var fileName = new Date().getTime() + '.jpg';
					var imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
					imageFile.write(event.media);
					if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
						capturedImage.image = event.media;
						//pathPhoto = Ti.Filesystem.applicationDataDirectory + fileName;

						//rotate image view based on value in var orientationWhilePictureTakenCode
						correctOrientation(capturedImage, orientationWhilePictureTakenCode);
					}
				},
				cancel : function() {
				},
				error : function(Error) {
				}
			});
		});
		rowFour.add(takePicture);

		//Remove image button
		var removeImage = Ti.UI.createButton({
			title : "Remove Photo"
		});
		removeImage.addEventListener("click", function(e) {
			capturedImage.image = defaultNoImage;
		});
		rowFour.add(removeImage);

		//Photo switch
		var chkShare = Ti.UI.createSwitch({
			titleOn : "Photo will post",
			titleOff : "Photo won't post",
			value : false
		});
		rowFour.add(chkShare);

		//Image view
		var capturedImage = Ti.UI.createImageView({
			image : defaultNoImage,
			top : "0",
			left : "12.5%",
			height : "250dip",
			width : "250dip",
			anchorPoint : {
				x : 0.5,
				y : 0.5
			}
		});
		capturedImage.addEventListener("load", function(e) {
			if (capturedImage.image == defaultNoImage) {
				chkShare.value = false;
				chkShare.enabled = false;
			} else {
				chkShare.value = true;
				chkShare.enabled = true;
			}
		});
		rowThree.add(capturedImage);

		//Text box
		var textSelected = false;
		var inputText = Ti.UI.createTextArea({
			width : "100%",
			height : '100dip',
			borderWidth : 2,
			borderColor : '#bbb',
			borderRadius : 5,
			font : {
				fontSize : 20,
				fontWeight : 'bold'
			},
			keyboardType : Ti.UI.KEYBOARD_ASCII,
			returnKeyType : Ti.UI.RETURNKEY_NEXT,
			textAlign : 'left',
			hintText : 'Type here... IF YOU DARE!!!',
			scrollable : true

		});
		inputText.addEventListener("type", function(e) {
			doneInput.visible = true;
		});
		rowTwo.add(inputText);

		//Done button for textArea
		var doneInput = Ti.UI.createButton({
			title : "Done",
			visible : false
		});
		doneInput.addEventListener('click', function(e) {
			Ti.UI.Android.hideSoftKeyboard();
			doneInput.visible = false;
		});
		rowOne.add(doneInput);

		//Send text intent
		var sendTextIntent = Ti.UI.createButton({
			title : "Share Text",
			font : {
				size : 8,
				color : "#000000"
			},
			height : "45dip"
		});
		sendTextIntent.addEventListener("click", function(e) {
			var intentText = Ti.Android.createIntent({
				action : Ti.Android.ACTION_SEND,
				type : 'text/plain'
			});
			intentText.putExtra(Ti.Android.EXTRA_SUBJECT, "This is the subject.");
			intentText.putExtra(Ti.Android.EXTRA_TEXT, "This is some text to send.");
			Ti.Android.createIntentChooser(intentText, "Send Message");
		});
		rowOne.add(sendTextIntent);

		//Send image intent
		var sendImageIntent = Ti.UI.createButton({
			title : "Share Photo",
			font : {
				size : 8,
				color : "#000000"
			},
			height : "45dip"
		});
		sendImageIntent.addEventListener("click", function(e) {
			var intentImage = Ti.Android.createIntent({
				type : "image/*",
				action : Ti.Android.ACTION_PICK
			});
			intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
			Ti.Android.createIntentChooser(intentImage, "Share Photo");

			var activityImageIntent = Ti.Android.currentActivity;
			var pendingImageIntent = Ti.Android.createPendingIntent({
				activity : activityImageIntent,
				intent : sendImageIntent
			});

			//update image view to display selected photo
			var activity = socialWin.getActivity();
			activity.startActivityForResult(pendingImageIntent, function(e) {
				if (e.resultCode == Ti.Android.RESULT_OK) {
					var Content = require("yy.ticontent");
					var nativePath = e.pendingImageIntent.data;
					if (nativePath.indexOf("content://") === 0) {
						nativePath = "file://" + Content.resolveAudioPath(e.pendingImageIntent.data);
					} else {
						nativePath = decodeURIComponent(nativePath);
					}
				}
			});

		});
		rowOne.add(sendImageIntent);

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
		shareWindow(twitterView);
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
		shareWindow(twitterView);
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
		shareWindow(twitterView);
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
		if (chkShare.value = false) {
		var facebookView = Ti.UI.createWebView({
		top : "50 dip",
		url : "http://www.facebook.com/share.php?u=http://www.cmhouston.org",
		height : "750dip"
		});
		shareWindow(facebookView);
		} else if (chkShare.value = true) {

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
		if (chkShare.value==true){
		rowOne.add(shareInstagram);
		}
		*/

	});
	//End btnShare listener
}

$.social.open();
init();
