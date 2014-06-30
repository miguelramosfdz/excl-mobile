function viewService(){};

viewService.prototype.createModalInputView = function() {
	var modal = Ti.UI.createView({
		modal: true,
		top: "10%",
		width: "80%",
		borderRadius:"10dip",
		backgroundColor: "#000000"
	});
	return modal;
};

viewService.prototype.createTableView = function() {
	var table = Ti.UI.createTableView({});
	return table;
};

viewService.prototype.createTableRow = function (heightAsPercent){
	heightAsPercent = heightAsPercent || "50";
	var row = Ti.UI.createTableViewRow({
		height: heightAsPercent + "%"
	});
	return row;
};


module.exports = viewService;