var args = arguments[0] || {};

var dataRetriever = require('dataRetriever/dataRetriever');
var LoadingSpinner = require('loadingSpinner/loadingSpinner');

var spinner = new LoadingSpinner();
var url = Alloy.Globals.rootWebServiceUrl;

var exhibitText = [];
var componentsInExhibit = [];
var currExhibitId;
var analyticsPageTitle = "";
var analyticsPageLevel = "";

var setAnalyticsPageTitle = function(title) { analyticsPageTitle = title; };
var getAnalyticsPageTitle = function() { return analyticsPageTitle; };
var setAnalyticsPageLevel = function(level) { analyticsPageLevel = level; };
var getAnalyticsPageLevel = function() { return analyticsPageLevel; };
exports.setAnalyticsPageTitle = setAnalyticsPageTitle;
exports.getAnalyticsPageTitle = getAnalyticsPageTitle;
exports.setAnalyticsPageLevel = setAnalyticsPageLevel;
exports.getAnalyticsPageLevel = getAnalyticsPageLevel;

retrieveJson(url, initializeWithJSON);
Alloy.Globals.navController.open(this);


function retrieveJson(jsonURL, callback) {
	spinner.addTo($.exhibitsCarousel);
	spinner.show();
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			callback(returnedData);
			spinner.hide();
		}
	});
}

function initializeWithJSON(json) {
	Alloy.Globals.analyticsController.setTrackerID(json.data.museum.tracking_id);
	Alloy.Globals.analyticsController.trackEvent("Landing Pages", "Open Page", "Exhibit Landing", 1);	
	populateWindow(json);
}

function populateWindow(json){
	var components = Alloy.Collections.instance('component');
	for (var i = 0; i < json.data.museum.exhibits.length; i++) {
		var exhibit = json.data.museum.exhibits[i];
		for (var j = 0; j < exhibit.components.length; j++) {
			component = exhibit.components[j];
			var componentModel = Alloy.createModel('component');
			componentModel.set({ 'id' : component.id, 'name': component.name, 'exhibit': exhibit.name });
			components.add(componentModel);
		}
	}
	createExhibitsCarousel(json.data.museum.exhibits);
	createCollapsibleInfoView();
	createComponentsScrollView(json.data.museum.exhibits);
	setExhibitText(exhibitText[0]);
}

function createExhibitsCarousel(exhibits){
	$.exhibitsCarousel.removeView($.placeholder); // This is an android hack
	for(i=0; i<exhibits.length; i++){
		exhibitText[i] = exhibits[i].description;
		var viewConfig = { 
			backgroundColor: "#000",
			width: Ti.UI.FILL,
		 	image: '/images/700x300.png',
		 	itemId: exhibits[i].id
		};
		if(exhibits[i].image) {
			viewConfig.image = exhibits[i].image;	
		}
		var imageView = Ti.UI.createImageView(viewConfig);
		imageView.add(createExhibitTitleLabel(exhibits[i].name));
		$.exhibitsCarousel.addView(imageView);		
	}
	$.exhibitsCarousel.addEventListener("singletap", function(e){ onExhibitsClick(exhibits); });
	$.exhibitsCarousel.addEventListener("scrollend", onExhibitsScroll);
}

function createExhibitTitleLabel(name){
	var titleLabelView = Ti.UI.createView({
		top: 0,
		height: '10%',
		backgroundColor: 'black',
		opacity: 0.6
	});
	var label = Ti.UI.createLabel({
		top: 0,
		left: "5%",
		text: name,
		color: 'white',
		horizontalWrap: false,
		font: {
			fontFamily : 'Arial',
			fontSize : '25dip',
			fontWeight : 'bold'
		}
	});
	titleLabelView.add(label);
	return titleLabelView;
}

function createCollapsibleInfoView(){
	$.collapsibleInfoView.size = 0;
	$.collapsibleInfoLabel.font = {
		fontFamily : 'Arial',
		fontSize : '12dip',
	};
}

function onExhibitsClick(exhibits){
	alert("Click detected");
	var index = $.exhibitsCarousel.currentPage;
	$.collapsibleInfoLabel.text = exhibits[index].long_description;
	$.collapsibleInfoView.height = "40%";
	
}

function onExhibitsScroll(e) {
	componentsInExhibit[currExhibitId].width = 0;
	componentsInExhibit[e.view.itemId].width = Ti.UI.SIZE;
	currExhibitId = e.view.itemId;
}

function createComponentsScrollView(exhibits){
	currExhibitId = exhibits[0].id;
	for (var i=0; i<exhibits.length; i++){
		componentsInExhibit[exhibits[i].id] = Ti.UI.createView({
			layout: 'horizontal',
			horizontalWrap: false,
			width: 'auto'
		});
		for(var j=0; j<exhibits[i].components.length; j++){
			var component = createLabeledPicView(exhibits[i].components[j], '15dip');
			component.left = 5;
			component.right = 5;
			component.width = '225dip';
			component.id = exhibits[i].components[j].id;
			component.addEventListener('click', openComponent);
			componentsInExhibit[exhibits[i].id].add(component);
		}			
		$.componentScrollView.add(componentsInExhibit[exhibits[i].id]);
		componentsInExhibit[exhibits[i].id].width = 0;
	}
	componentsInExhibit[currExhibitId].width = Ti.UI.SIZE;
}

function openComponent(e){
	var components = Alloy.Collections.instance('component');
	var component = components.where({"id": e.source.itemId})[0];
	var controller = Alloy.createController('componentlanding', component);
	var analyticsTitle = component.getScreenName();
	var analyticsLevel = "Component Landing";
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
	Alloy.Globals.analyticsController.trackScreen(analyticsTitle, analyticsLevel);
	Alloy.Globals.analyticsController.trackEvent("Landing Pages", "Open Page", analyticsLevel, 1);	
}

function createLabeledPicView(item, type){
	var itemContainer = Ti.UI.createView();
	var image = Ti.UI.createImageView({
		height: '100%',
		width: '100%',
		itemId: item.id
	});
	image.image = item.image;
	
	itemContainer.add(image);
	itemContainer.add(createTitleLabel(item.name, type));
	return itemContainer;
}

function createTitleLabel(name, type){
	var titleLabel = Ti.UI.createView({
		backgroundColor: 'black',
		opacity: 0.5,
		height: '20%',
		top: 0
	});
	//$.addClass(exhibitImages[i], "exhibitTitleShadow"); 
	
	var label = Ti.UI.createLabel({
		text: name,
		top: 0,
		left: 10,
		color: 'white',
		font: {
			fontFamily: 'Arial',
			fontSize: type,
			fontWeight: 'bold'
		}
	});
	//$.addClass(label, "myLabel"); 
	titleLabel.add(label);
	return titleLabel;
}

function setExhibitText(text){
	$.exhibitInfoLabel.text = text;
} 
