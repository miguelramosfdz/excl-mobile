// fetch the data here
// component id is provided
// picture is provided
var args = arguments[0] || {};
var gradientColors = ["#2382ff", "#005CD5", "#004092", "#002257", "#00142D", "#000914"];
var gradientColorsCount = 0;
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + args[0].get('id');

var rootDirPath = ( typeof Titanium == 'undefined') ? '../../lib/' : '';
var dataRetriever = require(rootDirPath + 'dataRetriever/dataRetriever');
var loadingSpinner = require(rootDirPath + 'loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();
// --------------------------------------------------------------------------------------------------------
var analyticsPageTitle = "";
var analyticsPageLevel = "";

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
exports.setAnalyticsPageTitle = setAnalyticsPageTitle;
exports.getAnalyticsPageTitle = getAnalyticsPageTitle;
exports.setAnalyticsPageLevel = setAnalyticsPageLevel;
exports.getAnalyticsPageLevel = getAnalyticsPageLevel;
// --------------------------------------------------------------------------------------------------------

function setPageTitle(name) {
	$.navBar.setPageTitle(name);
}

function addSpinner() {
	spinner.addTo($.scrollView);
	spinner.show();
}

function removeSpinner() {
	spinner.hide();
}

function insertComponentPicture(imageUrl) {
	Ti.API.info("Picture to insert ===> " + imageUrl.toString());

	var view = Titanium.UI.createView({
		height : '40%',
		left : '6dip',
		right : '6dip',
		top : '10dip',
		bottom : '20dip',
		layout : 'vertical'
	});

	var image = Ti.UI.createImageView({
		image : imageUrl,
		width : '100%',
		height : '100%'
	});

	view.add(image);

	$.scrollView.add(view);

}

function extractSectionNamesAndOrder(rawPostJson) {
	var allSectionNames = {};
	for (var i = 0; i < rawPostJson.length; i++) {
		if (allSectionNames.hasOwnProperty(rawPostJson[i].section) == false) {
			allSectionNames[rawPostJson[i].section] = convertSectionOrderToInteger(rawPostJson[i].section_order);
		}
	}
	return allSectionNames;
}

function convertSectionOrderToInteger(section_order) {
	if (section_order == true) {
		return 1;
	} else if (section_order == false) {
		return 0;
	} else {
		return parseInt(section_order);
	}
}

function orderSectionNameBySectionOrder(unorderedSectionNames) {
	var sectionNamesAray = covertHashMapIntoArrayOfObject(unorderedSectionNames);
	sectionNamesAray.sort(function(a, b) {
		return a.value - b.value;
	});
	return sectionNamesAray;
}

function covertHashMapIntoArrayOfObject(hashMap) {
	var arrayOfObjects = new Array();
	for (var each_key in hashMap) {
		arrayOfObjects.push({
			key : each_key,
			value : hashMap[each_key]
		});
	}
	return arrayOfObjects;
}

function displaySectionList(orderedSectionList, rawJson) {
	var sectionTitles = [];
	for (var i = 0; i < orderedSectionList.length; i++) {
		sectionTitles.push(orderedSectionList[i].key);
	}
	for (var i = 0; i < orderedSectionList.length; i++) {
		var view = Titanium.UI.createView({
			height : '10%',
			left : '12dip',
			right : '12dip',
			top : '5dip',
			bottom : '5dip',
			backgroundColor : gradientColors[gradientColorsCount],
			layout : 'vertical'
		});
		addEvent(view, orderedSectionList[i].key, rawJson);

		var label = Titanium.UI.createLabel({
			color : 'white',
			// verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			textAlign : 'center',
			height : Ti.UI.FILL,
			font : {
				fontSize : 28,
				fontWeight : 'bold'
			},
			text : orderedSectionList[i].key
		});
		view.add(label);

		gradientColorsCount++;
		$.scrollView.add(view);
	}
}

function addEvent(view, title, rawJson) {
	view.addEventListener("click", function() {
		var controller = Alloy.createController('sectionLanding', eval([args[0], rawJson["posts"], title, view.backgroundColor]));
		Alloy.Globals.navController.open(controller);
	});
}

function jackOfAllTrades() {
	addSpinner();
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		var rawJson = eval(returnedData.data.component);
		setPageTitle(rawJson["name"]);
		insertComponentPicture(args[1]);
		var unorderedSectionNames = extractSectionNamesAndOrder(rawJson["posts"]);
		var orderedSectionList = orderSectionNameBySectionOrder(unorderedSectionNames);
		displaySectionList(orderedSectionList, rawJson);
		fixSpacingIOS();
		removeSpinner();
	});
}

function fixSpacingIOS(){
	if (OS_IOS){
		$.scrollView.bottom = "48dip";
		$.scrollView.top="0"; 
		
	}
}

jackOfAllTrades();
