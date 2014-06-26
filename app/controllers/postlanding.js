var post_content = arguments[0] || {};
var tableData = [];

/*
 * Defines path to sharingNetwork file
 */
var sharingService;
function setPathForLibDirectory(retrieveNetworkSharingLib) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		sharingService = require("../../lib/" + retrieveNetworkSharingLib);
	} else {
		sharingService = require(retrieveNetworkSharingLib);
	}
}

//Google Analytics
function trackPostScreen() {
	Alloy.Globals.analyticsController.trackScreen("Post Landing");
}

trackPostScreen();

function createPlainRow(rowHeight) {
	var row = Ti.UI.createTableViewRow({
		height : rowHeight,
		width : '100%',
		top : '15dip',
		backgroundColor : '#FFFFFF'
	});
	return row;
}

function changeTitleOfThePage(name) {
	if (name === "") {
		$.postlanding.title = "[Title]";
	} else {
		$.postlanding.title = name;
	}
}

/*
 * Adds sharing buttons
 */
function displaySocialMediaButtons(json) {

	// //Create anchor for instagram viewer
	// var rightNavButton = Ti.UI.createButton({
	// title:''
	// });
	// $.postlanding.add(rightNavButton);

	var row = createPlainRow('auto');
	if (json.text_sharing && !Alloy.Globals.navController.kioskMode) {
		var shareTextButton = sharingService.initiateTextShareButton(json);
		shareTextButton.left = "80%";
		row.add(shareTextButton);
	}
	if (json.image_sharing && !Alloy.Globals.navController.kioskMode) {
		var shareImageButton = sharingService.initiateImageShareButton(json);
		shareImageButton.left = "70%";
		row.add(shareImageButton);
	}

	tableData.push(row);
}

function displayImages(imageURL) {
	var row = createPlainRow('200dip');

	imageView = Ti.UI.createImageView({
		image : imageURL,
		width : '100%',
		height : '100%'

	});

	row.add(imageView);
	tableData.push(row);

}

function displayVideo(thumbnail, videoUrl) {
	if (OS_ANDROID) {
		displayVideoAndroid(thumbnail, videoUrl);
	}
	if (OS_IOS) {
		displayVideoiOS(videoUrl);
	}
}

function displayVideoAndroid(thumbnail, videoUrl) {
	var row = createPlainRow('200dip');

	//Thumbnail for image
	thumbnailView = Ti.UI.createView({	});
	addThumbnailImage(thumbnail, thumbnailView);
	addPlayTriangle(thumbnailView);
	row.add(thumbnailView);
	tableData.push(row);

	//Add event listener- when thumbnail is clicked, open fullscreen video
	thumbnailView.addEventListener('click', function(e) {
		var video = Titanium.Media.createVideoPlayer({
			url : videoUrl,
			fullscreen : true,
			autoplay : true
		});

		doneButton = Ti.UI.createButton({
			title : "Done",
			top : "0dip",
			height : "40dip",
			left : "10dip",
		});

		doneButton.addEventListener('click', function(e) {
			video.hide();
			video.release();
			video = null;
		});
		video.add(doneButton);

	});
}

function addThumbnailImage(thumbnail, thumbnailView) {
	var thumbnailImageView = Ti.UI.createImageView({
		image : thumbnail,
		width : '100%',
		height : '100%'
	});
	thumbnailView.add(thumbnailImageView);
}

function addPlayTriangle(thumbnailView) {
	var playTriangle = Ti.UI.createImageView({
		image : "/images/icons_android/Video-Player-icon-small.png",
	});
	thumbnailView.add(playTriangle);
}

function displayVideoiOS(videoUrl) {
	var row = createPlainRow('200dip');
	var video = Titanium.Media.createVideoPlayer({
		url : videoUrl,
		fullscreen : false,
		autoplay : false,
	});
	row.add(video);
	tableData.push(row);
}

function displayText(textContent) {
	var row = createPlainRow('auto');
	var textBody = Ti.UI.createLabel({
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#232226',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '13dp',
			fontWeight : 'normal',
		},
		text : textContent,
		// textAlign : 'left',
	});
	row.add(textBody);
	tableData.push(row);
}

