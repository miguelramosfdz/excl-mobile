var dataRetriever = require('../lib/dataRetriever');
var tiCalls = require('../lib/exclCommonTiApi');

describe("Testing parsedJson", function() {
	it("should return 'parsed' json data", function() {
		// Arrange
		var dataToSend = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";
		var expectedData = "\"social-media-settings\": {\"liking\":expectedData true,\"sharing\": false,\"commenting\": true},";
		spyOn(tiCalls, 'parse').andReturn(expectedData);

		// Act
		var returnedData = dataRetriever.parseJson(dataToSend);

		// Assert
		expect(returnedData).toBe(expectedData);
	});
});

describe("Testing network", function() {
	it("should return valid http client", function() {
		// Arrange
		var url = "http://api.openweathermap.org/data/2.5/weather?q=Housotn,us&mode=json&units=imperial";
		spyOn(tiCalls, 'network').andReturn();

		// Act
		var returnedData = dataRetriever.fetchDataFromUrl(url);

		// Assert
		// expect(returnedData).not.toBeNull();
		console.log(returnedData);
	});
});
