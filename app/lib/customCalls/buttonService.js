function buttonService(){};

buttonService.prototype.createButton = function() {
	//button to open text sharing
	var button = Ti.UI.createButton({
		height : "40dip",
		width : "40dip",
		left : "0",
		top : "0"
	});
	return button;
};

buttonService.prototype.setButtonEnabled = function(button, bol) {
	button.enabled = bol;
};

buttonService.prototype.eraseButtonTitleIfBackgroundPresent = function(button) {
	//removes the title field of a button if a background image is detected
	if (button.backgroundImage != "") {
		button.title = "";
	}
};

buttonService.prototype.createTextShareButton = function() {
	//button to open text sharing
	var shareTextButton = buttonService.prototype.createButton();
	shareTextButton.id = 'shareTextButton';
	shareTextButton.title = 'Text';
	return shareTextButton;
};

module.exports = buttonService;
