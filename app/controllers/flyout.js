var args = arguments[0] || {};

var filterAgeOn = true;
var filterAgeSet = false;
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
	detectAgeFilterOn(filterAgeOn);
	if (!filterAgeSet) {
		openInputMenu();
	}
}

function toggleFilterOn() {
	filterAgeOn = true;
	$.agesLabel.color = "#00CC00";
	$.agesLabel.text = "Filter By Age/n Enabled";
}

function toggleFilterOff() {
	filterAgeOn = false;
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

function openInputMenu(){
	var modal = viewService.createModalInputView();
	var table = viewService.createTableVieW();
	modal.add(table);
	
	var rowContent = viewService.createTableRow("80");
	var rowSave = viewService.createTableRow("10");
	var rowClose = viewService.createTableRow("10");
	table.add(rowContent);
	table.add(rowSave);
	table.add(rowClose);
	
	var closeButton = buttonService.createButtonWithCustomSize("Close", 20, 150);
	closeButton.addListenerEvent("click", function(e){
		$.menuTable.remove(modal);
	});
	rowClose.add(closeButton);
	
	$.menuTable.add(modal);
}

function init() {
	detectAgeFilterSet(filterAgeSet);
	detectAgeFilterOn(filterAgeOn);
	
	viewService = Alloy.Globals.setPathForLibDirectory('customCalls/viewService');
	viewService = new viewService();
	buttonService = Alloy.Globals.setPathForLibDirectory('customCalls/buttonService');
	buttonService = new buttonService();
}

init();
