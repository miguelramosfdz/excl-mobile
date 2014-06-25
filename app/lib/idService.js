var fileSystem = require('deviceStorage');
var fileName = "uniqueID.txt";

idService = {	
	init: function(){
		if(!fileSystem.exists(fileName))	
			fileSystem.save(fileName, Titanium.Platform.createUUID());
	},
	getID: function(){
		return fileSystem.read(fileName);
	}
};
module.exports = idService;
