exports.definition = {
	config: {
		data: {},
		
		adapter: {
			type: "restapi",
			collection_name: "museum"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			url : function() {
                return "http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/13";
            },
			parse : function(_resp, xhr) { 
				// return the post attributes
				data = JSON.parse(_resp);
				Ti.API.info("\n\n\n\n\n\n"+data);
				return data;
            }

		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			url : function() {
                return "http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/13";
            },
		});

		return Collection;
	}
};