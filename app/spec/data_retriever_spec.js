var dataRetriever = require('../lib/dataRetriever');

describe("Testing parsedJson", function() {
	it("should return 'parsed' json data", function() {
		var dataToSend = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";
		var expectedData = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";

		spyOn(dataRetriever, 'parseJson').andReturn(expectedData);
		var returnedData = dataRetriever.parseJson(dataToSend);
		expect(returnedData).toBe(expectedData);
	});
});
