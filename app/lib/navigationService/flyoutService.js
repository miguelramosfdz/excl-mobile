var visible = false;

var flyoutService = {
	flyoutMenu: Alloy.createController('flyout').getView(),
	openMenu: function(){
		if(!NavigationController.prototype.isInKioskMode()){
			//alert("in Kiosk Mode: "+NavigationController.prototype.isInKioskMode());
			this.flyoutMenu.animate({
				left:"0%",
				curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
				duration: 100
			});
			visible = true;
		}
		return visible;
	},
	
	closeMenu: function(){
	
		this.flyoutMenu.animate({
			left: "100%",
			curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 100
		});
		visible = false;
		return visible;
	},
	toggleMenu: function(){
	
		if(visible)
			return this.closeMenu();
		else
			return this.openMenu();
	}
};

flyoutService.flyoutMenu.zindex = 1;
flyoutService.closeMenu();

module.exports = flyoutService;