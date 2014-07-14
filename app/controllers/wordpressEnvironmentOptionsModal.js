var args = arguments[0] || {};
var networkCalls = setPathForLibDirectory('customCalls/networkCalls');

var onSuccess = function(){
	Alloy.Globals.navController.restart();
	alert("Entered new Wordpress environment"); 
};

var onFail = function(){
	alert("invalid url");
	Alloy.Globals.setRootWebServiceFromUrls("prod");		// Reset to default url
};


function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
}

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
	
	dialog.addEventListener('click', function(e) {
	    if (e.text || e.source.androidView.value) {
	    	if(OS_IOS){  	
				handleUrl(e.text);
	    	}else if( OS_ANDROID){
				handleUrl(e.source.androidView.value);
	    	}
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
}

function handleUrl(url){
	Alloy.Globals.setRootWebServiceUrl(url); //"http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/81"); //url);
	var client = networkCalls.network( url, onSuccess, onFail);//"http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/81", onSuccess, onFail);
	Ti.API.info("---000---\r\n"+url);
	if (client) {
		client.open("GET", url);
		client.send();
	}else{
		alert("could not connect to host");
		Alloy.Globals.setRootWebServiceFromUrls("prod");		// Reset to default url
	}
}

