var args = arguments[0] || {};

function openComponent(e){
	var componentWindow = Alloy.createController('postLanding').getView();
	componentWindow.open();  
}
