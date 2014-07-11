var args = arguments[0] || {};

function cancel(e){
	Alloy.Globals.navController.close();
}

function enterProductionMode(e){
	Alloy.Globals.setRootWebServiceFromUrls("prod");
	Alloy.Globals.navController.restart();
	alert("Entered Production Wordpress Environment");
}

function enterDevelopmentMode(e){
	Alloy.Globals.setRootWebServiceFromUrls("dev");
	Alloy.Globals.navController.restart();
	alert("Entered Production Wordpress Environment");
}

function enterDevelopmentTwoMode(e){
	Alloy.Globals.setRootWebServiceFromUrls("devTwo");
	Alloy.Globals.navController.restart();
	alert("Entered Production Wordpress Environment");
}

function enterQualityAssuranceMode(e){
	Alloy.Globals.setRootWebServiceFromUrls("qa");
	Alloy.Globals.navController.restart();
	alert("Entered Production Wordpress Environment");
}