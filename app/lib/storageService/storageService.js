var StorageService = function() {

};

StorageService.prototype.setProperty = function(name, value) {
	Ti.App.Properties.setBool(name, value);
};

StorageService.prototype.getProperty = function(name) {
	return Ti.App.Properties.getBool(name);
};
	
module.exports = StorageService;