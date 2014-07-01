exports.definition = {
	config: {
		defaults: {
			name: "filter name",
			active: false
		},
		adapter: {
			type: "properties",
			collection_name: "filter"
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
			fill: function(n) {
				for(var i = 0; i < n; i = i + 1) {
					var filter = Alloy.createModel('filter');
					this.add(filter);
				};
			}
		});

		return Collection;
	}
};