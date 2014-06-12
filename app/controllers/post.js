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
	left : '115dp',
	top : '380dp'
});

$.post.add(playSoundBtn);

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
