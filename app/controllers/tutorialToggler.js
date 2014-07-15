var args = arguments[0] || {};

var TutorialService = require('tutorialService/tutorialService');
var tutorialService = new TutorialService();


function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu();
}

function tutorialHandler(e) {
	CloseToggler();
	tutorialService.resetTutorialMode();
	Alloy.Globals.navController.restart();
}

function CloseToggler() {
	Alloy.Globals.navController.close();
}
