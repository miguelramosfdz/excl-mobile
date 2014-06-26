var iconRootAndroid = "/images";
var iconRootIos = "images";

var iconCameraReadyAndroid = "/icons_android/camera_ready.png";
var iconCameraBusyAndroid = "/icons_android/camera_busy.png";
var iconTextShareReadyAndroid = "/icons_android/share_ready.png";
var iconTextShareBusyAndroid = "/icons_android/share_busy.png";

var iconCameraReadyIos = "/icons_ios/camera_ready.png";
var iconCameraBusyIos = "/icons_ios/camera_busy.png";
var iconTextShareReadyIos = "/icons_ios/share_ready.png";
var iconTextShareBusyIos = "/icons_ios/share_busy.png";



function setButtonIconForTextReady (buttonId){
	if (OS_IOS) {
		buttonId.backgroundImage = iconTextShareReadyIos;
	} else if (OS_ANDROID) {
		buttonId.backgroundImage = iconTextShareReadyAndroid;
	}
}

function setButtonIconForTextBusy (buttonId){
	if (OS_IOS) {
		buttonId.backgroundImage = iconTextShareBusyIos;
	} else if (OS_ANDROID) {
		buttonId.backgroundImage = iconTextShareBusyAndroid;
	}
}

function setButtonIconForImageReady (buttonId){
	if (OS_IOS) {
		buttonId.backgroundImage = iconCameraReadyIos;
	} else if (OS_ANDROID) {
		buttonId.backgroundImage = iconCameraReadyAndroid;
	}
}

function setButtonIconForImageBusy (buttonId){
	if (OS_IOS) {
		buttonId.backgroundImage = iconCameraBusyIos;
	} else if (OS_ANDROID) {
		buttonId.backgroundImage = iconCameraBusyAndroid;
	}
}


module.exports = iconService;