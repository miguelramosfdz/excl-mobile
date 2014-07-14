var args = arguments[0] || {};

function tutorialExit() {
	// var newView = Ti.UI.createView();
	// $.overlayView.add(newView);
	// $.addClass(newView, "fullScreenOverlay");
	$.postTutorialPage.hide();
	Alloy.Globals.navController.home();
}

function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu();
}

// function goToComponentTutorial(e) {
	// Alloy.Globals.navController.home();
	// Alloy.Globals.navController.open(Alloy.createController("componentTutorialPage"));
// }