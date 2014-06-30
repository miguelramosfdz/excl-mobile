function goBack(e){
	alert("Back Button Was Clicked");
	Alloy.Globals.navController.close();
}

function menu(e){
	Alloy.Globals.navController.toggleMenu(true);	
}

Alloy.Globals.navController.addKioskModeListener($.flyout);

