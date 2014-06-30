
function AnalyticsController() {}

var apiCalls;
var rootPath = (typeof Titanium == 'undefined')? '../../lib/customCalls/' : 'customCalls/';
setPathForLibDirectory(rootPath);
function setPathForLibDirectory(rootPath) {
	apiCalls = require(rootPath + 'apiCalls');
}

AnalyticsController.prototype.getTracker = function() {
	if (this.trackerID == null) {
		apiCalls.info("No Google Analytics Tracker ID found. Turning off analytics.");
		return false;
	}
	if (this.tracker == null && this.trackerID != null) {
		apiCalls.info("Instantiating Google Analytics tracker...");
		this.GA = require('analytics.google');
		//this.GA.debug = true; // Outputs more explicit messages to the console
		//this.GA.trackUncaughtExceptions = true;
		this.tracker = this.GA.getTracker(this.trackerID);
	}
	return this.tracker;
};

AnalyticsController.prototype.setTrackerID = function(trackerID) {
	this.trackerID = trackerID;
};

AnalyticsController.prototype.trackScreen = function(screenName, customDimension){
	var tracker = this.getTracker();
	if (!tracker) {return false;}
	var dimensions = {};
	dimensions["Exhibit Landing"] = 2;
	dimensions["Component Landing"] = 3;
	dimensions["Post Landing"] = 1;
	
	var dimensionIndex = dimensions[customDimension];
	var customDimensionObject = {};
	customDimensionObject[dimensionIndex = customDimension];

	apiCalls.info("Now tracking screen " + screenName);
	var properties = {
		path: screenName,
		customDimension: customDimensionObject
	};
	tracker.trackScreen(properties);
};

AnalyticsController.prototype.trackEvent = function(category, action, label, value) {
	var tracker = this.getTracker();
	alert(tracker);
	if (!tracker) {return false;}
	apiCalls.info("Now tracking event with category: " + category + ", action: " + action + ", label: " + label + ", value: " + value);
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
