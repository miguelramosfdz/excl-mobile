var args = arguments[0] || {};

function onClick(e){
	var exhibitsWindow = Alloy.createController('exhibits').getView();
	Alloy.Globals.navController.open(exhibitsWindow);  
}
