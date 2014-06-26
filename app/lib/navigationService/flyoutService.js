var visible = false;

var flyoutService = {
	flyoutMenu: Alloy.createController('flyout').getView(),
	openMenu: function(){
		this.flyoutMenu.animate({
			height: "100%",
			curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 100
		});
		visible = true;
	},
	closeMenu: function(){
		this.flyoutMenu.animate({
			height: 0,
			curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 100
		});

		visible = false;
	},
	toggleMenu: function(){
		if(visible)
			this.closeMenu();
		else
			this.openMenu();
	}
};

flyoutService.flyoutMenu.zindex = 1;
flyoutService.closeMenu();

module.exports = flyoutService;