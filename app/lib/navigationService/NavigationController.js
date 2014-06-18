// NavigationController
// This version works for Android and iOS for Titanium 3.2.0. 

function NavigationController() {
	this.windowStack = [];
	this.kioskMode = false;
	this.homePage;
	this.lockedHomePage;
};


// Open new window and add it to window stack
NavigationController.prototype.open = function(windowToOpen, onEnterKioskMode, onExitKioskMode) {
	
	// Add or define onEnterKioskMode or onExitKioskMode functionality
	if (onEnterKioskMode && typeof(onEnterKioskMode) === 'function') {
		windowToOpen.onEnterKioskMode = onEnterKioskMode;
	} else {
		windowToOpen.onEnterKioskMode = function(window){};
	}
	if (onExitKioskMode && typeof(onExitKioskMode) === 'function') {
		windowToOpen.onExitKioskMode = onExitKioskMode;
	} else {
		windowToOpen.onExitKioskMode = function(window){};
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
		if (OS_ANDROID) {
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
		if (OS_ANDROID) {
			windowToOpen.open();
		} else {
			this.navGroup.openWindow(windowToOpen);
		}
	}
	return windowToOpen;
};

// Note: without a parameter, close automatically closes 1 window
NavigationController.prototype.close = function(numWindows) {
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedHomePage) {
		if (numWindows > 1) {
			// setup chain reaction by setting up the flags on all the windows
			var i = this.windowStack.length - 1;
			for (var j = 1; j < numWindows; j++) {
				// set dependent window
				this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
				i--;
	       	}
	        // start chain reaction, close first window
			(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
		} else {
			(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
		}
	}
};

// go back to the initial window of the NavigationController
NavigationController.prototype.home = function() {
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedHomePage) {
		// setup chain reaction by setting up the flags on all the windows
		for (var i = this.windowStack.length - 1; this.windowStack[i-1] != this.lockedHomePage; i--) {
			// set dependent window
			this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
       	}
        // start chain reaction, close first window
		(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
	}
};

// Lock home page to current top of stack
NavigationController.prototype.setLockedHome = function(){
	this.lockedHomePage = this.windowStack[this.windowStack.length - 1];
};

// Reset home page to original home
NavigationController.prototype.resetHome = function(){
	this.lockedHomePage = this.homePage;
};

// Return true if in kiosk mode and false otherwise
NavigationController.prototype.isInKioskMode = function() {
	return this.kioskMode;
};


// Handles updateing kiosk mode status.
// Used in addKioskModeListener()
function updateKioskMode(self) {
	
	// Create confirmation dialog
	var confirm = Ti.UI.createAlertDialog({
	    title: '',
	    buttonNames: ['OK']
	});
	
	// Get top window to access call back functions
	var window = self.windowStack[self.windowStack.length - 1];
	
	// Deactivate kiosk mode if active or vice versa
	if (self.kioskMode == false) {
    	self.kioskMode = true;
    	self.setLockedHome();
    	confirm.title = 'Activated Kiosk Mode';
		window.onEnterKioskMode(window);	
	} else {
		self.kioskMode = false;
		self.resetHome();
	    confirm.title = 'Deactivated Kiosk Mode';
		window.onExitKioskMode(window);	
	}
	confirm.show();
};

// Handles kiosk mode dialog
// Used in addKioskModeListener()
function handleKioskModeDialog(self) {	
	if (OS_IOS) {
		var dialog = Ti.UI.createAlertDialog({
		    title: 'Enter code',
		    style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
		    passwordMask:true,
		    buttonNames: ['OK', 'Cancel']
		});
		dialog.addEventListener('click', function(e){
			if (e.text == "friend") {
				updateKioskMode(self);
			}
		});
	} else if (OS_ANDROID) {
		var textfield = Ti.UI.createTextField({
			passwordMask:true,
		    height:35,
		    top:100,
		    left:30,
		    width:250,
		    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		var dialog = Ti.UI.createAlertDialog({
		    title: 'Enter code',
		    androidView: textfield,
		    passwordMask:true,
		    buttonNames: ['OK', 'Cancel']
		});
		dialog.addEventListener('click', function(e) {
		    if (textfield.value == "friend") {
				updateKioskMode(self);
		    }
		});
	}
	dialog.show();
};

// Add kiosk mode listener to passed in element. Will activate on three 
// long clicks if done withing three seconds. 
NavigationController.prototype.addKioskModeListener = function(element) {
	var count = 0;
	var self = this;
	element.addEventListener('longclick', function(e){
		count += 100;
		setTimeout(function(){count -= 100;}, 3000);
		if (count === 300) {
			handleKioskModeDialog(self);
		}	
	});
};

module.exports = NavigationController;