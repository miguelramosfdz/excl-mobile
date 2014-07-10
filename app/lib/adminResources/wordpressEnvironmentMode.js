function WordpressEnvironmentMode(){
	
}

WordpressEnvironmentMode.prototype.changeWordpressEnvironment = function(){
	Alloy.Globals.rootWebServiceUrl = "http://excl.dreamhosters.com/dev2/wp-json/v01/excl/museum/81";
	alert("WordpressEnvironmentMode has been changed!");
	
	Alloy.Globals.navController.restart();
};

module.exports = WordpressEnvironmentMode;