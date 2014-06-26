var post_content = arguments[0] || {};

/*
 * Defines path to sharingNetwork file
 */

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
}

//Google Analytics 
function trackPostScreen(){
	Alloy.Globals.analyticsController.trackScreen("Post Landing");
}
trackPostScreen();

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
	// //Create anchor for instagram viewer
	// var rightNavButton = Ti.UI.createButton({
		// title:''
	// });
	// $.postlanding.add(rightNavButton);
	var row = createPlainRowWithHeight('auto');
	if (json.text_sharing && !Alloy.Globals.navController.kioskMode) {
		var shareTextButton = sharingTextService.initiateTextShareButton(json);
		shareTextButton.left = "80%";
		row.add(shareTextButton);
	}
	/* Reenable once sharingImageService is up and running
	if (json.image_sharing && !Alloy.Globals.navController.kioskMode) {
		var shareImageButton = sharingNonNetworkService.initiateImageShareButton(json);
		shareImageButton.left = "70%";
		row.add(shareImageButton);
	}
	*/

	return row;
}

function getImageRowFromPart(imageURL) {
	var row = createPlainRowWithHeight('200dip');

	imageView = Ti.UI.createImageView({
		image : imageURL,
		width : '100%',
		height : '100%'

	});

	row.add(imageView);
	return row;

}

function getVideoRowFromPart(part) {
	if (OS_ANDROID){
		return getVideoRowFromPartAndroid(part);
	}
	if (OS_IOS){
		return getVideoRowFromPartiOS(part);
	}
}

function getVideoRowFromPartAndroid(part){
	var row = createPlainRowWithHeight('200dip');
	row.add(getVideoThumbnailViewFromPartAndroid(part));
	return row;
}

function getVideoThumbnailViewFromPartAndroid(part){
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
	thumbnailView.addEventListener('click', function(e){
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
		
		doneButton.addEventListener('click', function(e){
			video.hide();
	        video.release();
	        video = null;
		});
		video.add(doneButton);
		
	});
	return thumbnailView;
}

function getVideoRowFromPartiOS(part){
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
	if (OS_IOS){
		//Accounts for bounce buffer
		$.tableView.bottom = "48dip";
	}
	$.tableView.data = tableData;
}

function initializePage() {
	setPageTitle(post_content.name);
	if (post_content.parts) {
		var tableData = [];
		
		for (var i = 0; i < post_content.parts.length; i++) {
			var part = Alloy.createModel('part', post_content.parts[i]);
			part.set({'thumbnail': post_content.image});
			tableData.push(getRowFromPart(part));
			if (i === 0) {
				tableData.push(displaySocialMediaButtons(post_content));
			}
		}
		addTableDataToTheView(tableData);
	}
}

/*
* Run startup commands
*/
//establish connection to sharing functions
sharingTextService = setPathForLibDirectory('sharing/sharingTextService');
var sharingTextService = new sharingTextService();

sharingImageService = setPathForLibDirectory('sharing/sharingImageService');
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

