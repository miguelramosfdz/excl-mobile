var args = arguments[0] || {};

var TutorialService = require('tutorialService/tutorialService');
var tutorialService = new TutorialService();

function tutorialExit(e) {
	tutorialService.endTutorialMode();
	$.componentTutorialPage.hide();
}

function gotIt(e) {
	tutorialService.gotIt("componentLandingTutorial");
	$.componentTutorialPage.hide();
}