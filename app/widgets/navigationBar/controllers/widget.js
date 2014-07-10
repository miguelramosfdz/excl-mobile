function back(e){
	Alloy.Globals.navController.close();
}

function menu(e){
	Alloy.Globals.navController.toggleMenu(true);	
}


Alloy.Globals.adminMode.addAdminModeListener($.flyoutBtn);

exports.hideBackBtn = function() {
	$.backBtn.visible = false;
};

exports.setPageTitle = function(title){
	$.pageTitle.text = title;	
};