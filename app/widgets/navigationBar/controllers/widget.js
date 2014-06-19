function back(e){
	Alloy.Globals.navController.close();
}

function menu(e){
	Alloy.Globals.navController.home();	
}

Alloy.Globals.navController.addKioskModeListener($.flyout);

