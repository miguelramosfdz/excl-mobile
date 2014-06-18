var dataRetriever = require('dataRetriever');
var sharingService = require("sharing/sharing");
var args = arguments[0] || {};
var tableData = [];

function createPlainRow() {
	var row = Ti.UI.createTableViewRow({
		// height: (Ti.Platform.displayCaps.platformHeight / 8),
		height : 'auto',
		// top : '10dp',
		backgroundColor : '#FFFFFF',
	});
	return row;
}

function changeTitleOfThePage(name) {
	$.postlanding.title = name;
}

function displaySocialMediaButtons(json) {
	
	var row = createPlainRow();
	if (json.liking) {
		// display liking button
		var image = Ti.UI.createImageView({
			image : '/icons/like_button.png',
			color : 'white',
			left : '10%'
		});
		row.add(image);
	}
	if (json.text_sharing) {
		// display shareText button
		alert("shareTextButton will display");
		var shareTextButton = sharingService.createTextShareButton(json);
		row.add(shareTextButton);
	}
	if (json.image_sharing){
		//display shareImage button
		alert("shareImageButton will display");
		var shareImageButton = sharingService.createImageShareButton(json);
		row.add(shareImageButton);
	}
	if (json.commenting) {
		// display comment button
		var image = Ti.UI.createImageView({
			image : '/icons/comment_button.png',
			color : 'white',
			left : '80%'
		});
		row.add(image);
	}

	tableData.push(row);
}

function jackOfAllTrades() {
	var url = "http://www.mocky.io/v2/53a1f69eb4ac144807024b81"; //Jen
	//var url = "http://www.mocky.io/v2/53a0c3b0e100e89e0b3e40ac"; //Muhammad
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		changeTitleOfThePage(returnedData.name);
		displaySocialMediaButtons(returnedData);

		allParts = returnedData.parts;
		for (var i = 0; i < allParts.length; i++) {
			var row = createPlainRow();
			var partToPush;
			if (allParts[i].type == "image") {
				partToPush = Ti.UI.createImageView({
					image : 'http://placehold.it/700x300/556270',
				});
			} else if (allParts[i].type == "text") {
				partToPush = Ti.UI.createLabel({
					color : '#515151',
					font : {
						fontFamily : 'Arial',
						fontSize : 22,
						fontWeight : 'bold'
					},
					text : allParts[i].body,
					textAlign : 'center',
				});
			}
			row.add(partToPush);
			tableData.push(row);
		}

		var tableView = Ti.UI.createTableView({
			backgroundColor : '#00B4FF',
			data : tableData
		});

		$.postlanding.add(tableView);
	});
}

Ti.API.info(args);
jackOfAllTrades();
