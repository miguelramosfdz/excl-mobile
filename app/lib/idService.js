
function idService(){
	this.fileSystem = require('deviceStorage');
}

idService.prototype.getID = function(){
		return this.fileSystem.read("uniqueID.txt");
};

idService.prototype.createID = function(){
		this.fileSystem.save("uniqueID.txt", Titanium.Platform.createUUID());
};

idService.prototype.hasID = function(){
		return this.fileSystem.exists("uniqueID.txt");
};

module.exports = idService;
