var dataRetriever = require('dataRetriever');

function init() {
	$.containerView.layout = "vertical";
	$.platformLogoWidget.init({
		androidLogoPath : "/images/android-logo.png",
		iosLogoPath : "/images/ios-logo.png"
	});

	var url = "http://api.openweathermap.org/data/2.5/weather?q=Houston,us&mode=json&units=imperial";
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		$.temperatureLabel.text = returnedData.main.temp + " °F";
		$.cityLabel.text = returnedData.name;
	});

}

function refresh() {
	init();
}

init();
