// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var NavigationController = require('navigationService/NavigationController');
Alloy.Globals.navController = new NavigationController();

var AnalyticsController = require('analyticService/analyticService');
Alloy.Globals.analyticsController = new AnalyticsController();


// TODO  DELETE THESE AFTER THE 3 INSTANCES ARE FUNCTIONAL
var dreamhostersAPI = "http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/81";
var backupAPI = "http://tvt.redhale.com/wordpress/wp-json/v01/excl/museum/81";

// TODO MAKE THESE # INSTANCES FUNCTIONAL
var devWordpressEnvironment = "http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/81";
var qaWordpressEnvironment = '';
var prodWordpressEnvironment = '';

Alloy.Globals.rootWebServiceUrl = devWordpressEnvironment;

Alloy.Globals.setPathForLibDirectory = function(libFile){
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

Alloy.Globals.isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// do not remove: initialization of global backbone models
Alloy.Models.app = Alloy.Models.instance('app');
Alloy.Collections.filter = Alloy.Collections.instance('filter');
Alloy.Models.app.retrieveFilters();

