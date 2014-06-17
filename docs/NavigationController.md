Using the NavigationController
=============================

* Instantiate singleton controller in alloy.js with: 

	`var NavigationController = require('NavigationController');
	 Alloy.Globals.navController = new NavigationController();`
	
	
* Open new windows with:

	`Alloy.Globals.navController.open(Alloy.createController('yourControllerNameHere').getView());`
	 
	 
* If you want to add the kiosk mode listener to an element on your page, use:

	`Alloy.Globals.navController.addKioskModeListener($.yourHomeButtonId);`
	
	
* To access kiosk mode status, use:

	`Alloy.Globals.navController.isInKioskMode()`
	
	
* If you need to make changes on your page on entering or exiting kiosk mode, define some functions to do what you want it to 
  do on exit and on enter and pass them when opening like so:

	`Alloy.Globals.navController.open(Alloy.createController('yourControllerNameHere').getView(), onEnterKioskMode, onExitKioskMode);`
	
* Finally, to navigate home, you can call:

	`Alloy.Globals.navController.home();`
	  
	