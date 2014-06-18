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
	var json = {
		id : 41,
		name : "Spin the Disc",
		section : "What do I do?",
		parts : [{
			id : 52,
			name : "Test Part",
			type : "image",
			url : "http://testpart.com",
			thumbnail : false,
			body : ""
		}, {
			id : 42,
			name : "Spin the Disc Video",
			type : "text",
			url : "",
			thumbnail : false,
			body : "Try spinning the disc!! It is so much fun!!!"
		}],
		thumbnail : "http://placehold.it/700x300/000",
		liking : true,
		text_sharing : false,
		image_sharing : false,
		commenting : false,
		social_media_message : "#SpunTheDisc and it was great! #cmh",
		like_count : false,
		comments : [{
			id : "2",
			body : "This is a comment on the spinning disc post",
			date : "2014-06-16 16:20:13"
		}]
	}; 
	
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
		shareTextButton = sharingService.createShareTextButton(json);
		row.add(shareTextButton);
	}
	if (json.image_sharing){
		//display shareImage button
		shareImageButton = sharingService.createShareImageButton(json);
		row.add(shareTextButton);
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
	var url = "http://www.mocky.io/v2/5185415ba171ea3a00704eed"; //Jen
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
