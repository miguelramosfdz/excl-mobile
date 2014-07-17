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
		$.backgroundContainer.height = Ti.UI.SIZE;
		$.placeholderContainer.height = "0";
	} else {
		$.placeholderLabel.text = "There's no content specific for this age. Check above or change your filter!";
	}
}

function createPostView(post) {
	args = {
		layout : "vertical",
		height : "180dip",
		width : "95%",
		top : "5%",
		backgroundColor : "#F0F0F0"
	};
	var postContainer = viewService.createCustomView(args);

	args = {
		height : "50dip",
		width : "100%",
		backgroundColor : "#D8D8D8"
	};
	var header = viewService.createCustomView(args);

	args = {
		height : "50dip",
		width : "98%",
		backgroundColor : "#D8D8D8",
		left: "2%",
		top: "1%",
		bottom: "1%"
	};
	var headerWrap = viewService.createCustomView(args);

	args = {
		color : "#000000",
		text : post.get("name"),
		textAlign : "left",
		font : {
			fontSize : "19dip",
			fontWeight : 'bold'
		}
	};
	var headerText = labelService.createCustomLabel(args);

	args = {
		layout : "horizonal",
		backgroundColor : "#F0F0F0",
		width : "95%",
		height : "125dip",
		top : "2%",
		bottom : "10%"
	};
	var previewContainer = viewService.createCustomView(args);

	args = {
		left : "0",
		width : "39%",
		height : "120dip",
		top : "0",
		image : post.get("image"),
	};
	var postImage = viewService.createCustomImageView(args);

	args = {
		left : "40%",
		text : post.get("text"),
		font : {
			fontSize : "16dip",
			color : "#000000"
		},
		//top: 0
	};
	var postText = labelService.createCustomLabel(args);

	postContainer.add(header);
	header.add(headerWrap);
	headerWrap.add(headerText);
	postContainer.add(previewContainer);
	previewContainer.add(postImage);
	previewContainer.add(postText);

	//$.backgroundContainer.borderColor = "red";
	if (OS_IOS) {
		$.backgroundContainer.bottom = "48dip";
		//$.backgroundContainer.top= "-50%";
	}

	previewContainer.addEventListener('click', function(e) {
		var args = post;
		postController = Alloy.createController('postLanding', args);
		postController.setAnalyticsPageTitle(post.get("name"));
		postController.setAnalyticsPageLevel("Post Landing");
		Alloy.Globals.navController.open(postController);
	});

	return postContainer;
}

init();
