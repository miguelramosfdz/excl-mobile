var args = arguments[0] || {};

var filters = Alloy.Collections.filter;
for(var i = 0; i < filters.size(); i++)
{
	var filter = filters.at(i);
	var row = Ti.UI.createTableViewRow();
	filter = createFilterView(filter);
	row.add(filter);
	$.table.add(row);
};

function createFilterView(filter) {
	var name = filter.get('name');
	var active = filter.get('active');
	
	var color = 'white';
	if(OS_IOS) {
		color = 'black';
		$.hint.color = 'white';
	}
	
	var args = {
		color : color,
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '22dp',
			fontWeight : 'bold'
		},
		left: '10dip',
		text: name
	};
	var label = Ti.UI.createLabel(args);
	
	args = {
		value: active,
		right: '10dip'
	};
	var _switch = Ti.UI.createSwitch(args);
	
	_switch.addEventListener('change', function(e) {
		filter.set('active', _switch.value);
	});
	
	var view = Ti.UI.createView();
	view.add(label);
	view.add(_switch);
	
	return view;
}

function closeWindow(e) {
	$.getView().close();
}
