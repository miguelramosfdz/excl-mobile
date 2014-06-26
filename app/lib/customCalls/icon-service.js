function iconService(){
	var iconRootAndroid = "/images/icons_android/";
	var iconRootIos = "images/icons_ios/";
}

iconService.prototype.getIcon = function(buttonId, filename){	
	if (OS_ANDROID){
		buttonId.backgroundImage = iconRootAndroid + filename;
	}
	else if (OS_IOS){
		buttonId.backgroundImage = iconRootIos + filename;
	}
};

module.exports = iconService;