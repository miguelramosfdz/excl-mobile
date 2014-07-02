var args = arguments[0] || {};

var posts = Alloy.createCollection('post');
for(var i = 0; i < 5; i++) {
	var post = Alloy.createModel('post');
	posts.add(post);
};

args = { posts: posts };
var scroller = Alloy.createController('postScroller', args);

$.getView().add( scroller.getView() );
