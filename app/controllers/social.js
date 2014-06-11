function init() {
	//global vars
	var imageDefault = "http://www.freestockphotos.biz/pictures/4/4398/border.png";
	var imageCapturedPath;
	var inputSelected = false;

	//push view to xml
	var viewSocial = Ti.UI.createView({});
	$.viewSocialAll.add(viewSocial);

	//define popup sharing window
	function windowPopupShare(viewName) {
		var viewScrollShare = Ti.UI.createScrollView({
			contentWidth : 'auto',
			contentHeight : 'auto',
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true
		});
		var windowPopupShare = Ti.UI.createWindow({
			top : "50dip"
		});
		windowPopupShare.open({
			modal : true
		});
		var cancelShare = Ti.UI.createButton({
			top : 0,
			title : "Close Window"
		});
		cancelShare.addEventListener('click', function(e) {
			windowPopupShare.close();
		});
		windowPopupShare.add(cancelShare);
		viewScrollShare.add(viewName);
		windowPopupShare.add(viewScrollShare);
	}

	////Social window////
	var openMenuShare = Ti.UI.createButton({
		Title : "Share",
		backgroundImage : "http://i.stack.imgur.com/P1ELC.png",
		font : {
			size : 8,
			color : "#000000"
		}
	});
	viewSocial.add(openMenuShare);

	openMenuShare.addEventListener('click', function(e) {
		var viewSocialAll = Ti.UI.createWindow({});
		viewSocialAll.open({
			modal : true
		});

		//Window rows
		var rowOne = Ti.UI.createView({
			layout : "horizontal",
			top : "0dip",
			width : "100%",
		});
		viewSocialAll.add(rowOne);
		var rowTwo = Ti.UI.createView({
			layout : "horizontal",
			top : "50dip",
			width : "75%",
			left : "12.5%"
		});
		viewSocialAll.add(rowTwo);
		var rowThree = Ti.UI.createView({
			layout : "horizontal",
			top : "150dip"
		});
		viewSocialAll.add(rowThree);
		var rowFour = Ti.UI.createView({
			layout : "horizontal",
			top : "405dip",
			left : 0
		});
		viewSocialAll.add(rowFour);

		//Cancel button
		var btnCancel = Ti.UI.createButton({
			title : "Cancel",
			height : "45dip"
		});
		rowOne.add(btnCancel);
		btnCancel.addEventListener("click", function(e) {
			viewSocialAll.close();
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
						viewImageCaptured.image = event.media;
						//pathPhoto = Ti.Filesystem.applicationDataDirectory + fileName;

						//rotate image view based on value in var orientationWhilePictureTakenCode
						correctOrientation(viewImageCaptured, orientationWhilePictureTakenCode);
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
			viewImageCaptured.image = imageDefault;
		});
		rowFour.add(removeImage);

		//Photo switch
		var sharePhoto = Ti.UI.createSwitch({
			titleOn : "Photo will post",
			titleOff : "Photo won't post",
			value : false
		});
		rowFour.add(sharePhoto);

		//Image view
		var viewImageCaptured = Ti.UI.createImageView({
			image : imageDefault,
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
			if (viewImageCaptured.image == imageDefault) {
				sharePhoto.value = false;
				sharePhoto.enabled = false;
			} else {
				sharePhoto.value = true;
				sharePhoto.enabled = true;
			}
		});
		rowThree.add(viewImageCaptured);

		//Text area for input
		var textSelected = false;
		var inputComment = Ti.UI.createTextArea({
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
		inputComment.addEventListener("type", function(e) {
			closeInputKeyboard.visible = true;
		});
		rowTwo.add(inputComment);

		//close keyboard button for textArea
		var closeInputKeyboard = Ti.UI.createButton({
			title : "Done",
			visible : false
		});
		closeInputKeyboard.addEventListener('click', function(e) {
			Ti.UI.Android.hideSoftKeyboard();
			closeInputKeyboard.visible = false;
		});
		rowOne.add(closeInputKeyboard);

		//Send text intent
		var intentText = Ti.UI.createButton({
			title : "Share Text",
			font : {
				size : 8,
				color : "#000000"
			},
			height : "45dip"
		});
		intentText.addEventListener("click", function(e) {
			var intentText = Ti.Android.createIntent({
				action : Ti.Android.ACTION_SEND,
				type : 'text/plain'
			});
			intentText.putExtra(Ti.Android.EXTRA_SUBJECT, "This is the subject.");
			intentText.putExtra(Ti.Android.EXTRA_TEXT, "This is some text to send.");
			Ti.Android.createIntentChooser(intentText, "Send Message");
		});
		rowOne.add(intentText);

		//Send image intent
		var intentImage = Ti.UI.createButton({
			title : "Share Photo",
			font : {
				size : 8,
				color : "#000000"
			},
			height : "45dip"
		});
		intentImage.addEventListener("click", function(e) {
			var intentImage = Ti.Android.createIntent({
				type : "image/*",
				action : Ti.Android.ACTION_PICK
			});
			intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
			Ti.Android.createIntentChooser(intentImage, "Share Photo");

			var activityImageIntent = Ti.Android.currentActivity;
			var intentImagePending = Ti.Android.createPendingIntent({
				activity : activityImageIntent,
				intent : intentImage
			});

			//update image view to display selected photo
			var intentActivityCurrent = viewSocialAll.getActivity();
			intentActivityCurrent.startActivityForResult(intentImagePending, function(e) {
				if (e.resultCode == Ti.Android.RESULT_OK) {
					var Content = require("yy.ticontent");
					var filePathNative = e.intentImagePending.data;
					if (filePathNative.indexOf("content://") === 0) {
						filePathNative = "file://" + Content.resolveAudioPath(e.intentImagePending.data);
					} else {
						filePathNative = decodeURIComponent(filePathNative);
					}
				}
			});

		});
		rowOne.add(intentImage);

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
