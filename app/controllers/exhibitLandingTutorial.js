var args = arguments[0] || {};

function tutorialExit() {
	// var newView = Ti.UI.createView();
	// $.overlayView.add(newView);
	// $.addClass(newView, "fullScreenOverlay");
	$.exhibitTutorialPage.hide();
	//$.exhibitTutorialPage.remove(view);
	Alloy.Globals.navController.home();
}

function init(){
	//$.ExitButton.addEventListener("click", );
}

function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu();
}

function goToComponentTutorial(e) {
	$.exhibitTutorialPage.hide();
	Alloy.Globals.navController.home();
	//Alloy.Globals.navController.open(Alloy.createController("componentTutorialPage"));
	var tutorialController = Alloy.createController("componentLandingTutorial");
	var tutorialView = tutorialController.getView();
	Alloy.Globals.navController.Page.add(tutorialView);
}