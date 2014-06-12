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

	network : function() {
		var client = Ti.Network.createHTTPClient({
			onload : function() {
				var json = parseJson(this.responseText);
				onSuccess(json);
			},
			onerror : function() {
				debug(e.error);
				alert("Could not retrieve data!");
			}
		});
		return client;
	},
};

module.exports = logger;
