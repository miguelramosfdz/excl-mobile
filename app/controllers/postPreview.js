var args = arguments[0] || {};
var postArgs = args.posts;
var viewService = setPathForLibDirectory("customCalls/viewService");
viewService = new viewService();
var labelService = setPathForLibDirectory("customCalls/labelService");
labelService = new labelService();

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function init() {
	if (postArgs) {
		for (var i = 0; i < postArgs.length; i++) {
			post = createPostView(eval(postArgs.at(i)));
			$.backgroundContainer.add(post);
		};
		$.placeholderContainer.height = "0";
	} else {
		$.placeholderLabel.text = "There's no content specific for this age. Check above or change your filter!";
	}
}

function createPostView(post) {
	args = {
		layout : "vertical",
		borderWidth : "4",
		borderRadius : "4",
		height : "70%",
		width : "95%",
		top : "5%"
	};
	var postContainer = viewService.createCustomView(args);

	args = {
		height : "50dip",
		width : "100%",
		backgroundColor : "#D8D8D8"
	};
	var header = viewService.createCustomView(args);

	args = {
		color : "black",
		text : post.get("name"),
		textAlign : "center",
		font : {
			fontSize : "20dip",
			fontWeight : 'bold'
		}
	};
	var headerText = labelService.createCustomLabel(args);

	args = {
		layout : "horizonal"
	};
	var previewContainer = viewService.createCustomView(args);

	args = {
		left : "0",
		width : "39%",
		image : post.get("image")
	};
	var postImage = viewService.createCustomImageView(args);

	args = {
		left : "40%",
		text : post.get("text"),
		font : {
			fontSize : "16dip",
		}
	};
	var postText = labelService.createCustomLabel(args);

	postContainer.add(header);
	header.add(headerText);
	postContainer.add(previewContainer);
	previewContainer.add(postImage);
	previewContainer.add(postText);

	previewContainer.addEventListener('click', function(e) {
		var args = post;

		Ti.API.info("name: " + post.get("name"));

		postController = Alloy.createController('postLanding', args);
		postController.setAnalyticsPageTitle(post.get("name"));
		postController.setAnalyticsPageLevel("Post Landing");
		Alloy.Globals.navController.open(postController);
	});

	return postContainer;
}

init();
