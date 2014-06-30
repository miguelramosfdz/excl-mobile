var args = arguments[0] || {};

var post = Alloy.createModel('post');
$.posts.add(post);

$.scrollableView.dataCollection = $.posts;

// jly
