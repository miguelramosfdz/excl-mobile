var assert = require("assert");
var sinon = require("sinon");

var analyticsController = require('../../lib/analyticService/analyticService');
var apiCalls = require('../../lib/customCalls/apiCalls');

describe('Analytics Service', function(){
	before(function() {
		var stub = sinon.stub(apiCalls, "info");
	});
	
	beforeEach(function() {
		fakeTracker = {
			trackScreen: function() {},
			trackEvent: function() {}
		};
		trackScreenSpy = sinon.spy(fakeTracker, 'trackScreen');
		trackEventSpy = sinon.spy(fakeTracker, 'trackEvent');
		serviceWithStub = new analyticsController();
		sinon.stub(serviceWithStub, "getTracker").returns(fakeTracker);
		serviceWithoutStub = new analyticsController();
	});
	
	describe('analyticsController', function() {
		it('should have a page level custom dimension index set', function() {
			assert(typeof serviceWithStub.pageLevelCustomDimensionIndex == "number", "pageLevelCustomDimensionIndex is " + serviceWithStub.pageLevelCustomDimensionIndex);
		});
	});
	
	describe('#trackScreen()', function(){
		it('should call GA.getTracker', function(){
			serviceWithStub.getTracker().trackScreen("Screen Name", "Page Level");
			assert(trackScreenSpy.calledOnce);
		});
		it('should call tracker.trackScreen with correct arguments', function() {
			var customDimensionObject = {};
			customDimensionObject[serviceWithStub.pageLevelCustomDimensionIndex] = "Page Level";
			var properties = {
				path: "Screen Name",
				customDimension: customDimensionObject
			};

			serviceWithStub.trackScreen("Screen Name", "Page Level");
			assert(JSON.stringify(trackScreenSpy.args[0][0]) == JSON.stringify(properties), "\n\tExpected:\t" + JSON.stringify(properties) + "\n\tActual:\t\t" + JSON.stringify(trackScreenSpy.args[0][0]));
		});
		it('should return false if tracker is not defined', function() {
			assert(false === serviceWithoutStub.trackScreen());
		});
	});
	
	describe('#trackEvent()', function(){
		it('should call GA.getTracker', function(){
			serviceWithStub.getTracker().trackEvent();
			assert(trackEventSpy.called);
		});
		it('should return false if tracker is not defined', function() {
			assert(false === serviceWithoutStub.trackEvent());
		});
	});
	
	describe('#setTrackerID()', function() {
		it('should set tracker ID', function() {
			serviceWithStub.setTrackerID('asdf');
			assert(serviceWithStub.trackerID = 'asdf');
		});
	});
	
	describe('#getTracker', function() {
		it('should return falsy if no tracker ID set', function() {
			serviceWithoutStub.setTrackerID(null);
			assert(!serviceWithoutStub.getTracker());
		});
		it("should return tracker if tracker ID set", function() {
			serviceWithStub.setTrackerID('GA-XXXXXXXX-X');
			assert.equal(fakeTracker, serviceWithStub.getTracker(), "return tracker is not the expected tracker object");
		});
	});
});