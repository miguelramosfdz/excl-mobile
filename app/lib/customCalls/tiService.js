var tiService = {
	App: {
		Properties : {
			setBool: function(key, bool) {
				Titanium.App.Properties.setBool(key, bool);
			},
			getBool: function(key) {
				return Titanium.App.Properties.getBool(key);
			}
		}
	}
};

module.exports = tiService;
