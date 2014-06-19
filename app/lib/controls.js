var Alloy=require('alloy');

exports.getMainView=function(){
	return Alloy.createController('mainview');
};

exports.getMenuView=function(){
	return Alloy.createController('menuview');	
};

exports.getMenuButton=function(args){
	var v=Ti.UI.createView({
		height: args.h,
		width: args.w,
		backgroundColor: '#FF9933'
	});
	
	var b=Ti.UI.createView({
		height: "30dp",
		width: "30dp",
		backgroundImage: "/whiteMenu.png"
	});
	
	v.add(b);
	
	return v;
};

//Get the Configuration Controller
exports.getConfigView=function(){
    return Alloy.createController('config');
};
