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
};

function createPostView(post) {
	var args = {
		width: Ti.UI.FILL,
		image: post.get('image')
	};
	var image = Ti.UI.createImageView(args);
	
	args = {
		backgroundColor: 'black',
		opacity: 0.5,
		height: '20%',
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
	image.add(titleBar);
	
	image.addEventListener('click', function(e) {
		var args = post.get('raw');
		post = Alloy.createController('postlanding', args);
		Alloy.Globals.navController.open(post);
	});
	
	return image;
}
