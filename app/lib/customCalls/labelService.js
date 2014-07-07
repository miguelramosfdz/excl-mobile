function labelService(){};

labelService.prototype.createLabel = function(text) {
	var label = Ti.UI.createLabel({
		text: text
	});
	return label;
};


module.exports = labelService;