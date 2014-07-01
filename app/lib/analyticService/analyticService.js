
function AnalyticsController() {
	this.pageLevelCustomDimensionIndex = 4; // Index from Google Analytics website // TODO: get from Wordpress dynamically
}

AnalyticsController.prototype.getTracker = function() {
<<<<<<< HEAD
	if (this.trackerID == null) {
=======
	if (!this.validateTrackerID(this.trackerID)) {
		apiCalls.info("Invalid or no Google Analytics Tracker ID found. Turning off analytics.");
>>>>>>> Added Google Analytics tracking to the Navigation controller. Known issue: right now it double counts hits for some reason.
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

AnalyticsController.prototype.validateTrackerID = function(trackerID) {
	return /(UA|YT|MO)-\d+-\d+/i.test(trackerID);
};

AnalyticsController.prototype.setTrackerID = function(trackerID) {
	this.trackerID = trackerID;
};

AnalyticsController.prototype.trackScreen = function(screenName, pageLevel){
	var tracker = this.getTracker();
	if (!tracker) {return false;}

	var customDimensionObject = {};
	customDimensionObject[this.pageLevelCustomDimensionIndex] = pageLevel;

	apiCalls.info("Now tracking screen " + screenName);
	var properties = {
		path: screenName,
		customDimension: customDimensionObject
	};
	tracker.trackScreen(properties);
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
