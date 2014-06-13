var args = arguments[0] || {};

var win = Ti.UI.createWindow({
	title:"Finger Swipes",
	backgroundColor:"#FFF"
});

var style = $.createStyle({
    classes: 'view',
    apiName: 'View'
});


var label = Titanium.UI.createLabel({
	text:"Swipe against the window",
	width:"auto",
	height:"auto",
	bottom:"30dp",
	color:"black"
});

var view1 = Ti.UI.createView({
	backgroundColor:"Red",
	width:"50dp",
	height:"50dp",
});
view1.visible = true;
view1.applyProperties(style);

var view1Label = Ti.UI.createLabel({
	text:"View 1"
});
view1.add(view1Label);


var view2 = Ti.UI.createView({
	backgroundColor:"Blue",
	width:"50dp",
	height:"50dp",
});
view2.visible = false;
view2.applyProperties(style);

var view2Label = Ti.UI.createLabel({
	text:"View 2"
});
view2.add(view2Label);


var view3 = Ti.UI.createView({
	backgroundColor:"Green",
	width:"50dp",
	height:"50dp",
});
view3.visible = false;
view3.applyProperties(style);
var view3Label = Ti.UI.createLabel({
	text:"View 3"
});
view3.add(view3Label);

win.addEventListener("swipe", function(e){
	label.text = "You swiped me " + e.direction +  "!";
	
	if(view1.visible == true && e.direction == "right")
	{
		view1.visible = false;
		view2.visible = true;
	}
	else if(view2.visible == true && e.direction == "right")
	{
		view2.visible = false;
		view3.visible = true;
	}
		else if(view3.visible == true && e.direction == "right")
	{
		view3.visible = false;
		view1.visible = true;
	}
	else if(view1.visible == true && e.direction == "left")
	{
		view1.visible = false;
		view2.visible = true;
	}
	else if(view2.visible == true && e.direction == "left")
	{
		view2.visible = false;
		view3.visible = true;
	}
		else if(view3.visible == true && e.direction == "left")
	{
		view3.visible = false;
		view1.visible = true;
	}
});

win.add(view1);
win.add(view2);
win.add(view3);

win.add(label);

$.exhibit.add(win);


