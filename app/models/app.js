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
					if(response) {
						var filters = response.data.museum.tailored_content_categories;
						filters = filters.split('|');
						
						for(var i = 0; i < filters.length; i++) {
							var filter = filters[i];
							filter = {
								name: filter,
								active: false
							};
							Alloy.Collections.filter.add(filter);
						}
						filters = Alloy.Collections.filter;
						
						for(var i = 0; i < filters.size(); ++i) {
							filters.at(i).on('change:active', function(e) {
								Alloy.Models.app.trigger('change:customizeLearning');
							});
						};
						Alloy.Collections.filter.ready = true;
					}
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