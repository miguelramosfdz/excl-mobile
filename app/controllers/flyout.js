var args = arguments[0] || {};

function toggleMenu(e){
	//alert("well you clicked it...");
	Alloy.Globals.navController.toggleMenu();
}

function openExhibitPage(e){
	Alloy.Globals.navController.home();		// Maybe we should change this 
}
