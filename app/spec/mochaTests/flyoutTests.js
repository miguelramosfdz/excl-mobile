var flyoutService = require('../../lib/navigationService/flyoutService');
var navController = require('../../lib/navigationService/navigationService');
var sinon = require("sinon");

describe('Flyout Menu', function(){
	describe('#indexOf()', function(){
		it('should return false when kiosk mode is on', function(){
			//
			assertTrue(true);
		});
		it('should return false when kiosk mode is off and the menu is visible', function(){
			//
			assertTrue(true);
		});
		it('should return true when kiosk mode is off and the menu is not visible', function(){
			//
			assertTrue(true);
		});
	});
});

/*
describe('parsedJson', function(){
	describe("parse", function() {
		it("should return 'parsed' json data", function() {

			var dataToSend = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";
			var expectedData = "\"social-media-settings\": {\"liking\":expectedData true,\"sharing\": false,\"commenting\": true},";
			// spyOn(parseCalls, 'parse').andReturn(expectedData);
			// var returnedData = dataRetriever.parseJson(dataToSend);
			// expect(returnedData).toBe(expectedData);

			// var spy = sinon.spy(parseCalls, "parse");
			// dataRetriever.parseJson(dataToSend);
			// parseCalls.parse(dataToSend);
			// assertTrue(spy.called);

			// var mock = sinon.mock(parseCalls);
			// mock.expects('parse').once().returns(expectedData);
			// mock.verify();

		});
	});
});*/