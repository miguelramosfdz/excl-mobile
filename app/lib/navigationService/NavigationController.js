// NavigationController
// This version works for Android and iOS for Titanium 3.2.0. 

var rootPath = (typeof Titanium == 'undefined')? '../../lib/' : '';

function NavigationController() {
	this.windowStack = [];
	this.Page = null;
	this.lockedPage = null;
	this.alloy = require(rootPath + "customCalls/alloyService");
	this.analyticsController = this.alloy.Globals.analyticsController;
	this.menu = require(rootPath + "navigationService/flyoutService");
}

NavigationController.prototype.restart = function(){
		this.home();
		this.windowStack.pop();
		Alloy.createController("index");
};

NavigationController.prototype.enterKioskMode = function(){
		var window = this.windowStack[this.windowStack.length - 1];
	    this.setLocked();
 		this.menu.closeMenu();
 		
		window.onEnterKioskMode(window);	
};

NavigationController.prototype.exitKioskMode = function(){
		var window = this.windowStack[this.windowStack.length - 1];
		this.reset();
		window.onExitKioskMode(window);	
};

NavigationController.prototype.open = function(controller) {
	var windowToOpen = this.getWindowFromController(controller);
	try {
		var win = this.openWindow(windowToOpen);
		
		return win;
	} catch(e) {
		return false;
	}
};

NavigationController.prototype.getWindowFromController = function(controller) {
	var		windowToOpen = controller.getView();
			windowToOpen = this.attachControllerInfoToView(controller, windowToOpen);
	return	windowToOpen;
};

NavigationController.prototype.attachControllerInfoToView = function(controller, windowToOpen) {
	windowToOpen.onEnterKioskMode	= _.isFunction(controller.onEnterKioskMode) ? controller.onEnterKioskMode : function(windowToOpen){};
	windowToOpen.onExitKioskMode	= _.isFunction(controller.onExitKioskMode) ? controller.onExitKioskMode : function(windowToOpen){};
	windowToOpen.analyticsPageTitle	= _.isFunction(controller.getAnalyticsPageTitle) ? controller.getAnalyticsPageTitle() : "[Unnamed Screen]";
	windowToOpen.analyticsPageLevel	= _.isFunction(controller.getAnalyticsPageLevel) ? controller.getAnalyticsPageLevel() : "[Unnamed Level]";
	windowToOpen.reload 			= _.isFunction(controller.reload) ? controller.reload : function(){};
	return windowToOpen;
};

NavigationController.prototype.openWindow = function(windowToOpen) {
	this.prepWindowsWithFlyout(windowToOpen);
	this.addCloseEventListenersToWindow(windowToOpen);
	this.analyticsTrackWindowScreen(windowToOpen);
	if (this.windowStack.length === 0) {
		this.openHomeScreen(windowToOpen);
	} else {
		this.openNewScreen(windowToOpen);
	}
	this.windowStack.push(windowToOpen);

	return windowToOpen;
};

NavigationController.prototype.prepWindowsWithFlyout = function(windowToOpen) {
	windowToOpen.add(this.menu.getMenu());
	removeMenuFromWindow(this.windowStack, this.menu);
};

NavigationController.prototype.openHomeScreen = function(windowToOpen) {
	this.Page = windowToOpen;
	this.lockedPage = this.Page;
	windowToOpen.analyticsPageTitle = "Home";
	windowToOpen.analyticsPageLevel = "Exhibit Landing";
	if (OS_ANDROID) {
		//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
		windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
		windowToOpen.exitOnClose = true;
		windowToOpen.open({animated : false});
	} else {
		// changed this from Ti.UI.iPhone.createNavigationGroup because it has been deprecated
		// since Ti 3.2.0
		if (!this.navGroup) {
			this.navGroup = Ti.UI.iOS.createNavigationWindow({
				window : windowToOpen
			});
		}
		this.navGroup.open({animated : false});
	}
};

NavigationController.prototype.openNewScreen = function(windowToOpen) {
	if (OS_ANDROID) {
		//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
		windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
		windowToOpen.open({animated : false});
	} else if (OS_IOS) {
		this.navGroup.openWindow(windowToOpen, {animated : false});
	}
};

NavigationController.prototype.addCloseEventListenersToWindow = function(windowToOpen){
	var self = this; // for use in callbacks
	windowToOpen.addEventListener("close", function(e){
		self.menu.closeMenuWithoutAnimation();
	});
	
	// Capture Android back button
	if (OS_ANDROID) {
		windowToOpen.addEventListener("android:back", function(e){
			if(self.windowStack[self.windowStack.length-1] != self.lockedPage) {
				self.close(1);
			}
		});
	}

	var lastPushed = windowToOpen;
	windowToOpen.addEventListener('close', function() {
		if (self.windowStack.length > 0) // don't pop the last Window, which is the base one
		{
			var popped = self.windowStack.pop();

			// Last window should NOT have been popped. Push it back on the stack!
			/*if (lastPushed != popped)
			{
				self.windowStack.push(popped);
			}//*/

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
};

// Note: without a parameter, close automatically closes 1 window
NavigationController.prototype.close = function(numWindows) {
	this.menu.closeMenuWithoutAnimation();
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedPage) {
		
		removeMenuFromWindow(this.windowStack, this.menu);
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
		addMenuToNextWindow(this.windowStack, this.menu);
		this.analyticsTrackWindowScreen(this.windowStack[this.windowStack.length - 2]);
	} else {
		this.analyticsTrackWindowScreen(this.windowStack[0]);
	}
};

// go back to the initial window of the NavigationController
NavigationController.prototype.home = function() {
	removeMenuFromWindow(this.windowStack, this.menu);
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
	addMenuToHomeWindow(this.windowStack, this.menu);
	//addMenuToNextWindow(this.windowStack, this.menu);
};

// Lock page to current top of stack
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

// Return true if in kiosk mode and false otherwise
NavigationController.prototype.closeMenuWithoutAnimation = function(){
	this.menu.closeMenuWithoutAnimation();
};

NavigationController.prototype.analyticsTrackWindowScreen = function(window) {
	Ti.API.debug("Tracking screen " + window.analyticsPageTitle + " as a " + window.analyticsPageLevel + " level");
	Alloy.Globals.analyticsController.trackScreen(window.analyticsPageTitle, window.analyticsPageLevel, Alloy.Globals.adminMode.isInKioskMode());
	var kioskModeString = (Alloy.Globals.adminMode.isInKioskMode()) ? "KioskModeOn" : "KioskModeOff";
	Alloy.Globals.analyticsController.trackEvent(kioskModeString, window.analyticsPageLevel, window.analyticsPageTitle, 1);
};

function addMenuToHomeWindow(windowStack, menu){
	if(windowStack.length>0){	
		windowStack[0].add(menu.getMenu());
	}
}

function addMenuToNextWindow(windowStack, menu){
	if(windowStack.length>1){	
		windowStack[windowStack.length-2].add(menu.getMenu());
	}
}

function removeMenuFromWindow(windowStack, menu){
	if(windowStack.length>0){
		windowStack[windowStack.length-1].remove(menu.getMenu());
	}
}

module.exports = NavigationController;

