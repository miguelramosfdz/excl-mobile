var tiService = require('../../lib/customCalls/tiService');

var StorageService = function() {

};

StorageService.prototype.setBoolProperty = function(name, value) {
	tiService.App.Properties.setBool(name, value);
};

StorageService.prototype.getBoolProperty = function(name) {
	return tiService.App.Properties.getBool(name);
};
	
module.exports = StorageService;