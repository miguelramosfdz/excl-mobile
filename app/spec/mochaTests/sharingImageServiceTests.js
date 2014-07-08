var sharingImageService = require('../../lib/sharing/sharingImageService');
var assert = require("assert");
var sinon = require("sinon");

describe('sharingImageService', function(){
	describe("getPostTags", function() {
		it("should return social media message", function() {

			var dataToSend = "/social_media_message/=Test Message";
			dataToSend.social_media_message = "Test message";
			var expectedData = "Test message";
			
			var returnedData = dataRetriever.getPostTags(dataToSend);
			assert.equal(returnedData, expectedData);
		});
	});
});
