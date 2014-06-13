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

NavigationController.prototype.open = function(/*Ti.UI.Window*/windowToOpen) {
	Ti.API.log("Open function.");
	
	// Capture Android back button
	var that = this;
	windowToOpen.addEventListener("android:back", function(e){
		if(that.windowStack[that.windowStack.length-1] == that.lockedHomePage)
			Ti.API.log("at Home!");
		else{
			Ti.API.log("We're Going Back!");
			that.close(1);
		}
	});
	
	//add the window to the stack of windows managed by the controller
	this.windowStack.push(windowToOpen);

	//grab a copy of the current nav controller for use in the callback
	var that = this;
	
	var lastPushed = windowToOpen;
	windowToOpen.addEventListener('close', function() {
		if (that.windowStack.length > 1) // don't pop the last Window, which is the base one
		{
			Ti.API.log("Event 'close': " + this.title);
			var popped = that.windowStack.pop();
		
			if (lastPushed != popped)
			{
				Ti.API.info("Last window should NOT have been popped. Push it back on the stack!");
				that.windowStack.push(popped);
			}
			
			// close dependent window ?
			if (this.toClose) {
				Ti.API.log("Invoke close on dependent window:" + this.toClose.title);
			 	// close "parent" window, do not use animation (it looks weird with animation)
			 	//(that.navGroup) ? that.navGroupWindow.close(this.toClose, {animated : false}) : this.toClose.close({animated:false});
			 	(that.navGroup) ? that.navGroup.closeWindow(this.toClose, {animated : true}) : this.toClose.close({animated:true});
			}
			
			// open dependent window ?
			if (this.toOpen) {
				Ti.API.log("Invoke open on dependent window:" + this.toOpen.title);
			 	that.open(this.toOpen);
			} 
		
			Ti.API.log("End event 'close'. Stack: " + that.windowStack.map(function(v) {return v.title;}));
		} // end if windowStack.length > 1, and end of my hack
	}); // end eventListener 'close'
	
	windowToOpen.addEventListener('set.to.close', function(dict) {
		Ti.API.log("Event 'set.to.close': " + this.title);
		this.toClose = dict.win;
	});
	
	windowToOpen.addEventListener('set.to.open', function(dict) {
		Ti.API.log("Event 'set.to.open': " + this.title);
		this.toOpen = dict.win;
	});

	//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
	windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

	//This is the first window
	if (this.windowStack.length === 1) {
		this.homePage = windowToOpen;
		this.lockedHomePage = this.homePage;
		Ti.API.log("Initialy setting homePage to: " + windowToOpen.title);
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
	Ti.API.log("End Open. Stack: " + this.windowStack.map(function(v) {return v.title;}));
}; // end of open function

// Note: without a parameter, close automatically closes 1 window
NavigationController.prototype.close = function(numWindows) {
	Ti.API.log("close function.");
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
	Ti.API.log("End Home. Stack: " + this.windowStack.map(function(v) {return v.title;}));
};// end of close function

// go back to the initial window of the NavigationController
NavigationController.prototype.home = function() {
	Ti.API.log("Home function. lockedHomePage: " + this.lockedHomePage.title + " windowStack.length: " + this.windowStack.length);
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedHomePage) {
		// setup chain reaction by setting up the flags on all the windows
		for (var i = this.windowStack.length - 1; this.windowStack[i-1] != this.lockedHomePage; i--)		//NOPE!
		{
			// set dependent window
			Ti.API.log("this.windowStack[i]: " + this.windowStack[i].title);
			Ti.API.log("this.windowStack[i-1]: " + this.windowStack[i-1].title);
			this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
       	}
        // start chain reaction, close first window
		(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
	}
	Ti.API.log("End Home. Stack: " + this.windowStack.map(function(v) {return v.title;}));
};// end of home function

NavigationController.prototype.setLockedHome = function(){
	this.lockedHomePage = this.windowStack[this.windowStack.length - 1];
	Ti.API.log("set locked Home to: " + this.lockedHomePage.title);
};

NavigationController.prototype.resetHome = function(){
	this.lockedHomePage = this.homePage;
	Ti.API.log("Reset Home to: " + this.lockedHomePage);
};

NavigationController.prototype.isInKioskMode = function() {
	return this.kioskMode;
};

/*
 * Add kiosk mode listener to passed in element. Will activate on three 
 * long clicks if done withing three minutes.
 */ 
NavigationController.prototype.addKioskModeListener = function(element) {
	Ti.API.log("Adding kiosk mode listener");
	var count = 0;
	var that = this;
	element.addEventListener('longclick', function(e){
		count += 100;
		setTimeout(function(){
			count -= 100;
			Ti.API.info('oops!');
		}, 3000);
		Ti.API.info('what up?');
		
		if (count === 300) {
			if (false) {// For IOS
				// var dialog = Ti.UI.createAlertDialog({
				    // title: 'Enter code',
				    // style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
				    // buttonNames: ['OK', 'Cancel']
				// });
				// dialog.addEventListener('click', kioskDialog);
				// dialog.show();
			} else if (true) {// For Andriod
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
				    Ti.API.info("kioskMode before: " + that.kioskMode);
				    if (textfield.value == "friend") {
				    	if (that.kioskMode == false) {
				    		Ti.API.info("activating kiosk mode");
					    	that.kioskMode = true;
					    	that.setLockedHome();
						    var confirm = Ti.UI.createAlertDialog({
							    title: 'Activated Kiosk Mode',
							    buttonNames: ['OK']
							});
							var view = that.windowStack[that.windowStack.length - 1];
							view.reload(view);
							confirm.show();	
				    	} else {
				    		that.kioskMode = false;
				    		that.resetHome();
				    		Ti.API.info("deactivating kiosk mode");
				    		var confirm = Ti.UI.createAlertDialog({
							    title: 'Deactivated Kiosk Mode',
							    buttonNames: ['OK']
							});
							var view = that.windowStack[that.windowStack.length - 1];
							view.reload(view);
							confirm.show();	
				    	}
				    	Ti.API.log("Kisok Mode after: " + that.kioskMode);
						Ti.API.log("Home page: " + this.lockedHomePage);
				    }
				});
				dialog.show();
			}
		} // end if (count==300)	
	}); // end addEventListener
}; // end of addKioskModeListener

module.exports = NavigationController;
