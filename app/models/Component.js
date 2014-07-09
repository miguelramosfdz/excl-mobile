exports.definition = {
	config: {
		columns: {
		    "id": "integer",
		    "name": "text",
		    "exhibit": "text",
		    "compOrderNo": "order_number"
		},
		adapter: {
			type: "sql",
			collection_name: "Component",
			idAttribute: "alloy_id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			getScreenName: function() {
				return this.get("exhibit") + "/" + this.get("name");
			},
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			model: "Component"
		});

		return Collection;
	}
};