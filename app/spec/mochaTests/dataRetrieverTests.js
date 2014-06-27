var dataRetriever = require('../../lib/dataRetriever/dataRetriever');
var apiCalls = require('../../lib/customCalls/apiCalls');
var networkCalls = require('../../lib/customCalls/networkCalls');
var parseCalls = require('../../lib/customCalls/parseCalls');
var assert = require("assert");
var sinon = require("sinon");

describe('Array', function(){
	describe('#indexOf()', function(){
		it('should return -1 when the value is not present', function(){
			assert.equal(-1, [1,2,3].indexOf(5));
			assert.equal(-1, [1,2,3].indexOf(0));
		});
	});
});


describe('parsedJson', function(){
	describe("parse", function() {
		it("should return 'parsed' json data", function() {

			var dataToSend = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";
			var expectedData = "\"social-media-settings\": {\"liking\":expectedData true,\"sharing\": false,\"commenting\": true},";
			
			var stub = sinon.stub(parseCalls, "parse");
			stub.returns(expectedData);
			var returnedData = dataRetriever.parseJson(dataToSend);
			assert.equal(returnedData, expectedData);
		});
	});
});