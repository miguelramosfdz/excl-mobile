var StorageService = function() {

};

StorageService.prototype.setBoolProperty = function(name, value) {
	Ti.App.Properties.setBool(name, value);
};

StorageService.prototype.getBoolProperty = function(name) {
	return Ti.App.Properties.getBool(name);
};
	
module.exports = StorageService;