var args = arguments[0] || {};

var analyticsPageTitle = "Home";
var analyticsPageLevel = "Home";
function setAnalyticsPageTitle(title) {
	analyticsPageTitle = title;
}

function getAnalyticsPageTitle() {
	return analyticsPageTitle;
}

function setAnalyticsPageLevel(level) {
	analyticsPageLevel = level;
}

function getAnalyticsPageLevel() {
	return analyticsPageLevel;
}
exports.setAnalyticsPageTitle = setAnalyticsPageTitle;
exports.getAnalyticsPageTitle = getAnalyticsPageTitle;
exports.setAnalyticsPageLevel = setAnalyticsPageLevel;
exports.getAnalyticsPageLevel = getAnalyticsPageLevel;

function openExhibits() {
	var controller = Alloy.createController("exhibitLanding");
	controller.setAnalyticsPageTitle("Exhibit Landing");
	controller.setAnalyticsPageLevel("Exhibit Landing");
	Alloy.Globals.navController.open(controller);
}

function openMap() {
	var controller = Alloy.createController("map");
	Alloy.Globals.navController.open(controller);	
}

function openInfo() {
	var controller = Alloy.createController("info");
	Alloy.Globals.navController.open(controller);	
}

$.navBar.setPageTitle("Children's Museum Of Houston");
$.navBar.hideBackBtn();
Alloy.Globals.navController.open(this);
