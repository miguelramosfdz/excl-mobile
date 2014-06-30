function intentService(){};
//Handles all interaction between the app and other apps on the device

intentService.prototype.sendIntentTextAndroid = function(postTags){
	var intentText = Ti.Android.createIntent({
		action : Ti.Android.ACTION_SEND,
		type : 'text/plain'
	});
	intentText.putExtra(Ti.Android.EXTRA_TEXT, postTags);
	intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentText, "Send message via"));
};

intentService.prototype.sendIntentTextiOS = function(postTags){
	//Use TiSocial.Framework module to share text
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		Social.activityView({
			text : postTags
		});
	} else {
		alert("Text sharing is not available on this device"); //For some very old versions of iOS
	}
};

intentService.prototype.sendIntentImageAndroid = function(postTags, imageFilePath){
	var intentImage = Ti.Android.createIntent({
		type : "image/*",
		action : Ti.Android.ACTION_SEND
	});
	intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
	intentImage.putExtra(Ti.Android.EXTRA_TEXT, postTags);
	intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, imageFilePath);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share photo via"));
};

intentService.prototype.sendIntentImageiOS = function(postTags, imageFilePath, imageFilePathInstagram, instagramAnchor){
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
			callback : function(e) {
				intentService.prototype.openInstagram(postTags, imageFilePathInstagram, instagramAnchor);
			}}]);

	} else {
		alert("Photo sharing is not available on this device");
	}
};

intentService.prototype.openInstagram = function(postTags, imageFilePathInstagram, instagramAnchor) {
	alert("Made it to openInstagram");
	
	var win = Ti.UI.createWindow();
	
	//var docImageView = Ti.UI.createImageView({ "image": imageFilePathInstagram});
	//win.add(docImageView);
	win.open();
	
    //var docViewer = Ti.UI.iOS.createDocumentViewer({ "url": imageFilePathInstagram, "UTI": "com.instagram.exclusivegram" });
    //alert(docViewer);
    //docViewer.UTI = "com.instagram.exclusivegram";
   // docViewer.show({ "view": instagramAnchor, "animated": true });
    
};

module.exports = intentService;