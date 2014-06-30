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

vieWService.prototype.createTableRow = function (heightAsPercent){
	height = height || "50";
	var row = Ti.UI.createTableViewRow({
		height: height + "%"
	});
	return row;
};


modules.export = viewService;