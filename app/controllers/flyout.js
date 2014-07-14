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
	} else {
		Alloy.Models.app.retrieveFilters();
		alert('Attempting to retrieve filters.  Try again in a moment.');
	}
}

function enableAgeFilter() {
	$.agesLabel.text = "Turn Filter Off";
	$.customLearnRow.backgroundColor = "C0C0C0";
	showEditAgeOption();
}

function disableAgeFilter() {
	$.agesLabel.text = "Turn Filter On";
	$.customLearnRow.backgroundColor = "F2F2F2";
	hideEditAgeOption();
}

function showEditAgeOption() {
	$.viewRowCollapsible.height = "50dip";
	$.toggleView.show();
}

function hideEditAgeOption() {
	$.viewRowCollapsible.height = 0;
	$.toggleView.hide();
}

function rowFilterEventListener() {
	if (ageFilterSet && ageFilterOn) {
		Ti.API.info("Filter disabled");
		Alloy.Models.app.set("customizeLearningEnabled", false);
		disableAgeFilter();
		closeMenu();
	} else if (ageFilterSet && !ageFilterOn) {
		Ti.API.info("Filter enabled");
		Alloy.Models.app.set("customizeLearningEnabled", true);
		enableAgeFilter();
		closeMenu();
	} else if (!ageFilterSet && !ageFilterOn) {
		Ti.API.info("Custom Learning Set");
		Alloy.Models.app.set("customizeLearningEnabled", true);
		setCustomLearn();
	} else {
		Ti.API.info("Unrecognized filter set/enable combination");
	}
	ageFilterSet = Alloy.Models.app.get('customizeLearningSet');
	ageFilterOn = Alloy.Models.app.get('customizeLearningEnabled');
	//Ti.API.info("Filter Fired (fly): set: " + ageFilterSet + ", on: " + ageFilterOn);
}

function tutorialToggler(e) {
	closeMenu(e);
	Alloy.Globals.navController.home();
	Alloy.Globals.navController.open(Alloy.createController("tutorialToggler"));
}

function tutorialHandler(e) {
	closeMenu(e);
	Alloy.Globals.navController.open(Alloy.createController("exhibitTutorialPage"));
}

function languageHandler(e) {
	//var win = viewService.createModalInputView();
	
	/*languageChoices = [];
	languageChoices[0] = "English";
	languageChoices[1] = "Spanish";
	languageChoices[2] = "Korean";
	var languagePicker = Ti.UI.createPicker({
		selectionIndicator: true
	});
	languagePicker.add(languageChoices);
	win.add(languagePicker);
	*/
	
	var languageOptionsFullWord = ['English', 'Spanish', 'Gizoogle', 'Cancel'];
	var languageOptionsTwoLetterCode = ['en', 'es', 'gz'];
	languageOptionsTwoLetterCode.push('cancel');
	var languageDialog = Titanium.UI.createOptionDialog({
		//title : 'Choose a language',
		options : languageOptionsFullWord,
		cancel : 3
	});
	languageDialog.addEventListener("click", function(e){
		if (OS_ANDROID){
			var currentLanguage = languageOptionsTwoLetterCode[languageDialog.index];
		}
		else if (OS_IOS){
			var currentLanguage = languageOptionsTwoLetterCode[e.index];
		}
		
		if (currentLanguage != 'cancel'){
			Alloy.Globals.currentLanguage = currentLanguage;
		}
		else{
			alert("Cancel was selected");
		}
		
	});
	languageDialog.show();

	closeMenu(e);
	
}

function detectFilterConditions() {
	if (ageFilterSet && ageFilterOn) {
		disableAgeFilter();
	} else if (ageFilterSet && !ageFilterOn) {
		enableAgeFilter();
	} else if (!ageFilterSet && !ageFilterOn) {
		//setCustomLearn();
	} else {
		Ti.API.info("Unrecognized filter set/enable combination");
	}
	Ti.API.info("Filter StartUp (fly): set: " + ageFilterSet + ", on: " + ageFilterOn);
}

detectFilterConditions();
