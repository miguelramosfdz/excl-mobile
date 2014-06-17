Using the NavigationController
=============================

* Instantiate singleton controller in alloy.js with: 

	`var NavigationController = require('NavigationController');
	 Alloy.Globals.navController = new NavigationController();`
	
	
* Open new windows with:

	`Alloy.Globals.navController.open(Alloy.createController('yourControllerNameHere'));`
	 
	 
* If you want to add the kiosk mode listener to an element on your page, use:

	`Alloy.Globals.navController.addKioskModeListener($.yourHomeButtonId);`
	
	
* To access kiosk mode status, use:

	`Alloy.Globals.navController.isInKioskMode()`
	
	
* If you need to make changes on your page on entering kiosk mode, define a function to make those changes and assign it like so:

	`$.updateForKioskMode = function(view){/*your code here*/};`
	
	
* Finally, to navigate home, you can call:

	`Alloy.Globals.navController.home();`
	
TODO:
=====
+1. Rename Navigation controller to service and put in folder
2. Decompose methods a bit more
3. Try to avoid "if else" constructions
+4. Rename 'that' to 'self' 
+5. Call isInKioskMode() instead of just accessing the variable
6. Make an init() function
+7. Separate updateForKioskMode() into onEnterKioskMode() and onExitKioskMode() 
8. Add more comments
	  
	