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


function createPlainRow(rowHeight) {
	var row = Ti.UI.createTableViewRow({
		height : rowHeight,
		width : '100%',
		top : '15dip',
		backgroundColor:'#FFFFFF'
	});
	return row;
}

function changeTitleOfThePage(name) {
	if (name = "") {
		$.postlanding.title = "[Title]";
	} else {
		$.postlanding.title = name;
	}
}

/*
 * Adds sharing buttons
 */
function displaySocialMediaButtons(json) {

	var row = createPlainRow('auto');
	if (json.text_sharing && Alloy.Globals.navController.kioskMode == false) {
		var shareTextButton = sharingService.initiateTextShareButton(json);
		shareTextButton.left = "80%";
		row.add(shareTextButton);
	}
	if (json.image_sharing && Alloy.Globals.navController.kioskMode == false) {
		var shareImageButton = sharingService.initiateImageShareButton(json);
		shareTextButton.left = "70%";
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

function displayVideo(videoUrl) {
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
	$.tableView.data = tableData;
}

function initializePage() {
	changeTitleOfThePage(post_content.name);
	if(post_content.parts){
	for (var i = 0; i < post_content.parts.length; i++) {
		Ti.API.info(post_content.parts[i].type);

		if (post_content.parts[i].type == "image") {
			displayImages(post_content.parts[i].image);
		}

		if (post_content.parts[i].type == "text") {
			displayText(post_content.parts[i].body);
		}
		
		if(post_content.parts[i].type == "video"){
			displayVideo(post_content.parts[i].video);
		}

		if (i == 0) {
			displaySocialMediaButtons(post_content);
		}

	}
	addTableDataToTheView();
	}
}

/*
 * Run startup commands
 */
//establish connection to sharing functions
setPathForLibDirectory("sharing/sharingNonNetwork");
//Place objects
initializePage();

