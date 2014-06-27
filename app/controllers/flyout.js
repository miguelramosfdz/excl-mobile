var args = arguments[0] || {};

var filterAgeOn = true;
var filterAgeSet = true;
//filterAges vars will be set to the values in memory

function toggleMenu(e) {
	//alert("well you clicked it...");
	return Alloy.Globals.navController.toggleMenu();
}

function openExhibitPage(e) {
	Alloy.Globals.navController.home();
	// Maybe we should change this
}

function openAgeInput(e) {
	if (filterAgeOn) {
		alert("Iz on senior");
	} else {
		alert("Iz off senior");
		filterAgeOn = true;
		filterAgeSet = true;
	}

}

function toggleFilterOn() {
	$.agesLabel.color = "#00CC00";
	$.agesLabel.text = "Filter By Age/n Enabled";
}

function toggleFilterOff() {
	$.agesLabel.color = "#000099";
	$.agesLabel.text = "Filter By Age/n Disabled";
}

function showEditAgeOption() {
	$.tableRowCollapsible.height = "30dip";
}

function shideEditAgeOption() {
	$.tableRowCollapsible.height = "0";
}

function detectAgeFilterOn(filterAgeOn) {
	if (filterAgeOn) {
		toggleFilterOn();
	} else {
		toggleFilterOff();
	}
}

function detectAgeFilterSet(filterAgeSet) {
	if (filterAgeSet) {
		showEditAgeOption();
	} else {
		hideEditAgeOption();
	}
}

function init() {
	detectAgeFilterSet(filterAgeSet);
	detectAgeFilterOn(filterAgeOn);
}

init();
