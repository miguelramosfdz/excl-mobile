var args = arguments[0] || {};
var APICalls = setPathForLibDirectory("customCalls/apiCalls");

var ageFilterOn = Alloy.Models.app.get("customizeLearningEnabled");
var ageFilterSet = Alloy.Models.app.get("customizeLearningSet");
var viewService = setPathForLibDirectory('customCalls/viewService');
viewService = new viewService();
var buttonService = setPathForLibDirectory('customCalls/buttonService');
buttonService = new buttonService();

Alloy.Models.app.on('change:customizeLearningSet', activateFiltersWithSet);
Alloy.Models.app.on('change:customizeLearningEnabled', activateFiltersWithEnable);

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function activateFiltersWithSet() {
	ageFilterSet = Alloy.Models.app.get('customizeLearningSet');
	if (ageFilterSet) {
		activateFiltersWithEnable();
	} else {
		//This spot is for a reset function that will "reset filtering to startup conditions". This does not seem relevant.
	}
}

function activateFiltersWithEnable() {
	ageFilterOn = Alloy.Models.app.get('customizeLearningEnabled');
	if (ageFilterSet && ageFilterOn) {
		enableAgeFilter();
	} else if (!ageFilterSet && ageFilterOn) {
		disableAgeFilter();
	}
}

function toggleCustomLearning() {
	if (ageFilterOn) {
		Alloy.Models.app.set('customizeLearningEnabled', false);
		APICalls.info("Customized Learning Disabled");
		formatRowEnable();
	} else {
		Alloy.Models.app.set('customizeLearningEnabled', true);
		APICalls.info("Customized Learning Enabled");
		formatRowDisable();
	}
	closeMenu();
}

function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu();
}

function openExhibitPage(e) {
	Alloy.Globals.navController.home();
}

function setCustomLearn(e) {
	var ready = Alloy.Collections.filter.ready;

	if (ready) {
		Alloy.Models.app.set('customizeLearningSet', true);
		Alloy.createController('filterActivationModal').getView().open();
		enableAgeFilter();
		showEditAgeOption();
	} else {
		Alloy.Models.app.retrieveFilters();
		alert('Attempting to retrieve filters.  Try again in a moment.');
	}
}

function enableAgeFilter() {
	Alloy.Models.app.set("customizeLearningEnabled", true);
	formatRowDisable();
	showEditAgeOption();
}

function disableAgeFilter() {
	Alloy.Models.app.set("customizeLearningEnabled", false);
	formatRowEnable();
	hideEditAgeOption();
}

function formatRowEnable() {
	$.agesLabel.text = "Turn Filter On";
	$.customLearnRow.backgroundColor = "F2F2F2";
}

function formatRowDisable() {
	$.agesLabel.text = "Turn Filter Off";
	$.customLearnRow.backgroundColor = "C0C0C0";
}

function rowFilterEventListener() {
	
	Ti.API.info("event fired: set: " + ageFilterSet + ", on: " + ageFilterOn);
	
	if (ageFilterSet && ageFilterOn) {
		disableAgeFilter();
		closeMenu();
	} else if (ageFilterSet && !ageFilterOn) {
		enableAgeFilter();
		closeMenu();
	} else if (!ageFilterSet && !ageFilterOn) {
		setCustomLearn();
	} else {
		Ti.API.info("Unrecognized filter set/enable combination");
	}
}

function showEditAgeOption() {
	$.viewRowCollapsible.height = "50dip";
	$.toggleView.show();
}

function hideEditAgeOption() {
	$.viewRowCollapsible.height = 0;
	$.toggleView.hide();
}

function tutorialHandler(e) {
	closeMenu(e);
	Alloy.Globals.navController.open(Alloy.createController("tutorial"));
}
