var args = arguments[0] || {};

var posts = Alloy.createCollection('post');
for(var i = 0; i < 5; i++) {
	posts.add({});
};

args = { posts: posts };
var scroller = Alloy.createController('postScroller', args);

$.altComponentLanding.add( scroller.getView() );
