var args = arguments[0] || {};
// expects:
// posts - backbone.js collection of backbone.js model of post type

var posts = args.posts;
if(posts) {
	for(var i = 0; i < posts.size(); i++) {
		var post = posts.at(i);
		post = createPostPage(post);
		$.scroller.add(post);
	};
	
	$.scroller.removeView($.placeholder);
};

function createPostPage(post) {
	var page = Ti.UI.createView();
	
	var args = {
		image: post.get('image')
	};
	var image = Ti.UI.createImageView(args);
	page.add(image);
	
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
	page.add(titleBar);
	
	return page;
}
