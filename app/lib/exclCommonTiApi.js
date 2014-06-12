var logger = {

	debug : function(object) {
		Ti.API.debug(object);
	},

	info : function(object) {
		Ti.API.info(object);
	},
	
	parse : function(object) {
		return JSON.parse(object);
	},
};

module.exports = logger;
