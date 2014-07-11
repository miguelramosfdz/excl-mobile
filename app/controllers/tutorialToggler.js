var args = arguments[0] || {};

function EnableTutorial() {
	
}

function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu();
}

function tutorialHandler(e) {
	Alloy.Globals.navController.close();
	closeMenu(e);
	var tutorialController = Alloy.createController("exhibitTutorialPage");
	var tutorialView = tutorialController.getView();
	Alloy.Globals.navController.Page.add(tutorialView);
}

function CloseToggler() {
	// var newView = Ti.UI.createView();
	// $.overlayView.add(newView);
	// $.addClass(newView, "fullScreenOverlay");
	Alloy.Globals.navController.close();
}
