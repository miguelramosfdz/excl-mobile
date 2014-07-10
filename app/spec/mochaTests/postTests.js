var assert = require("assert");
//var Alloy = require("../../../plugins/ti.alloy/hooks/alloy");
require('ti-mocha');

describe('post model', function(){
	var post;
	
	before(function(){
		post = Alloy.createModel("../../models/post");
		//post = new Post();
	});
	
	describe('post.getAllComments()', function() {
		it("should say true = true", function(){
			assert(true);
		});
	});
});

//mocha.run();
