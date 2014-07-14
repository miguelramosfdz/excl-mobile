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

function enterOtherMode(self) {
		
	var textfield = Ti.UI.createTextField({
		passwordMask:true,
	    height:"35dip",
	    top:"100dip",
	    left:"30dip",
	    width:"250dip",
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	var dialog = Ti.UI.createAlertDialog({
	    title: 'Enter wordpress url',
	    androidView: textfield,
	    buttonNames: ['OK']
	});
	
	if (OS_IOS) {
		dialog.style = Ti.UI.iPhone.AlertDialogStyle.SECURE_TEXT_INPUT;
	}
	
	dialog.addEventListener('click', function(e) {
	    if (e.text != "") {  	
			Alloy.Globals.setRootWebServiceUrl(e.text);
			Alloy.Globals.navController.restart();
			alert("Entered Wordpress Environment: "+e.text);  	
	    }
    	else {
	    	var errorMsg = Ti.UI.createAlertDialog({
			    title: 'no url entered',
			    buttonNames: ['OK']
			});
			errorMsg.show();
			setTimeout(function(){errorMsg.hide();}, 5000);
	    }
	});
	dialog.show();
	setTimeout(function(){dialog.hide();}, 9000);
}