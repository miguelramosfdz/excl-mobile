var args = arguments[0] || {};

var postView = Ti.UI.createView(
	
);

var postLabel = Ti.UI.createLabel({
	text:'Welcome to the post landing page',
	color:'black'
});

postView.add(postLabel);

$.postlanding.title="Post Landing";
$.postlanding.add(postView);

