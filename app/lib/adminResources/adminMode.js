var rootPath = (typeof Titanium == 'undefined')? '../../lib/' : '';

function AdminMode() {
	var kiosk = require(rootPath +'adminResources/kioskMode');
	this.kioskMode = new kiosk();
}

AdminMode.prototype.isInKioskMode = function(){
	return this.kioskMode.isInKioskMode();
};

AdminMode.prototype.addAdminModeListener = function(element) {
	var count = 0;
	var self = this;
	var handleAdminModeEntry = function(e){
		count += 100;
		if (count === 100) {
			setTimeout(function(){count = 0;}, 3000);
		} else if (count === 300) {
			handleAdminModeDialog(self);
		}
	};
	if (OS_IOS) {
		element.addEventListener('longpress', handleAdminModeEntry);
	} else if (OS_ANDROID) {
		element.addEventListener('longclick', handleAdminModeEntry);	
	}
};

function handleAdminModeDialog(self) {
		
	var textfield = Ti.UI.createTextField({
		passwordMask:true,
	    height:"35dip",
	    top:"100dip",
	    left:"30dip",
	    width:"250dip",
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	var dialog = Ti.UI.createAlertDialog({
	    title: 'Enter admin code',
	    androidView: textfield,
	    buttonNames: ['OK']
	});
	
	if (OS_IOS) {
		dialog.style = Ti.UI.iPhone.AlertDialogStyle.SECURE_TEXT_INPUT;
	}
	
	dialog.addEventListener('click', function(e) {
	    if (e.text == "friend" || e.source.androidView.value == "friend") {
			self.kioskMode.updateKioskMode();
	    } 
	    else if (e.text == "finterns" || e.source.androidView.value == "finterns") { 
			Alloy.Globals.navController.open(Alloy.createController('finterns'));
    	} 
    	else if (e.text == "wordpress" || e.source.androidView.value == "wordpress") {
    		var options = Alloy.createController("wordpressEnvironmentOptionsModal");
    		self.kioskMode.exitKioskMode();
    		Alloy.Globals.navController.closeMenuWithoutAnimation();
    		Alloy.Globals.navController.open(options);
    	}
    	else {
	    	var errorMsg = Ti.UI.createAlertDialog({
			    title: 'incorrect code',
			    buttonNames: ['OK']
			});
			errorMsg.show();
			setTimeout(function(){errorMsg.hide();}, 5000);
	    }
	});
	dialog.show();
	setTimeout(function(){dialog.hide();}, 9000);
}

module.exports = AdminMode;