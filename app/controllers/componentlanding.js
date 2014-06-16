var args = arguments[0] || {};

var tableView = Ti.UI.createTableView({
	// backgroundColor : '#07B5BE',
	backgroundColor : 'grey',
	data : tableData,
	width: '90%',
	left: '5%'
});

var componentHeader = Ti.UI.createLabel({
	value:"Component",
	color:"Black",
	top:'0dp'
});

var componentButton = Ti.UI.createButton({
	value:"To Post Landing Page",
	color:"Black",
	top:'100dp'
});

function openPostLanding(e){
		
	var componentWindow = Alloy.createController('postlanding').getView();
	componentWindow.open();  
}


componentButton.addEventListener('click', openPostLanding);
win.add(componentHeader);
win.add(componentButton);

$.componentlanding.add(win);
