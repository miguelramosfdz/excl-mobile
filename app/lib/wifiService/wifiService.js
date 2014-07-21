var dontAskAgain = false;

function wifiService() {
};

wifiService.prototype.detectAndroidConnection = function() {
	if (OS_ANDROID) {
		if (!dontAskAgain) {
			Ti.API.info("Checking for Wi-Fi");
			if (Ti.Network.NETWORK_WIFI == false) {
				var dialog = Ti.UI.createOptionDialog({
					options : ['Yes (Open Settings)', 'No', "Don't Ask Again"],
					cancel : 1,
					title : 'Do you want to switch to Wi-Fi?'
				});
				dialog.addEventListener("click", function(e) {
					var selectedIndex = dialog.selectedIndex;
					if (selectedIndex == 0) {
						var intent = Ti.Android.createIntent({
							className : 'com.android.settings.wifi.WifiSettings',
							packageName : 'com.android.settings',
							action : Ti.Android.ACTION_MAIN,
						});
						Ti.Android.currentActivity.startActivity(intent);
					} else if (selectedIndex == 2) {
						dontAskAgain = true;
					}
				});
				dialog.show();
			}
		}
	}
};

module.exports = wifiService;
