var args = arguments[0] || {};

var TutorialService = require('tutorialService/tutorialService');
var tutorialService = new TutorialService();


function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu();
}

function tutorialHandler(e) {
	CloseToggler();
	
}

function CloseToggler() {
	//Alloy.Globals.navController.close();
	$.tutorialToggler.close();
}
