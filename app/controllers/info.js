var args = arguments[0] || {};

var analyticsPageTitle = "Info";
var analyticsPageLevel = "Information";

var setAnalyticsPageTitle = function(title) {
	analyticsPageTitle = title;
};
var getAnalyticsPageTitle = function() {
	return analyticsPageTitle;
};
var setAnalyticsPageLevel = function(level) {
	analyticsPageLevel = level;
};
var getAnalyticsPageLevel = function() {
	return analyticsPageLevel;
};

$.navBar.setPageTitle("Info");

function insertInfoPicture() {

	var view = Titanium.UI.createView({
		height : '100%',
		left : '6dip',
		right : '6dip',
		top : '10dip',
		bottom : '20dip',
		layout : 'vertical'
	});

	var image = Ti.UI.createImageView({
		image : "/images/MuseumInfo.jpg",
		width : '100%',
		height : '100%'
	});

	view.add(image);

	$.scrollView.add(view);
	$.scrollView.height = "auto";

}

insertInfoPicture();
