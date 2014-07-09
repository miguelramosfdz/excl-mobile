var args = arguments[0] || {};
var APICalls = setPathForLibDirectory("customCalls/apiCalls");

var ageFilterOn;
var ageFilterSet;
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
	if (ageFilterSet && ageFilterOn && !ageFilterEnabled) {
		enableAgeFilter();
	} else if (!ageFilterSet && ageFilterOn && ageFilterEnabled) {
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

function formatRowEnable(){
	$.customLearnRow.title = "Turn Filtering On";
	$.customLearnRow.backgroundColor = "00CC00";
	$.customLearnRow.addEventListener('click', )
}

function formatRowDisable(){
	$.customLearnRow.title = "Turn Filtering Off";
	$.customLearnRow.backgroundColor = "000099";
	
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
		Alloy.Models.app.set('customizeLearningEnabled', true);
		Alloy.createController('filterActivationModal').getView().open();
	} else {
		Alloy.Models.app.retrieveFilters();
		alert('Attempting to retrieve filters.  Try again in a moment.');
	}
}

function enableAgeFilter() {
	ageFilterEnabled = true;
	$.viewRowCollapsible.backgroundColor = "#00CC00";
	$.viewRowCollapsible.text = "Disable Filter";
	$.agesLabel.text = "Edit Filter";
	showEditAgeOption();
}

function disableAgeFilter() {
	ageFilterEnabled = false;
	$.viewRowCollapsible.backgroundColor = "#F2F2F2";
	$.viewRowCollapsible.text = "Enable Filter";
	hideEditAgeOption();
}

function showEditAgeOption() {
	$.viewRowCollapsible.height = "50dip";
	$.disableView.show();
}

function hideEditAgeOption() {
	$.viewRowCollapsible.height = 0;
	$.disableView.hide();
}

function toggleAgeFilter(ageFilterOn) {
	if (ageFilterOn) {
		enableAgeFilter();
	} else {
		disableAgeFilter();
	}
}

function tutorialHandler(e) {
	closeMenu(e);
	Alloy.Globals.navController.open(Alloy.createController("tutorial"));
}

function init() {
	ageFilterSet = Alloy.Models.app.get("customizeLearningSet");
	ageFilterOn = Alloy.Models.app.get("customizeLearningEnabled");
	$.customLearnRow.addEventListener("click", function(e){
		customLearn();
	});
}

init();
