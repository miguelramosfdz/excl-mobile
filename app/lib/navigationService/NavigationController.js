// NavigationController
// This version works for Android and iOS for Titanium 3.2.0. 

var rootPath = (typeof Titanium == 'undefined')? '../../lib/' : '';

function NavigationController() {
	this.windowStack = [];
	//this.kioskMode = false;
	this.Page = null;
	this.lockedPage = null;
	this.alloy = require(rootPath + "customCalls/alloyService");
	this.analyticsController = this.alloy.Globals.analyticsController;
	
	this.menu = require(rootPath + "navigationService/flyoutService");
	//this.kioskModeHandler = require(rootPath + "adminResources/kioskMode");
	/*
	this.flyoutMenu = Alloy.createController('flyout').getView();
	this.flyoutMenu.zIndex = 1;//*/
}

NavigationController.prototype.enterKioskMode = function(){
		var window = this.windowStack[this.windowStack.length - 1];
	    this.setLocked();				//
 		this.menu.closeMenu();			// Change to func
		this.reset();
 		
		window.onEnterKioskMode(window);	
};

NavigationController.prototype.exitKioskMode = function(){
		
		var window = this.windowStack[this.windowStack.length - 1];
		this.reset();
		window.onExitKioskMode(window);	
};

NavigationController.prototype.addEventListeners = function(win){
	self = this;
	win.addEventListener("close", function(e){
		self.menu.closeMenuWithoutAnimation();
	});	
};

// Open new window and add it to window stack
NavigationController.prototype.open = function(controller) {
	
	windowToOpen = controller.getView();
	windowToOpen.add(this.menu.getMenu());
	this.addEventListeners(windowToOpen);
	
	windowToOpen.onEnterKioskMode = function(window){};
	windowToOpen.onExitKioskMode = function(window){};
	
	// Add onEnterKioskMode and/or onExitKioskMode functionality if defined
	if (controller && controller.onEnterKioskMode && typeof(controller.onEnterKioskMode) === 'function') {
		windowToOpen.onEnterKioskMode = controller.onEnterKioskMode;
	}
	if (controller && controller.onExitKioskMode && typeof(controller.onExitKioskMode) === 'function') {
		windowToOpen.onExitKioskMode = controller.onExitKioskMode;
	}
	
	// Store the window's title on it from the controller
	if (controller && controller.getAnalyticsPageTitle && typeof(controller.getAnalyticsPageTitle) === 'function') {
		windowToOpen.analyticsPageTitle = controller.getAnalyticsPageTitle();
	}
	if (controller && controller.getAnalyticsPageLevel && typeof(controller.getAnalyticsPageLevel) === 'function') {
		windowToOpen.analyticsPageLevel = controller.getAnalyticsPageLevel();
	}
	
	// Capture Android back button
	if (OS_ANDROID) {
		var self = this;
		windowToOpen.addEventListener("android:back", function(e){
			if(self.windowStack[self.windowStack.length-1] != self.lockedPage) {
				self.close(1);
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
			 	(self.navGroup) ? self.navGroup.closeWindow(this.toClose, {animated : false}) : this.toClose.close({animated:false});
			 	// (self.navGroup) ? self.navGroup.closeWindow(this.toClose, {animated : true}) : this.toClose.close({animated:true});
			}
			
			// open dependent window ?
			if (this.toOpen) {
			 	self.open(this.toOpen, {animated : false});
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
		this.Page = windowToOpen;
		this.lockedPage = this.Page;
		windowToOpen.analyticsPageTitle = "Home";
		windowToOpen.analyticsPageLevel = "Exhibit Landing";
		if (OS_ANDROID) {
			windowToOpen.exitOnClose = true;
			windowToOpen.open({animated : false});
		} else {
			// changed this from Ti.UI.iPhone.createNavigationGroup because it has been deprecated
			// since Ti 3.2.0
			this.navGroup = Ti.UI.iOS.createNavigationWindow({
				window : windowToOpen
			});
			this.navGroup.open({animated : false});
		}
	} else {// All subsequent windows
		if (OS_ANDROID) {
			windowToOpen.open({animated : false});
		} else {
			this.navGroup.openWindow(windowToOpen, {animated : false});
		}
	}
	this.analyticsTrackWindowScreen(windowToOpen);
	return windowToOpen;
};

// Note: without a parameter, close automatically closes 1 window
NavigationController.prototype.close = function(numWindows) {
	this.menu.closeMenuWithoutAnimation();
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedPage) {
		if (numWindows > 1) {
			// setup chain reaction by setting up the flags on all the windows
			var i = this.windowStack.length - 1;
			for (var j = 1; j < numWindows; j++) {
				// set dependent window
				this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
				i--;
	       	}
	        // start chain reaction, close first window
			(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close({animated : false});
		} else {
			(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
		}
		this.analyticsTrackWindowScreen(this.windowStack[this.windowStack.length - 2]);
	} else {
		this.analyticsTrackWindowScreen(this.windowStack[0]);
	}
};

// go back to the initial window of the NavigationController
NavigationController.prototype.home = function() {
	
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedPage) {
		// setup chain reaction by setting up the flags on all the windows
		for (var i = this.windowStack.length - 1; this.windowStack[i-1] != this.lockedPage; i--) {
			// set dependent window
			this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
       	}      	
       	
        // start chain reaction, close first window
		(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1], {animated : false}) : this.windowStack[this.windowStack.length - 1].close({animated : false});
		this.analyticsTrackWindowScreen(this.windowStack[0]);
	}
};

// Lock  page to current top of stack
NavigationController.prototype.setLocked = function(){
	this.lockedPage = this.windowStack[this.windowStack.length - 1];
};

// Reset  page to original 
NavigationController.prototype.reset = function(){
	this.lockedPage = this.Page;
};



// Return true if in kiosk mode and false otherwise
NavigationController.prototype.toggleMenu = function(){
	this.menu.toggleMenu();
};

NavigationController.prototype.analyticsTrackWindowScreen = function(window) {
	//if (!window || !window.analyticsPageTitle || !window.analyticsPageLevel) {return false;}
	Alloy.Globals.analyticsController.trackScreen(window.analyticsPageTitle, window.analyticsPageLevel, Alloy.Globals.adminMode.isInKioskMode());
	var kioskModeString = (Alloy.Globals.adminMode.isInKioskMode()) ? "KioskModeOn" : "KioskModeOff";
	Alloy.Globals.analyticsController.trackEvent(kioskModeString, window.analyticsPageLevel, window.analyticsPageTitle, 1);
};

module.exports = NavigationController;

