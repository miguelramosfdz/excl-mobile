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

var dreamhostersAPI = "http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/13";
var backupAPI = "http://tvt.redhale.com/wordpress/wp-json/v01/excl/museum/81";

Alloy.Globals.rootWebServiceUrl = backupAPI;

/* Google Analytics */
var GA = require('analytics.google');
//GA.debug = true;
GA.trackUncaughtExceptions = true;

var tracker = GA.getTracker("UA-52199402-1");
tracker.trackEvent({
	category: "category",
	action: "test",
	label: "label",
	value: 1
});
tracker.trackSocial({
	network: "facebook",
	action: "action",
	target: "target"
});
tracker.trackTiming({
	category: "",
	time: 10,
	name: "",
	label: ""
});
tracker.trackScreen("Home");