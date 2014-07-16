

function LoadingSpinner() {
	var style;
	if (OS_IOS){
	  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	}
	else if (OS_ANDROID) {
	  style = Ti.UI.ActivityIndicatorStyle.DARK;
	}
	this.spinner = Ti.UI.createActivityIndicator({
	  style: style,
	  top: '50%',
	  left: '50%',
	  height: Ti.UI.SIZE * 2,
	  width: Ti.UI.SIZE * 2
	});
}

LoadingSpinner.prototype.addTo = function(element){
	element.add(this.spinner);
};

LoadingSpinner.prototype.show = function(){
	this.spinner.show();
};

LoadingSpinner.prototype.hide = function(){
	this.spinner.hide();
};

module.exports = LoadingSpinner;