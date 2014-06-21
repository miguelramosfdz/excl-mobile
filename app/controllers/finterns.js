var args = arguments[0] || {};

var musicStatus = false;
var sound = Titanium.Media.createSound({                
            url:"/music.mp3"
        });
 
var playLabel = Ti.UI.createLabel({
	text:"Play some tunes",
	bottom:'10%',
	left:'50%',
	color:'black'
});    
   
function playMusic(){
	
	if(musicStatus == false){
		musicStatus = true;
		sound.play();
		playLabel.text = "Pause";
	}
	else{
		musicStatus = false;
		sound.pause();
		playLabel.text = "Play";
	}
}
playLabel.addEventListener('click', playMusic);	
$.finterns.add(playLabel);



