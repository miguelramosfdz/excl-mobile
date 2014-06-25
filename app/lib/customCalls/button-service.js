function createButton() {
	//button to open text sharing
	var button = Ti.UI.createButton({
		height : "40dip",
		width : "40dip",
		left : "0",
		top : "0"
	});
	return button;
}

module.exports = buttonService;