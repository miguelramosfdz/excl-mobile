var args = arguments[0] || {};

var ageFilterOn;

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
	$.agesLabel.color = "#00CC00";
	showEditAgeOption();
}

function disableAgeFilter() {
	ageFilterEnabled = false;
	$.agesLabel.color = "black";
	hideEditAgeOption();
}

function showEditAgeOption() {
	$.tableRowCollapsible.height = '30dip';
}

function hideEditAgeOption() {
	$.tableRowCollapsible.height = 0;
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

	Ti.API.info("custom learn: " + ageFilterOn);

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
