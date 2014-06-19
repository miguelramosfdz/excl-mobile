var sharingService = require("sharing/sharing");
var post_content = arguments[0] || {};
var tableData = [];

function createPlainRow(rowHeight) {
	var row = Ti.UI.createTableViewRow({
		height : rowHeight,
		width : '100%',
		top : '15dp',
	});
	return row;
}

function changeTitleOfThePage(name) {
	$.postlanding.title = name;
}

function displaySocialMediaButtons(json) {

	var row = createPlainRow('auto');
	if (json.text_sharing) {
		var shareTextButton = sharingService.createTextShareButton(json);
		row.add(shareTextButton);
	}
	if (json.image_sharing) {
		var shareImageButton = sharingService.createImageShareButton(json);
		row.add(shareImageButton);
	}

	tableData.push(row);
}

function displayImages(imageURL) {
	var row = createPlainRow('200dp');

	imageView = Ti.UI.createImageView({
		image : imageURL,
		width : '100%',
		height : '100%'

	});

	row.add(imageView);
	tableData.push(row);

}

function displayVideo(videoUrl) {
	var row = createPlainRow('200dp');
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
		width : '100%',
		right : '3%',
		left : '3%',
		color : '#000000',
		font : {
			fontFamily : 'Arial',
			fontSize : 18,
			fontWeight : 'normal',
		},
		text : textContent,
		// textAlign : 'left',
	});
	row.add(textBody);
	tableData.push(row);
}

function addTableDataToTheView() {
	var tableView = Ti.UI.createTableView({
		backgroundColor : '#e6e6e6',
		data : tableData
	});

	$.postlanding.add(tableView);
}

function jackOfAllTrades() {
	changeTitleOfThePage(post_content.name);
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

jackOfAllTrades();
