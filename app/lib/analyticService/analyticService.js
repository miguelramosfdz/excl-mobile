
function AnalyticsController() {
	//Google analytics stuff
	var GA = require('analytics.google');
	//GA.debug = true;
	// this.GA.trackUncaughtExceptions = true;
		
	this.tracker = GA.getTracker("UA-52199402-1");
	
	
}

AnalyticsController.prototype.trackScreen = function(screenName){
	this.tracker.trackScreen(screenName);
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
