var args = arguments[0] || {};

$.NavDemo.title = 'Window ' + Alloy.Globals.navController.windowStack.length;

function addClick(e){
	Alloy.Globals.navController.open(Alloy.createController('navdemo2'));
}
