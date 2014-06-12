var logger = {

	debug : function(object) {
		Ti.API.debug(object);
	},

	info : function(object) {
		Ti.API.info(object);
	},

	heyhey : function() {
		console.log("this is captain hey hey");
	},

	parse : function(object) {
		return JSON.parse(object);
	}
};

module.exports = logger;
