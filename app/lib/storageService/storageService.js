function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

var tiService = setPathForLibDirectory("customCalls/tiService");

var StorageService = function() {

};

StorageService.prototype.setBoolProperty = function(name, value) {
	tiService.App.Properties.setBool(name, value);
};

StorageService.prototype.getBoolProperty = function(name) {
	return tiService.App.Properties.getBool(name);
};
	
module.exports = StorageService;