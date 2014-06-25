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

var idService = require('idService');
Alloy.Globals.deviceID = new idService();

var AnalyticsController = require('analyticService/analyticService');
Alloy.Globals.analyticsController = new AnalyticsController();

var dreamhostersAPI = "http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/81";
var backupAPI = "http://tvt.redhale.com/wordpress/wp-json/v01/excl/museum/81";

Alloy.Globals.rootWebServiceUrl = dreamhostersAPI;