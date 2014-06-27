function buttonService(){};
//Provides functions to deal with buttons

//Parameters id and title are optional
buttonService.prototype.createButton = function(id, title) {
	id = id || "";
	title = title || "";

	var button = Ti.UI.createButton({
		height : "40dip",
		width : "40dip",
		left : "0",
		top : "0",
		id : id,
		title : title
	});
	return button;
};

buttonService.prototype.setButtonEnabled = function(button, bol) {
	button.enabled = bol;
};

buttonService.prototype.eraseButtonTitleIfBackgroundPresent = function(button) {
	if (button.backgroundImage != "") {
		button.title = "";
	}
};

module.exports = buttonService;
