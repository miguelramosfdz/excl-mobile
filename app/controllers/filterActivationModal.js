var args = arguments[0] || {};
var allChecked;

var filters = Alloy.Collections.filter;

function createFilterView(filter, allChecked) {
	var name = filter.get('name');
	var active = filter.get('active');
	
	if (allChecked == "true"){
		active = "true";
	} else if (allChecked == "false"){
		active = "false";
	}
	
	var color = 'white';
	if (OS_IOS) {
		color = 'black';
		$.titleBar.top = '10dip';
		$.hint.color = 'white';
	}

	var args = {
		color : color,
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '22dp',
			fontWeight : 'bold'
		},
		left : '10dip',
		text : name
	};
	var label = Ti.UI.createLabel(args);

	args = {
		value : active,
		right : '10dip'
	};
	var _switch = Ti.UI.createSwitch(args);

	_switch.addEventListener('change', function(e) {
		allChecked = "";
		filter.set('active', _switch.value);
	});

	var view = Ti.UI.createView();
	view.add(label);
	view.add(_switch);

	var row = Ti.UI.createTableViewRow();
	row.add(view);

	return row;
}

function checkAll(e) {
	if (allChecked) {
		allChecked = false;
		$.toggleAll.title = "Check All";
	} else {
		allChecked = true;
		$.toggleAll.title = "Uncheck All";
	}
	$.filters.removeAllChildren();
	init();
}

function closeWindow(e) {
	$.getView().close();
}

function init() {
	for (var i = 0; i < filters.size(); i++) {
		var filter = filters.at(i);
		filter = createFilterView(filter, allChecked);
		$.filters.add(filter);
	};

}

init();
