var args = arguments[0] || {};

var dataRetriever = require('dataRetriever/dataRetriever');
var LoadingSpinner = require('loadingSpinner/loadingSpinner');

var iconService = Alloy.Globals.setPathForLibDirectory('customCalls/iconService');
var iconService = new iconService();

var buttonService = Alloy.Globals.setPathForLibDirectory('customCalls/buttonService');
var buttonService = new buttonService();

var spinner = new LoadingSpinner();
var url = Alloy.Globals.rootWebServiceUrl;

var exhibitText = [];
var componentsInExhibit = [];
var currExhibitId;
var analyticsPageTitle = "Home";
var analyticsPageLevel = "Exhibit Landing";
var expanderButton;

function setAnalyticsPageTitle (title) { analyticsPageTitle = title; }
function getAnalyticsPageTitle () { return analyticsPageTitle; }
function setAnalyticsPageLevel (level) { analyticsPageLevel = level; }
function getAnalyticsPageLevel () { return analyticsPageLevel; }

$.navBar.hideBackBtn();
retrieveJson(url, initializeWithJSON, this);

function retrieveJson(jsonURL, callback, controller) {
	spinner.addTo($.exhibitsCarousel);
	spinner.show();
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			callback(returnedData, controller);
			spinner.hide();
		}
	});
}

function initializeWithJSON(json, controller) {
	Alloy.Globals.analyticsController.setTrackerID(json.data.museum.tracking_id);
	Alloy.Globals.analyticsController.trackEvent("Landing Pages", "Open Page", "Exhibit Landing", 1);
	Alloy.Globals.navController.open(controller);
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
	createHeadingRow(json.data.museum.exhibits);
	createExpanderButton();
	createCollapsibleInfoView();
	createComponentsScrollView(json.data.museum.exhibits);
	setExhibitText(exhibitText[0]);
}

function createExhibitsCarousel(exhibits){
	$.exhibitsCarousel.removeView($.placeholder); // This is an android hack
	for(i=0; i<exhibits.length; i++){
		exhibitText[i] = exhibits[i].description;
		var viewConfig = {
			backgroundColor: "#253342",
			width: Ti.UI.FILL,
		 	image: '/images/700x400.png',
		 	itemId: exhibits[i].id
		};
		if(exhibits[i].image) {
			viewConfig.image = exhibits[i].image;	
		}
		var imageView = Ti.UI.createImageView(viewConfig);
		imageView.add(createExhibitTitleLabel(exhibits[i].name));
		if (OS_ANDROID){
			imageView.addEventListener("click", function(e){ onExhibitsClick(exhibits); });
		}
		$.exhibitsCarousel.addView(imageView);		
	}
	if (OS_IOS){
		//Android doesn't respond to singletap event, so the Android event listener is added above
		$.exhibitsCarousel.addEventListener("singletap", function(e){ onExhibitsClick(exhibits); });
	}
	$.exhibitsCarousel.addEventListener("scrollend", function(e){ onExhibitsScroll(e, exhibits); });
}

function createExhibitTitleLabel(name){
	var titleLabelView = Ti.UI.createView({
		top: 0,
		height: '7%',
		backgroundColor: '#000',
		opacity: 0.6
	});
	var label = Ti.UI.createLabel({
		top: 0,
		left: "3%",
		text: name,
		color: 'white',
		horizontalWrap: false,
		font: {
			fontFamily : 'Arial',
			fontSize : '24dip',
			fontWeight : 'bold'
		}
	});
	titleLabelView.add(label);
	return titleLabelView;
}

function createHeadingRow(exhibits){
	$.headingRow.addEventListener('click', function(e){ onExhibitsClick(exhibits); });
}

function createExpanderButton(){
	iconService.setIcon($.expanderButton, 'expander_expand.png');
}

function createCollapsibleInfoView(){
	//$.collapsibleInfoView.size = 0;
	$.collapsibleInfoView.height = 0;
	$.collapsibleInfoLabel.font = {
		fontFamily : 'Arial',
		fontSize : '12dip',
	};
}

function onExhibitsClick(exhibits){
	if ($.collapsibleInfoView.height == 0){
		//Collapsible view is closed; toggle it open
		var index = $.exhibitsCarousel.currentPage;
		$.collapsibleInfoLabel.text = exhibits[index].long_description;
		$.collapsibleInfoView.height = Ti.UI.SIZE;
		toggleExpanderExpanded();
	}
	else{
		$.collapsibleInfoView.height = 0;
		toggleExpanderCollapsed();
	}
}

function toggleExpanderExpanded(){
	iconService.setIcon($.expanderButton, 'expander_collapse.png');
}

function toggleExpanderCollapsed(){
	iconService.setIcon($.expanderButton, 'expander_expand.png');
}

function onExhibitsScroll(e, exhibits) {
	componentsInExhibit[currExhibitId].width = 0;
	componentsInExhibit[e.view.itemId].width = Ti.UI.SIZE;
	currExhibitId = e.view.itemId;
	
	$.componentScrollView.scrollTo(0, 0);
	
	// Fixes bug on iOS where components wouldn't scroll if collapsible info collapsed
	$.collapsibleInfoView.height = $.collapsibleInfoView.height; 
	
	// If collapsible view is open, update the exhibit info
	if ($.collapsibleInfoView.height != 0){ 
		var index = $.exhibitsCarousel.currentPage;
		$.collapsibleInfoLabel.text = exhibits[index].long_description;
	}
}

function createComponentsScrollView(exhibits){
	currExhibitId = exhibits[0].id;
	for (var i=0; i<exhibits.length; i++){
		componentsInExhibit[exhibits[i].id] = Ti.UI.createView({
			layout: 'horizontal',
			horizontalWrap: false,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
		});
		for(var j=0; j<exhibits[i].components.length; j++){
			var component = createLabeledPicView(exhibits[i].components[j], '15dip');
			component.addEventListener('click', openComponent);
			componentsInExhibit[exhibits[i].id].add(component);
		}			
		$.componentScrollView.add(componentsInExhibit[exhibits[i].id]);
		componentsInExhibit[exhibits[i].id].width = 0;
	}
	componentsInExhibit[currExhibitId].width = Ti.UI.SIZE;
}

function createLabeledPicView(item, type){
	var image = Ti.UI.createImageView({
		image: item.image,
		itemId: item.id,
		height: '150dip',
		width: '300dip',
		zIndex: 0
	});
	var container = Ti.UI.createView({
		left: '3dip', 
		height: '150dip',
		width: '300dip',
	});
	container.add(image);
	container.add(createTitleLabel(item.name, type));
	return container;
}

function createTitleLabel(name, type){
	var titleLabel = Ti.UI.createView({
		backgroundColor: 'black',
		opacity: 0.6,
		top: 0,
		height: '15%',
		zIndex: 2
	});
	var label = Ti.UI.createLabel({
		text: name,
		top: 0,
		left: 10,
		color: 'white',
		font: {
			fontFamily: 'Arial',
			fontSize: type,
			fontWeight: 'bold'
		},
		zIndex: 1
	});
	titleLabel.add(label);
	return titleLabel;
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
	Alloy.Globals.analyticsController.trackEvent("Landing Pages", "Open Page", analyticsLevel, 1);	
}

function setExhibitText(text){
	$.exhibitInfoLabel.text = text;
} 
