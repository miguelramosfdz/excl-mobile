var args = arguments[0] || {};

// var URL = "https://www.youtube.com/watch?v=59jMFCMgRBQ";
//
// var video = Titanium.Media.createVideoPlayer({
//     url : URL,
//     fullscreen : false,
//     autoplay : false,
//   });
// sound = Ti.Media.createAudioPlayer({
// url: 'http://picosong.com/PY8h/'
// });

// $.post.add(video);
// sound.play();

//Define a button
var playSoundBtn = Ti.UI.createButton({
	width : 150, //define width
	height : 50, //define height
	title : 'Play Sound',
	id : 'soundBtn',
	left : '0',
	top : '400dip'
});

$.scrollViewRozay.add(playSoundBtn);

var playStatus = false;

//Onclick event of the button
playSoundBtn.addEventListener('click', function() {
	if (playStatus == false) {
		sound.play();
		playStatus = true;
		playSoundBtn.title = 'Stop Sound';
	} else {
		sound.pause();
		playStatus = false;
		playSoundBtn.title = 'Play Sound';
	}
});

//Function to play sound

//Variable that responsible to play sound
var sound = Ti.Media.createSound({
	url : '/schemin.mp3',
});

//Create hard-coded json file for use in debugging sharing objects
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

/*
 * Create sharing items that refer to sharing.js
 */
//Define objects
var sharingService = require("sharing/sharing");
var rightNavButton = Ti.UI.createButton({
	id : 'rNav',
	title : 'rNav',
	left: "80dip"
});
var labelSingle = Ti.UI.createLabel({
	text: "sharing.js",
	left: "100dip"
});
var createdTextShareButton = sharingService.createTextShareButton(json);
var createdImageShareButton = sharingService.createImageShareButton(json, rightNavButton);

//Add objects
$.sharingView.add(createdTextShareButton);
$.sharingView.add(createdImageShareButton);
$.sharingView.add(rightNavButton);
$.sharingView.add(labelSingle);


/*
 * Create sharing items that refer to sharingNonNetwork.js
 */
//Define objects
var sharingNonNetworkService = require("sharing/sharingNonNetwork");
var rightNavButtonDual = Ti.UI.createButton({
	id : 'rNavD',
	title : 'rNavD',
	left: "80dip"
});
var labelDual = Ti.UI.createLabel({
	text: "sharingNonNetwork.js",
	left: "100dip"
});
var passedTextShareButton = sharingNonNetworkService.initiateTextShareButton(json);
var passedImageShareButton = sharingNonNetworkService.initiateImageShareButton(json, rightNavButton);

//Add objects
$.sharingNetworkView.add(passedTextShareButton);
$.sharingNetworkView.add(passedImageShareButton);
$.sharingNetworkView.add(rightNavButtonDual);
$.sharingNetworkView.add(labelDual);

