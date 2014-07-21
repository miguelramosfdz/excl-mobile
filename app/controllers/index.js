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

var url = Alloy.Globals.rootWebServiceUrl;

//var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var dataRetriever = require('dataRetriever/dataRetriever');

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
}


function initializeWithJSON(json, controller) {
	populateWindow(json);
	// Alloy.Globals.navController.open(controller);
}


function retrieveJson(jsonURL, controller) {
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			initializeWithJSON(returnedData, controller);
		}
	});
}

function reloadWithJSON(json, controller) {
	populateWindow(json);
}

function populateWindow(json) {
	var museums = Alloy.Collections.instance('museum');
	var museumModel = Alloy.createModel('museum');
	var page_info = json.data.museum.info;
			 museumModel.set({
				 'info' : museum.info,
			 });
			 museums.add(museumModel);
	
	//Ti.API.info("******************************************TESTING***************************************************");
}

retrieveJson(url, this);

// 
Alloy.Globals.navController.open(this);
