function intentService(){};

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
		Social.addEventListener("cancelled", function(e){
			//toggleTextShareButtonStatusInactive(shareTextButtonId); //HMMMMMMMMM
		});
	} else {
		alert("Text sharing is not available on this device"); //For some very old versions of iOS
	}
};

intentService.prototype.sendIntentImageAndroid = function(){
	
};

intentService.prototype.sendIntentImageiOS = function(){
	
};

module.exports = intentService;