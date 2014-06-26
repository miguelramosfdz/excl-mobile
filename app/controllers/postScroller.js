var args = arguments[0] || {};

var posts = $.posts;
var post = Alloy.createModel('post', {});
posts.add(post);
console.log( JSON.stringify(posts) );
