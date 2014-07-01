var args = arguments[0] || {};

var ageFilterEnabled = false;
var filterAgeSet = false;
//filterAges vars will be set to the values in memory

function closeMenu(e) {
	//alert("well you clicked it...");
	return Alloy.Globals.navController.toggleMenu();
}

function openExhibitPage(e) {
	Alloy.Globals.navController.home();
	// Maybe we should change this
}

function bestForAgesHandler(e) {
	//detectAgeFilterOn(filterAgeOn);
	toggleAgeFilter();
	if (!filterAgeSet) {
		openInputMenu();
	}
}

function enableAgeFilter(){
	ageFilterEnabled = true;
	$.agesLabel.color = "#00CC00";
	//$.agesLabel.text = "Filter By Age";
	showEditAgeOption();
}

function disableAgeFilter(){
	ageFilterEnabled = false;
	//$.agesLabel.text = "Filter By Age";
	$.agesLabel.color = "black";
	hideEditAgeOption();
}

function showEditAgeOption() {
	$.tableRowCollapsible.height = '30dip';
}

function hideEditAgeOption() {
	$.tableRowCollapsible.height = 0;
}

function toggleAgeFilter(){
	if(!ageFilterEnabled)
		enableAgeFilter();
	else
		disableAgeFilter();
}

function openInputMenu(){
	
	alert("Insert Jess's singleton Modal here");
	filterAgeSet = true;
	/*
	var modal = viewService.createModalInputView();
	//var table = viewService.createTableView();
	//modal.add(table);
	
	var rowContent = viewService.createTableRow("80");
	var rowSave = viewService.createTableRow("10");
	var rowClose = viewService.createTableRow("10");
	modal.add(rowContent);
	modal.add(rowSave);
	modal.add(rowClose);
	// table.add(rowContent);
	// table.add(rowSave);
	// table.add(rowClose);
	
	var closeButton = buttonService.createButtonWithCustomSize("Close", 20, 150);
	closeButton.addEventListener("click", function(e){
		$.menuView.remove(modal);
	});
	rowClose.add(closeButton);
	//modal.add(closeButton);
	
	$.menuView.add(modal);//*/
	
}

function init(){
	//detectAgeFilterSet(filterAgeSet);
	//detectAgeFilterOn(filterAgeOn);
	//disableAgeFilter();
	
	viewService = Alloy.Globals.setPathForLibDirectory('customCalls/viewService');
	viewService = new viewService();
	buttonService = Alloy.Globals.setPathForLibDirectory('customCalls/buttonService');
	buttonService = new buttonService();
}

var viewService;
var	buttonService;

init();
