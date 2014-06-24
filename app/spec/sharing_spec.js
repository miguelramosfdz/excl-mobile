var dataRetriever = require('../lib/dataRetriever/dataRetriever');
var apiCalls = require('../lib/customCalls/apiCalls');
var networkCalls = require('../lib/customCalls/networkCalls');
var parseCalls = require('../lib/customCalls/parseCalls');
var sharingValidator = require('../lib/sharing/sharing');

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
