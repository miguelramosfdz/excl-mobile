var args = arguments[0] || {};

function EnableTutorial() {
	
}

function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu();
}

function tutorialHandler(e) {
	Alloy.Globals.navController.close();
	closeMenu(e);
	Alloy.Globals.navController.open(Alloy.createController("exhibitTutorialPage"));
}

function CloseToggler() {
	// var newView = Ti.UI.createView();
	// $.overlayView.add(newView);
	// $.addClass(newView, "fullScreenOverlay");
	Alloy.Globals.navController.close();
}
