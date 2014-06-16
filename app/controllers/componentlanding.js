var args = arguments[0] || {};

var backButton = Ti.UI.createButton({
	width:'100dp',
	height:'50dp',
	right:'0dp',
	top:'0dp',
	title:"Back"
});

backButton.addEventListener('click', function(e)
{
	$.exhibits.open();
});

$.componentlanding.add(backButton);
