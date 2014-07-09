var sharingTextService = require('../../lib/sharing/sharingTextService');
var sharingTextService = new sharingTextService();
var buttonService = require('../../lib/customCalls/buttonService');
var iconService = require('../../lib/customCalls/iconService');
var intentService = require('../../lib/customCalls/intentService');
var assert = require("assert");
var sinon = require("sinon");

describe('sharingTextService', function(){
	
	describe("getPostTags", function() {
		it("should return social media message from json", function() {
			var dataToSend = [];
			dataToSend.social_media_message = 'Test social media message';
			var expectedData = 'Test social media message';
			
			var returnedData = sharingTextService.getPostTags(dataToSend);
			assert.equal(returnedData, expectedData);
		});
	});
	
	describe("setPathForLibDirectory", function(){
		it("should properly set the path for a desired library file and return the correct library", function(){
			var dataToSend = "customCalls/apiCalls";
			var expectedData = require("../../lib/customCalls/apiCalls");
			
			var returnedData = sharingTextService.setPathForLibDirectory(dataToSend);
			assert.equal(returnedData, expectedData);
		});
	});
});