function addTableDataToTheView() {
	$.tableView.height = 'auto';
	if (OS_IOS) {
		//Accounts for bounce buffer
		$.tableView.bottom = "48dip";
	}
	$.tableView.data = tableData;
}

function creatingCommentTextHeading() {
	var row = createPlainRow('auto');
	var commentHeading = Ti.UI.createLabel({
		top : 20,
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#232226',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '16dp',
			fontWeight : 'bold',
		},
		text : "Comments",
		textAlign : 'center',
		borderWidth : '1',
		borderColor : '#aaa',
	});
	row.add(commentHeading);
	tableData.push(row);
}

function addCommentToView(commentText, commentDate) {
	var row = createPlainRow('auto');
	var text = Ti.UI.createLabel({
		top : 10,
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#232226',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '13dp',
			fontWeight : 'normal',
		},
		text : commentText,
		// textAlign : 'left',
	});
	row.add(text);
	tableData.push(row);

	var row = createPlainRow('auto');
	var date = Ti.UI.createLabel({
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#48464e',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '8dp',
			fontWeight : 'normal',
		},
		text : commentDate,
		// textAlign : 'left',
	});
	row.add(date);
	tableData.push(row);
}

function displayComments() {
	// display the top 2 comments first and rest of them,
	// should be hidden with the 'see more comments' text
	// once that text is clicked it should load all the comments

	var comments = [{
		"id" : "1",
		"body" : "Testing 1",
		"date" : "2014-06-26 15:47:17"
	}, {
		"id" : "2",
		"body" : "Testing 2",
		"date" : "2014-06-26 15:47:18"
	}, {
		"id" : "3",
		"body" : "Testing 3",
		"date" : "2014-06-26 15:47:19"
	}, {
		"id" : "4",
		"body" : "Testing 4",
		"date" : "2014-06-26 15:47:20"
	}];

	creatingCommentTextHeading();
	var commentsLengthLimit = 2;
	var commentsLength = (comments.length > commentsLengthLimit) ? commentsLengthLimit : comments.length;
	for (var i = 0; i < commentsLength; i++) {
		addCommentToView(comments[i].body, comments[i].date);
	}

	if (comments.length > commentsLengthLimit) {
		var row = createPlainRow('auto');
		var text = Ti.UI.createLabel({
			top : 10,
			width : '94%',
			right : '3%',
			left : '3%',
			color : '#005ab3',
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : '13dp',
				fontWeight : 'normal',
			},
			text : "Show more comments",
			textAlign : 'center',
		});
		row.add(text);

		// if clicked, hide it and show the other comments
		row.addEventListener('click', function(e) {
			// row.remove(text);
			// text.visible = false;
			tableData.pop();
			// remove the last element, which is the "show more comments" row in this case
			for (var i = 2; i < comments.length; i++) {
				addCommentToView(comments[i].body, comments[i].date);
			}
			addTableDataToTheView();
		});

		tableData.push(row);

	}

}

function initializePage() {
	changeTitleOfThePage(post_content.name);

	if (post_content.parts) {
		for (var i = 0; i < post_content.parts.length; i++) {
			Ti.API.info(post_content.parts[i].type);

			if (post_content.parts[i].type == "image") {
				displayImages(post_content.parts[i].image);
			}

			if (post_content.parts[i].type == "text") {
				displayText(post_content.parts[i].body);
			}

			if (post_content.parts[i].type == "video") {
				displayVideo(/*post_content.parts[i].image*/
				post_content.image/*thumbnail*/, post_content.parts[i].video/*video*/);
			}

			if (i === 0) {
				displaySocialMediaButtons(post_content);
			}

		}
	}

	// if(post_content.comments){
	displayComments();
	// }

	addTableDataToTheView();

}

/*
* Run startup commands
*/
//establish connection to sharing functions
setPathForLibDirectory("sharing/sharingNonNetwork");
//Place objects
initializePage();

