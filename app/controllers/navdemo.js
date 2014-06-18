var args = arguments[0] || {};

function addClick(e){
	var controller = Alloy.createController('navdemo2');
	Alloy.Globals.navController.open(controller.getView(), controller);
}
