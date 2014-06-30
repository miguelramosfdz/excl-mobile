
function AnalyticsController() {}

AnalyticsController.prototype.getTracker = function() {
	if (this.trackerID == null) {
		return false;
	}
	if (this.tracker == null && this.trackerID != null) {
		this.GA = require('analytics.google');
		this.tracker = this.GA.getTracker(this.trackerID);
		//this.GA.debug = true; // Outputs more explicit messages to the console
		//this.GA.trackUncaughtExceptions = true;
	}
	return this.tracker;
};

AnalyticsController.prototype.setTrackerID = function(trackerID) {
	this.trackerID = trackerID;
};

AnalyticsController.prototype.trackScreen = function(screenName){
	var tracker = this.getTracker();
	if (!tracker) {return false;}
	Ti.API.info("Now tracking screen " + screenName);
	tracker.trackScreen(screenName);
};

AnalyticsController.prototype.trackEvent = function(category, action, label, value) {
	var tracker = this.getTracker();
	if (!tracker) {return false;}
	Ti.API.info("Now tracking event with category: " + category + ", action: " + action + ", label: " + label + ", value: " + value);
	tracker.trackEvent({
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
