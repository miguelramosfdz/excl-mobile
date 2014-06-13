var weatherService = require('weather/weather');

function init() {	
	$.containerView.layout = "vertical";
	$.platformLogoWidget.init({
		androidLogoPath: "/images/android-logo.png",
		iosLogoPath: "/images/ios-logo.png"
	});
	

	weatherService.getWeather(function(weatherData) {
		if (weatherData) {
			$.temperatureLabel.text = weatherData.main.temp + " °F";
			$.cityLabel.text = weatherData.name;
		}
	}); 


}

function refresh(){
	init();
}

init();