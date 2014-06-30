var post_content = arguments[0] || {};
var tableData = [];

function createPlainRowWithHeight(rowHeight) {
	var row = Ti.UI.createTableViewRow({
		height : rowHeight,
		width : '100%',
		top : '15dip',
		backgroundColor : '#FFFFFF'
	});
	return row;
}

function setPageTitle(name) {
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
	//Create anchor for instagram viewer
	var instagramAnchor = Ti.UI.createButton({
		title : '',
		opacity : 0.0
	});
	$.postlanding.add(instagramAnchor);

	var row = createPlainRowWithHeight('auto');
	if (json.text_sharing && !Alloy.Globals.navController.kioskMode) {
		var shareTextButton = sharingTextService.initiateTextShareButton(json);
		shareTextButton.left = "80%";
		row.add(shareTextButton);
	}
	if (json.image_sharing && !Alloy.Globals.navController.kioskMode) {
		var shareImageButton = sharingImageService.initiateImageShareButton(json, instagramAnchor);
		shareImageButton.left = "70%";
		row.add(shareImageButton);
	}
	if (json.commenting && !Alloy.Globals.navController.kioskMode) {
		var commentButton = Ti.UI.createButton({
			height : "40dip",
			width : "40dip",
			left : "60%",
			top : "0",
			backgroundImage : "/images/icons_android/comment.png"
		});
		commentButton.addEventListener('click', function(e) {
			Ti.API.info("Clicked!! => " + $.addNewCommentContainer.visible.toString());
			$.addNewCommentContainer.visible = ($.addNewCommentContainer.visible) ? false : true;
		});

		$.closeCommentBoxButton.addEventListener('click', function(e) {
			$.addNewCommentContainer.visible = ($.addNewCommentContainer.visible) ? false : true;
		});

		row.add(commentButton);
	}

	return row;
}

function getImageRowFromPart(part) {
	var row = createPlainRowWithHeight('200dip');

	imageView = Ti.UI.createImageView({
		image : part.get('image'),
		width : '100%',
		height : '100%'

	});

	row.add(imageView);
	return row;

}

function getVideoRowFromPart(part) {
	if (OS_ANDROID) {
		return getVideoRowFromPartAndroid(part);
	}
	if (OS_IOS) {
		return getVideoRowFromPartiOS(part);
	}
}

function getVideoRowFromPartAndroid(part) {
	var row = createPlainRowWithHeight('200dip');
	row.add(getVideoThumbnailViewFromPartAndroid(part));
	return row;
}

