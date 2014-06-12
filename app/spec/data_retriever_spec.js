var dataRetriever = require('../lib/dataRetriever');
var tiCalls = require('../lib/exclCommonTiApi');

describe("Testing parsedJson", function() {
	it("should return 'parsed' json data", function() {
		// Arrange
		var dataToSend = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";
		var expectedData = "\"social-media-settings\": {\"liking\":expectedData true,\"sharing\": false,\"commenting\": true},";
		spyOn(tiCalls, 'heyhey').andReturn(console.log("what's cooking!"));
		// spy on ticalls.parseJson
		// spy on ticalls.heyhey
		
		// Act
		var returnedData = dataRetriever.parseJson(dataToSend);
		
		// Assert
		expect(returnedData).toBe(expectedData);
	});
});
