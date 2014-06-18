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

describe("Testing post tags", function() {
	it("should return a non-empty string", function() {
		// Arrange
		var tagsReceived = false;
		//retrieve from file for real implementation
		var postId = 41;
		var jsonURL = "http://excl.dreamhosters.com/dev/wp-json/v01/excl/component/23";
		spyOn(networkCalls, 'network').andReturn({
			open : function() {
				openFunctionCalled = true;
			},
			send : function() {
				sendFunctionCalled = true;
			},
		});

		// Act
		sharingValidator.retrieveTextPostTags(postId, jsonURL);

		// Assert
		expect(tagsReceived).toBe(true);

	});
});
