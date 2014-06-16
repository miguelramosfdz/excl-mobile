var dataRetriever = require('dataRetriever');
var args = arguments[0] || {};

function init() {
	var url = "http://www.mocky.io/v2/539f5f5fa7039ff6083fcb90";
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		$.someLabel.text = JSON.stringify(returnedData.data.component.posts);
		var eachComponent, eachPost, postName, postThumbnail, likingEnabled, commentingEnabled, sharingEnabled, eachPart, partType, partUrl, partThumbnail, partBody;
		// for (var i = 0; i < returnedData.data.components.length; i++) {
			eachComponent = returnedData.data.component;
			for (var j = 0; j < eachComponent.posts.length; j++) {
				eachPost = eachComponent.posts[j];
				postName = eachPost.name;
				postThumbnail = eachPost.thumbnail;
				likingEnabled = eachPost.liking;
				commentingEnabled = eachPost.commenting;
				sharingEnabled = eachPost.sharing;
				for (var k = 0; k < eachPost.parts.length; k++) {
					eachPart = eachPost.parts[k];
					partType = eachPart.type;
					Ti.API.info(partType);
				}
			}
		// }
	});

}

init();
$.postlanding.title = "Post Landing";
