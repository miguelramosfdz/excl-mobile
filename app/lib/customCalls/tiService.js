var tiService = {
	
	App: {

		Properties : {
			setBool: function(name, bool) {
				if ( typeof Titanium !== 'undefined') {
					Ti.App.Properties.setBool(name, bool);
				}
			},
			getBool: function(name) {
				if ( typeof Titanium !== 'undefined') {
					Ti.App.Properties.getBool(name);
				}
			}
		}
	
	}
};

module.exports = tiService;
