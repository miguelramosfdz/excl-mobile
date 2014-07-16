var args = arguments[0] || {};



function openExhibits() {
	var controller = Alloy.createController("exhibitLanding");
	Alloy.Globals.navController.open(controller);	
}

function openMap() {
	var controller = Alloy.createController("map");
	Alloy.Globals.navController.open(controller);	
}

function openInfo() {
	var controller = Alloy.createController("info");
	Alloy.Globals.navController.open(controller);	
}


Alloy.Globals.navController.open(this);
