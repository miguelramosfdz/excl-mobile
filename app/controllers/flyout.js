var args = arguments[0] || {};

var ageFilterOn;

Alloy.Models.app.on('change:customizeLearning', function(e) {
	var customizeLearning = Alloy.Models.app.get('customizeLearning');
	
	if(customizeLearning && !ageFilterEnabled) enableAgeFilter();
	else if(!customizeLearning && ageFilterEnabled) disableAgeFilter();
});	// jly

function disableCustomLearn(e) {
	Alloy.Models.app.set('customizeLearning', false);
	closeMenu(e);
}

function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu();
}

function openExhibitPage(e) {
	Alloy.Globals.navController.home();
}

function bestForAgesHandler(e) {
	var ready = Alloy.Collections.filter.ready;

	if (ready) {
		Alloy.Models.app.set('customizeLearning', true);
		Alloy.createController('filterActivationModal').getView().open();
	} else {
		Alloy.Models.app.retrieveFilters();
		alert('Attempting to retrieve filters.  Try again in a moment.');
	}
}

function enableAgeFilter() {
	ageFilterEnabled = true;
	$.bestForAgesRow.backgroundColor = "#00CC00";
	$.agesLabel.text = "Edit Filter";
	showEditAgeOption();
}

function disableAgeFilter() {
	ageFilterEnabled = false;
	$.bestForAgesRow.backgroundColor = "#F2F2F2";
	$.agesLabel.text = "Filter by Age";
	hideEditAgeOption();
}

function showEditAgeOption() {
	$.viewRowCollapsible.height = '50dip';
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

function init() {

	ageFilterOn = Alloy.Models.app.get("customizeLearning");
	toggleAgeFilter(ageFilterOn);

	Ti.API.info("Customized Learning: " + ageFilterOn);

	//Alloy.Models.app.on("change:customizeLearning", myInit)

	// detectAgeFilterSet(filterAgeSet);
	// detectAgeFilterOn(filterAgeOn);
	// disableAgeFilter();

	viewService = Alloy.Globals.setPathForLibDirectory('customCalls/viewService');
	viewService = new viewService();
	buttonService = Alloy.Globals.setPathForLibDirectory('customCalls/buttonService');
	buttonService = new buttonService();
}

var viewService;
var buttonService;

init();
