var args = arguments[0] || {};

$.NavDemo.title = 'Window ' + Alloy.Globals.navController.windowStack.length;
	
function addClick(e){
	var view = Alloy.createController('navdemo').getView();
	view.reload = loadPage;
	view.reload(view);
	Alloy.Globals.navController.open(view);
}

function homeClick(e) {
	Alloy.Globals.navController.home();
}

function loadPage(view) {  
	view.removeAllChildren();
	var newWindowButton = Titanium.UI.createButton({
	   title: 'New',
	   id: 'home',
	   top: 10,
	   width: 100,
	   height: 50
	});
	newWindowButton.addEventListener('click', addClick);
	view.add(newWindowButton);
	var homeButton = Titanium.UI.createButton({
	   title: 'Home',
	   id: 'add',
	   top: 10,
	   width: 100,
	   height: 50
	});
	homeButton.addEventListener('click', homeClick);
	view.add(homeButton);
	Alloy.Globals.navController.addKioskModeListener(homeButton);
	if (!Alloy.Globals.navController.kioskMode){
		var openMenuShare = Ti.UI.createButton({
			id : 'openMenuShare',
			Title : "Share",
			backgroundImage : "http://i.stack.imgur.com/P1ELC.png",
			font : {
				fontSize : 30,
			},
			//backgroundColor: "#00FFFF"
			color: "#000000"
		});
		view.add(openMenuShare);
	}
}


// Alloy.Globals.navController.open(Alloy.createController('navdemo').getView());