function getVideoThumbnailViewFromPartAndroid(part) {
	var thumbnailView = Ti.UI.createView({	});
	var thumbnailImageView = Ti.UI.createImageView({
		image : part.get('thumbnail'),
		width : '100%',
		height : '100%'
	});
	var playTriangle = Ti.UI.createImageView({
		image : "/images/icons_android/Video-Player-icon-small.png",
	});
	thumbnailView.add(thumbnailImageView);
	thumbnailView.add(playTriangle);
	//Add event listener- when thumbnail is clicked, open fullscreen video
	thumbnailView.addEventListener('click', function(e) {
		var video = Titanium.Media.createVideoPlayer({
			url : part.get('video'),
			fullscreen : true,
			autoplay : true
		});
		video.addEventListener('load', function(e) {
			Alloy.Globals.analyticsController.trackEvent("Videos", "Play", part.get('name'), 1);
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
	return thumbnailView;
}

function getVideoRowFromPartiOS(part) {
	var row = createPlainRowWithHeight('200dip');
	var video = Titanium.Media.createVideoPlayer({
		url : part.get('video'),
		fullscreen : false,
		autoplay : false,
	});
	video.addEventListener('load', function(e) {
		Alloy.Globals.analyticsController.trackEvent("Videos", "Play", part.get('name'), 1);
	});
	row.add(video);
	return row;
}

function getTextRowFromPart(part) {
	var row = createPlainRowWithHeight('auto');
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
		text : part.get('body'),
		// textAlign : 'left',
	});
	row.add(textBody);
	return row;
}

function addTableDataToTheView(tableData) {
	$.tableView.height = 'auto';
	if (OS_IOS) {
		//Accounts for bounce buffer
		$.tableView.bottom = "48dip";
	}
	$.tableView.bottom = "10dip";
	// some extra margin after comments are displayed
	$.tableView.data = tableData;
}

function creatingCommentTextHeading() {
	var row = createPlainRowWithHeight('auto');
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

function displayThereAreNoCommentsToDisplayText() {
	var row = createPlainRowWithHeight('auto');
	var commentHeading = Ti.UI.createLabel({
		top : 10,
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#48464e',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '13dp',
			fontWeight : 'normal',
		},
		text : "There are no comments for this post"
	});
	row.add(commentHeading);
	tableData.push(row);
}

function addCommentToView(commentText, commentDate) {
	var row = createPlainRowWithHeight('auto');
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

	var row = createPlainRowWithHeight('auto');
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

function displayComments(comments) {
	// display the top 2 comments first and rest of them,
	// should be hidden with the 'see more comments' text
	// once that text is clicked it should load all the comments

	var commentsLengthLimit = 2;
	var commentsLength = (comments.length > commentsLengthLimit) ? commentsLengthLimit : comments.length;
	for (var i = 0; i < commentsLength; i++) {
		addCommentToView(comments[i].body, comments[i].date);
	}

	if (comments.length > commentsLengthLimit) {
		var row = createPlainRowWithHeight('auto');
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
			tableData.pop();
			// remove the last element, which is the "show more comments" row in this case
			for (var i = commentsLengthLimit; i < comments.length; i++) {
				addCommentToView(comments[i].body, comments[i].date);
			}
			addTableDataToTheView(tableData);
		});

		tableData.push(row);

	}

	// var row = createPlainRowWithHeight('auto');
	// var text = Ti.UI.createLabel({
	// top : 10,
	// width : '94%',
	// right : '3%',
	// left : '3%',
	// color : '#005ab3',
	// font : {
	// fontFamily : 'Helvetica Neue',
	// fontSize : '13dp',
	// fontWeight : 'normal',
	// },
	// text : "Show more comments",
	// textAlign : 'center',
	// });
	// row.add(text);
	//
	// var arr = [row];
	// $.seeMoreCommentsTableView.data = arr;
	//
	// // if clicked, hide it and show the other comments
	// $.seeMoreCommentsView.addEventListener('click', function(e) {
	// Ti.API.info("The view is clicked!!");
	// $.seeMoreCommentsView.animate({
	// top : "100%",
	// curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	// duration : 300
	// });
	// // view.hide();
	// });

}

function initializePage() {
	setPageTitle(post_content.name);
	if (post_content.parts) {
		// var tableData = [];

		for (var i = 0; i < post_content.parts.length; i++) {
			var part = Alloy.createModel('part', post_content.parts[i]);
			part.set({
				'thumbnail' : post_content.image
			});
			tableData.push(getRowFromPart(part));
			if (i === 0) {
				tableData.push(displaySocialMediaButtons(post_content));
			}
		}
	}

	creatingCommentTextHeading();
	if (post_content.comments != false) {
		displayComments(post_content.comments);
	} else {
		displayThereAreNoCommentsToDisplayText();
	}
	addTableDataToTheView(tableData);
}

/*
* Run startup commands
*/
//establish connection to sharing functions
sharingTextService = Alloy.Globals.setPathForLibDirectory('sharing/sharingTextService');
var sharingTextService = new sharingTextService();

sharingImageService = Alloy.Globals.setPathForLibDirectory('sharing/sharingImageService');
var sharingImageService = new sharingImageService();

function getRowFromPart(part) {
	switch (part.get('type')) {
		case 'image':
			return getImageRowFromPart(part);
			break;
		case 'text':
			return getTextRowFromPart(part);
			break;
		case 'video':
			return getVideoRowFromPart(part);
			break;
		default:
			return null;
			break;
	}
}

initializePage();
