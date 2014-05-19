function getWeatherForAndroid(onSuccess){
	return getWeather("Mountain View", onSuccess);
}
function getWeatherForIOS(onSuccess){
	return getWeather("Cupertino", onSuccess);
}
function getWeather(city, onSuccess){
	city = encodeURIComponent(city);
	var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&mode=json&units=imperial";
	Ti.API.info("Getting weather: " + url);
	var client = Ti.Network.createHTTPClient({
		onload: function(e) {
			json = JSON.parse(this.responseText);
			Ti.API.debug(json);
			onSuccess(json);
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			alert("Could not retrieve current temperature!");
		}
	});
	client.open("GET", url);
	client.send();
}


var weather = {
	getWeather: function(onSuccess){
		if (OS_ANDROID){
			return getWeatherForAndroid(onSuccess);
		} else if (OS_IOS){
			return getWeatherForIOS(onSuccess);
		} else{
			Ti.API.debug("Unsupported platform");
			return {};
		}
	}
};
module.exports = weather;