var args = arguments[0] || {};

function tutorialExit() {
	// var newView = Ti.UI.createView();
	// $.overlayView.add(newView);
	// $.addClass(newView, "fullScreenOverlay");
	Alloy.Globals.navController.home();
}

function goToPageTutorial() {
	//closeMenu(e);
	Alloy.Globals.navController.home();
	Alloy.Globals.navController.open(Alloy.createController("postTutorialPage"));
}