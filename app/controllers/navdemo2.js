var args = arguments[0] || {};

// $.NavDemo2.title = 'Window ' + Alloy.Globals.navController.windowStack.length;
Alloy.Globals.navController.addKioskModeListener($.home);
$.updateForKioskMode = updatePage;
	
function addClick(e){
	Alloy.Globals.navController.open(Alloy.createController('navdemo2'));
}

function homeClick(e) {
	Alloy.Globals.navController.home();
}

function updatePage(view) {  
	var x;
	if (!Alloy.Globals.navController.kioskMode) {
		for (x in view.children) {
			Ti.API.log(JSON.stringify(view.children[x]));
			if (view.children[x].myClass == "noKiosk") {
				Ti.API.log("Removing: "+JSON.stringify(view.children[x]));
				view.children[x].visible = true;
			}
		}
	} else {
		for (x in view.children) {
			Ti.API.log(JSON.stringify(view.children[x]));
			if (view.children[x].myClass == "noKiosk") {
				Ti.API.log("Removing: "+JSON.stringify(view.children[x]));
				view.children[x].visible = false;
				// view.remove(x);
			}
		}
	}
}
