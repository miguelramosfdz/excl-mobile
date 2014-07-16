var args = arguments[0] || {};
// expects:
// posts - backbone.js collection of backbone.js model of post type

$.scroller.width = Ti.UI.FILL;
$.scroller.height = Ti.UI.SIZE;

var posts = args.posts;
if (posts) {
	for (var i = 0; i < posts.size(); i++) {
		var post = posts.at(i);
		post = createPostView(post);
		$.scroller.addView(post);
		$.scroller.currentPage = i;		// Change to current page to froce android arrows to appear
	};
	$.scroller.removeView($.placeholder);
	$.scroller.currentPage = 0;			// Set current page back to the initial page
	
} else {
	$.placeholderLabel.text = "There's no content specific for this age. Check above or change your filter!";
}

function createPostView(post) {
	var image = Ti.UI.createImageView({
		height : Ti.UI.FILL,
		image : post.get('image'),
		top : "0"
	});
	var titleBar = Ti.UI.createView({
		opacity : 0.6,
		height : Ti.UI.SIZE,
		top : "0dip"
	});
	var title = Ti.UI.createLabel({
		top : 0,
		left : "10dip",
		color : 'white',
		horizontalWrap : false,
		font : {
			fontFamily : 'Arial',
			fontSize : '25dip',
			fontWeight : 'bold'
		},
		text : post.get('name')
	});
	
	titleBar.add(title);

	var view;
	if (OS_IOS) {
		view = image;
	} else if (OS_ANDROID) {
		view = Ti.UI.createView();
		view.add(image);
	}
	view.add(titleBar);

	view.addEventListener('click', function(e) {
		var args = post;
		postController = Alloy.createController('postLanding', args);
		postController.setAnalyticsPageTitle(post.get("name"));
		postController.setAnalyticsPageLevel("Post Landing");
		Alloy.Globals.navController.open(postController);
	});

	return view;
}
