var args = arguments[0] || {};

var json;
var analyticsPageTitle = "Home";
var analyticsPageLevel = "Home";

var url = Alloy.Globals.rootWebServiceUrl;

//var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var dataRetriever = require('dataRetriever/dataRetriever');

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

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
	var controller = Alloy.createController("exhibitLanding", eval([json]));
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

function retrieveJson(jsonURL) {
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			json = returnedData;
			var museums = Alloy.Collections.instance('museum');
			var museumModel = Alloy.createModel('museum');
			var page_info = json.data.museum.info;
			museumModel.set({
			'info' : museums.info,
			});
			museums.add(museumModel);

		}
	});
}

retrieveJson(url);
Alloy.Globals.navController.open(this);

