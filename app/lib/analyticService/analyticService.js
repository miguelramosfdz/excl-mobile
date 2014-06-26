
function AnalyticsController() {
	//Google analytics stuff
	var GA = require('analytics.google');
		
	this.tracker = GA.getTracker("UA-52199402-1");
	
	//GA.debug = true; // Outputs more explicit messages to the console
	//this.GA.trackUncaughtExceptions = true;
}

AnalyticsController.prototype.trackScreen = function(screenName){
	Ti.API.info("Now tracking screen " + screenName);
	this.tracker.trackScreen(screenName);
};

AnalyticsController.prototype.trackEvent = function(category, action, label, value) {
	Ti.API.info("Now tracking event with category: " + category + ", action: " + action + ", label: " + label + ", value: " + value);
	this.tracker.trackEvent({
		category: category,
		action: action,
		label: label,
		value: value
	});
};

module.exports = AnalyticsController;

/*tracker.trackEvent({
	category: "category",
	action: "click",
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
});*/
