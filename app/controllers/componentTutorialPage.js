var args = arguments[0] || {};

function tutorialExit() {
	// var newView = Ti.UI.createView();
	// $.overlayView.add(newView);
	// $.addClass(newView, "fullScreenOverlay");
	$.componentTutorialPage.hide();
	Alloy.Globals.navController.home();
}

function goToPostTutorial() {
	//closeMenu(e);
	//Alloy.Globals.navController.home();
	//Alloy.Globals.navController.open(Alloy.createController("postTutorialPage"));
	$.componentTutorialPage.hide();
	var tutorialController = Alloy.createController("postTutorialPage");
	var tutorialView = tutorialController.getView();
	Alloy.Globals.navController.Page.add(tutorialView);
}