var dataRetriever = require('../lib/dataRetriever');
var apiCalls = require('../lib/customCalls/apiCalls');
var networkCalls = require('../lib/customCalls/networkCalls');
var parseCalls = require('../lib/customCalls/parseCalls');
var sharingValidator = require('../lib/sharing/sharing');

describe("Testing parsedJson", function() {
	it("should return 'parsed' json data", function() {
		// Arrange
		var dataToSend = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";
		var expectedData = "\"social-media-settings\": {\"liking\":expectedData true,\"sharing\": false,\"commenting\": true},";
		spyOn(parseCalls, 'parse').andReturn(expectedData);

		// Act
		var returnedData = dataRetriever.parseJson(dataToSend);

		// Assert
		expect(returnedData).toBe(expectedData);
	});
});

describe("Testing network", function() {
	it("should return valid http client", function() {
		// Arrange
		var url = "http://api.openweathermap.org/data/2.5/weather?q=Houston,us&mode=json&units=imperial";
		var openFunctionCalled, sendFunctionCalled = false;
		spyOn(networkCalls, 'network').andReturn({
			open : function() {
				openFunctionCalled = true;
			},
			send : function() {
				sendFunctionCalled = true;
			},
		});

		// Act
		dataRetriever.fetchDataFromUrl(url);

		// Assert
		expect(openFunctionCalled).toBe(true);
		expect(sendFunctionCalled).toBe(true);

	});
});
/*
 * Unit testing for sharing
 * --button creation x 2
 * --photo saved
 * --icon images present
 */
describe("Testing share text button creation", function(){
	it("should create a share button for text", function() {
		//Arrange
		var detectedButton = false;
		var fakeCreation = sharingValidator.createTextShareButton(json);
		var json = "#OMG I JUST WENT PEE!";
		//need to retrieve var json
		//sharingValidator.createTextShareButton(json) = jasmine.createSpy("Button creation spy")
		
		//Act
		sharingValidator.createTextShareButton(json);
		
		//Asert
		expect(someResult).tobe("Some value");
	});
});
