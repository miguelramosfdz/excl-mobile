var storageSystem = {
	save: function(fileName, value){
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
		file.write(value);
	},
	read: function(fileName){
		var text = readFromFile(fileName);
		return text;
	},
	exists: function(fileName){
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
		return file.exists();
	}
};

// NEEDS UNIT TEST
function readFromFile(fileName){
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
	if(!file.exists())
		return false;
	var text = file.read().text;
	file = null;
	return text;
}

module.exports = storageSystem;
