exports.definition = {
	config: {
		defaults: {
			name: "post name",
			id: -1,
			image: "/finterns.png",
			raw: {}
		},
		adapter: {
			type: "properties",
			collection_name: "post"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};