function back(e){
	Alloy.Globals.navController.close();
}

function menu(e){
	Alloy.Globals.navController.toggleMenu(true);	
}

Alloy.Globals.navController.addKioskModeListener($.flyout);

