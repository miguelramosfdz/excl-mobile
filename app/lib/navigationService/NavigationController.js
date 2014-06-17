// Note: This version works for Android and iOS for Titanium 3.2.0. 
// Most of the changes to make it compatible with Ti 3.2.0 were:
// this.navGroup.close(someWindow) changed to this.navGroup.closeWindow(someWindow)
// most of the time
// this.navGroup.open(someWindow) changed to this.navGroup.openWindow(someWindow)
// most of the time

function NavigationController() {
	this.windowStack = [];
	this.kioskMode = false;
	this.homePage;
	this.lockedHomePage;
};

NavigationController.prototype.open = function(windowToOpen, onEnterKioskMode, onExitKioskMode) {
	
	if (onEnterKioskMode && typeof(onEnterKioskMode) === 'function') {
		windowToOpen.onEnterKioskMode = onEnterKioskMode;
	} else {
		windowToOpen.onEnterKioskMode = function(view){};
	}
	if (onExitKioskMode && typeof(onExitKioskMode) === 'function') {
		windowToOpen.onExitKioskMode = onExitKioskMode;
	} else {
		windowToOpen.onExitKioskMode = function(view){};
	}
	
	// Capture Android back button
	if (OS_ANDROID) {
		var self = this;
		windowToOpen.addEventListener("android:back", function(e){
			if(self.windowStack[self.windowStack.length-1] != self.lockedHomePage) {
				self.close();
			}
		});	
	}
	
	//add the window to the stack of windows managed by the controller
	this.windowStack.push(windowToOpen);

	//grab a copy of the current nav controller for use in the callback
	var self = this;
	
	var lastPushed = windowToOpen;
	windowToOpen.addEventListener('close', function() {
		if (self.windowStack.length > 1) // don't pop the last Window, which is the base one
		{
			var popped = self.windowStack.pop();
		
			// Last window should NOT have been popped. Push it back on the stack!
			if (lastPushed != popped)
			{
				self.windowStack.push(popped);
			}
			
			// close dependent window ?
			if (this.toClose) {
			 	// close "parent" window, do not use animation (it looks weird with animation)
			 	//(self.navGroup) ? self.navGroupWindow.close(this.toClose, {animated : false}) : this.toClose.close({animated:false});
			 	(self.navGroup) ? self.navGroup.closeWindow(this.toClose, {animated : true}) : this.toClose.close({animated:true});
			}
			
			// open dependent window ?
			if (this.toOpen) {
				Ti.API.debug("Invoke open on dependent window:" + this.toOpen.title);
			 	self.open(this.toOpen);
			} 
		} // end if windowStack.length > 1, and end of my hack
	}); // end eventListener 'close'
	
	windowToOpen.addEventListener('set.to.close', function(dict) {
		this.toClose = dict.win;
	});
	
	windowToOpen.addEventListener('set.to.open', function(dict) {
		this.toOpen = dict.win;
	});

	//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
	windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

	//This is the first window
	if (this.windowStack.length === 1) {
		this.homePage = windowToOpen;
		this.lockedHomePage = this.homePage;
		if (Ti.Platform.osname === 'android') {
			windowToOpen.exitOnClose = true;
			windowToOpen.open();
		} else {
			// changed this from Ti.UI.iPhone.createNavigationGroup because it has been deprecated
			// since Ti 3.2.0
			this.navGroup = Ti.UI.iOS.createNavigationWindow({
				window : windowToOpen
			});
			this.navGroup.open();
		}
	} else {// All subsequent windows
		if (Ti.Platform.osname === 'android') {
			windowToOpen.open();
		} else {
			this.navGroup.openWindow(windowToOpen);
		}
	}
	return windowToOpen;
}; // end of open function

// Note: without a parameter, close automatically closes 1 window
NavigationController.prototype.close = function(numWindows) {
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedHomePage){
		if (numWindows > 1) {
			// setup chain reaction by setting up the flags on all the windows
			var i = this.windowStack.length - 1;
			for (var j = 1; j < numWindows; j++)
			{
				// set dependent window
				this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
				i--;
	       	}
	        // start chain reaction, close first window
			(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
		}
		else
		{
			(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
		}
	}
};// end of close function

// go back to the initial window of the NavigationController
NavigationController.prototype.home = function() {
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedHomePage) {
		// setup chain reaction by setting up the flags on all the windows
		for (var i = this.windowStack.length - 1; this.windowStack[i-1] != this.lockedHomePage; i--)		//NOPE!
		{
			// set dependent window
			this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
       	}
        // start chain reaction, close first window
		(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
	}
};// end of home function

NavigationController.prototype.setLockedHome = function(){
	this.lockedHomePage = this.windowStack[this.windowStack.length - 1];
};

NavigationController.prototype.resetHome = function(){
	this.lockedHomePage = this.homePage;
};

NavigationController.prototype.isInKioskMode = function() {
	return this.kioskMode;
};

function setKioskMode(self) {
	if (self.kioskMode == false) {
    	self.kioskMode = true;
    	self.setLockedHome();
	    var confirm = Ti.UI.createAlertDialog({
		    title: 'Activated Kiosk Mode',
		    buttonNames: ['OK']
		});
		var view = self.windowStack[self.windowStack.length - 1];
		view.onEnterKioskMode(view);
		confirm.show();	
	} else {
		self.kioskMode = false;
		self.resetHome();
		var confirm = Ti.UI.createAlertDialog({
		    title: 'Deactivated Kiosk Mode',
		    buttonNames: ['OK']
		});
		var view = self.windowStack[self.windowStack.length - 1];
		view.onExitKioskMode(view);
		confirm.show();	
	}
};

/*
 * Add kiosk mode listener to passed in element. Will activate on three 
 * long clicks if done withing three seconds.
 */ 
NavigationController.prototype.addKioskModeListener = function(element) {
	var count = 0;
	var self = this;
	element.addEventListener('longclick', function(e){
		count += 100;
		setTimeout(function(){
			count -= 100;
		}, 3000);
		
		if (count === 300) {
			if (OS_IOS) {// For IOS
				var dialog = Ti.UI.createAlertDialog({
				    title: 'Enter code',
				    passwordMask:true,
				    style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
				    buttonNames: ['OK', 'Cancel']
				});
				dialog.addEventListener('click', function(e){
					if (e.text == "friend") {
						setKioskMode(self);
					}
				});
				dialog.show();
			} else if (OS_ANDROID) {// For Andriod
				var textfield = Ti.UI.createTextField({
					passwordMask:true,
					hintText:'Enter code',
				    height:35,
				    top:100,
				    left:30,
				    width:250,
				    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
				});
				var dialog = Ti.UI.createAlertDialog({
				    title: 'Admin Lock',
				    androidView: textfield,
				    buttonNames: ['OK', 'cancel']
				});
				dialog.addEventListener('click', function(e) {
				    if (textfield.value == "friend") {
						setKioskMode(self);
				    }
				});
				dialog.show();
			}
		} // end if (count==300)	
	}); // end addEventListener
}; // end of addKioskModeListener

module.exports = NavigationController;
