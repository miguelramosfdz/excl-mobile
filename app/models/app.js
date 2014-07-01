exports.definition = {
	config: {
		defaults: {
			customizeLearning: false
		},
		adapter: {
			type: "properties",
			collection_name: "app"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			retrieveFilters: function() {
				var retriever = Alloy.Globals.setPathForLibDirectory('dataRetriever/dataRetriever');
				var url = dreamhostersAPI;
	
				retriever.fetchDataFromUrl(url, function(response) {
					var filters = response.data.museum.tailored_content_categories;
					filters = filters.split('|');
					
					for(var i = 0; i < filters.length; i++) {
						var filter = filters[i];
						var args = {
							name: filter,
							active: false
						};
						filter = Alloy.createModel('filter', args);
						Alloy.Collections.filter.add(filter);
					}
					Alloy.Collections.filter.ready = true;
				});
			}
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