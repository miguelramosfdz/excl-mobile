var args = arguments[0] || {};
// expects:
// posts - backbone.js collection of backbone.js model of post type

$.scroller.width = Ti.UI.FILL;
$.scroller.height = Ti.UI.SIZE;

var posts = args.posts;
if(posts) {
	for(var i = 0; i < posts.size(); i++) {
		var post = posts.at(i);
		post = createPostView(post);
		$.scroller.addView(post);
	};
	$.scroller.removeView($.placeholder);
}
else{ //View is empty; insert no content message into placeholder
	var filepath = OS_ANDROID? '/images/' : '/images/'; //Android requires starting slash
	$.placeholderImage.image = filepath + 'No_content_for_age.png';
}

function createPostView(post) {
	var args = {
		height: Ti.UI.FILL,
		image: post.get('image')
	};
	var image = Ti.UI.createImageView(args);
	
	args = {
		backgroundColor: 'black',
		opacity: 0.6,
		height: Ti.UI.SIZE,
		top: 0
	};
	var titleBar = Ti.UI.createView(args);
	
	args = {
		top: 0,
		left: "10dip",
		color: 'white',
		horizontalWrap: false,
		font: {
			fontFamily : 'Arial',
			fontSize : '25dip',
			fontWeight : 'bold'
		},
		text: post.get('name')
	};
	var title = Ti.UI.createLabel(args);
	titleBar.add(title);
	
	var view;
	if(OS_IOS) {
		view = image;
	}
	else if(OS_ANDROID) {
		view = Ti.UI.createView();
		view.add(image);
	}
	view.add(titleBar);
	
	view.addEventListener('click', function(e) {
		var args = post.get('raw');
		postController = Alloy.createController('postlanding', args);
		postController.setAnalyticsPageTitle(post.get("name"));
		postController.setAnalyticsPageLevel("Post Landing");
		Alloy.Globals.navController.open(postController);
	});
	
	return view;
}
