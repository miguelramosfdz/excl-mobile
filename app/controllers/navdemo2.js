var args = arguments[0] || {};

// Here we define the callback function for what actions to take on entering and 
// exiting kiosk mode. This is optional.
$.onEnterKioskMode = function(view) {  
	var x;
	for (x in view.children) {
		Ti.API.log(JSON.stringify(view.children[x]));
		if (view.children[x].myClass == "noKiosk") {
			Ti.API.log("Removing: "+JSON.stringify(view.children[x]));
			view.children[x].visible = false;
		}
	}
};
$.onExitKioskMode = function(view) {  
	var x;
	for (x in view.children) {
		Ti.API.log(JSON.stringify(view.children[x]));
		if (view.children[x].myClass == "noKiosk") {
			Ti.API.log("Removing: "+JSON.stringify(view.children[x]));
			view.children[x].visible = true;
			// view.remove(x);
		}
	}
};

// Here we are adding a kiosk mode listener (three long clicks, for example) to the 'home' button on the page.
Alloy.Globals.navController.addKioskModeListener($.home);

// This is just setting a helpful window title for the demo.
$.NavDemo2.title = 'Window ' + Alloy.Globals.navController.windowStack.length;

// This is opening a new window
function addClick(e){
	Alloy.Globals.navController.open(Alloy.createController('navdemo2'));
}

// This is activating the home functionality
function homeClick(e) {
	Alloy.Globals.navController.home();
}

// All the following is just initializing the demo page
if (!Alloy.Globals.navController.kioskMode) {
	$.openMenuShare.visible = true;
} else {
	$.openMenuShare.visible = false;
}	
