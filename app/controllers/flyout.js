var args = arguments[0] || {};
var APICalls = setPathForLibDirectory("customCalls/apiCalls");

var ageFilterOn = Alloy.Models.app.get("customizeLearningEnabled");
var ageFilterSet = Alloy.Models.app.get("customizeLearningSet");
var viewService = setPathForLibDirectory('customCalls/viewService');
viewService = new viewService();
var buttonService = setPathForLibDirectory('customCalls/buttonService');
buttonService = new buttonService();
var dialogService = setPathForLibDirectory('customCalls/dialogService');
dialogService = new dialogService();
var languageService = setPathForLibDirectory('languageService/languageService');
languageService = new languageService();
var TutorialService = setPathForLibDirectory('tutorialService/tutorialService');
var tutorialService = new TutorialService();

Alloy.Models.app.on('change:tutorialOn', updateTutorialUI);
Alloy.Models.app.on('change:customizeLearningSet', activateFiltersWithSet);
Alloy.Models.app.on('change:customizeLearningEnabled', activateFiltersWithEnable);
Alloy.Models.app.on('change:currentLanguage', onLanguageChange);

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
	//closeMenu(e);
	//Alloy.Globals.navController.open(Alloy.createController("tutorialToggler"));
	//Alloy.createController('tutorialToggler').getView().open();
	//closeMenu(e);
	if (!Alloy.Models.app.get("tutorialOn")) {
		tutorialService.resetTutorialMode();
		Alloy.Models.app.set("tutorialOn", true);
		Alloy.Models.app.trigger("change:tutorialOn");
		var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Yes', 'No'],
		    message: 'Tutorial mode activated! Would you like to start at the beginning?',
		    title: 'Tutorial Mode'
		});
		var style;
		if (Ti.Platform.name === 'iPhone OS'){
		  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
		}
		else {
		  style = Ti.UI.ActivityIndicatorStyle.DARK;
		}
		var activityIndicator = Ti.UI.createActivityIndicator({
		  color: 'green',
		  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
		  message: 'Loading...',
		  style:style,
		  top:10,
		  left:10,
		  height:Ti.UI.SIZE,
		  width:Ti.UI.SIZE
		});
		dialog.addEventListener('click', function(e){
			if (e.index !== e.source.cancel){
				Alloy.Globals.navController.restart();
			}
			$.getView().add(activityIndicator);
			activityIndicator.show();
		});
		dialog.show();
	} else {
		tutorialService.endTutorialMode();
		Alloy.Models.app.set("tutorialOn", false);
		Alloy.Models.app.trigger("change:tutorialOn");
	}
	updateTutorialUI();
}

function updateTutorialUI() {
	if (Alloy.Models.app.get("tutorialOn")) {
		$.tutorialLabel.text = "Tutorial is On";
	} else {
		$.tutorialLabel.text = "Tutorial is Off";
	}
}

function languageHandler(e){
	languageService.displayDialog();
}

function onLanguageChange(){
	setMuseumJSONWithLanguageDialog();
	refreshPage();
}

function refreshPage(){
	Alloy.Globals.navController.restart();
}

function setMuseumJSONWithLanguageDialog(){
	var retriever = Alloy.Globals.setPathForLibDirectory('dataRetriever/dataRetriever');
	var url = Alloy.Globals.rootWebServiceUrl;

	retriever.fetchDataFromUrl(url, function(response) {
		if(response) {
			Alloy.Globals.museumJSON = response;
			createInternationalizationMessageDialog();
		}
	});
}

function createInternationalizationMessageDialog(){
	var message = Alloy.Globals.museumJSON.data.museum.internationalization_message;
	if (message != ''){
		alertDialog = dialogService.createAlertDialog(message);
		alertDialog.buttonNames = ["Ok"];
		alertDialog.show();
	}
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
