Using the NavigationController
=============================

* Instantiate singleton controller in alloy.js with:
	`var NavigationController = require('NavigationController');`
	`Alloy.Globals.navController = new NavigationController();`
* Open new windows with:
	`Alloy.Globals.navController.open(Alloy.createController('yourControllerNameHere'));`
* If you want to add the kiosk mode listener to an element on your page, use:
	`Alloy.Globals.navController.addKioskModeListener($.yourHomeButtonId);`
* To access kiosk mode status, use:
	`Alloy.Globals.navController.kioskMode`
* If you need to make changes on your page on entering kiosk mode, define a function to make those changes and assign it like so:
	`$.updateForKioskMode = function (view) {/*your code here*/};`
* Finally, to navigate home, you can call:
	`Alloy.Globals.navController.home();`
	