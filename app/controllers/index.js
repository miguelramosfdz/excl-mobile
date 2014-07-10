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
	$.navBar.setPageTitle("Choose an Exhibit");
	var components = Alloy.Collections.instance('component');
	for (var i = 0; i < json.data.museum.exhibits.length; i++) {
		var exhibit = json.data.museum.exhibits[i];
		for (var j = 0; j < exhibit.components.length; j++) {
			component = exhibit.components[j];
			var componentModel = Alloy.createModel('component');
			componentModel.set({ 'id' : component.id, 'name': component.name, 'exhibit': exhibit.name, "orderNo": exhibit.order_number });
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
	
	exhibits.sort(function(a,b){
		return a.order_number > b.order_number;
	});
	
	//exhibits.order_number.sort();
	for(i=0; i<exhibits.length; i++){
		exhibitText[i] = exhibits[i].description;
		var exhibitView;

		if(OS_IOS){
			exhibitView = createExhibitsImageIOS(exhibits[i]);
		}
		else if (OS_ANDROID){
			exhibitView = createExhibitsImageAndroid(exhibits[i]);
			exhibitView.addEventListener("click", function(e){ onExhibitsClick(exhibits); });
		}
		$.exhibitsCarousel.addView(exhibitView);	
		
		// Change the current page to force the arrows to appear
		$.exhibitsCarousel.currentPage = i;	
	}
	// Change the current page back to 0
	$.exhibitsCarousel.currentPage = 0;
	if (OS_IOS){
		//Android doesn't respond to singletap event, so the Android event listener is added above
		$.exhibitsCarousel.addEventListener("singletap", function(e){ onExhibitsClick(exhibits); });
	} 
	$.exhibitsCarousel.addEventListener("scrollend", function(e){ onExhibitsScroll(e, exhibits); });
}

function createExhibitsImageIOS(exhibit){
	var viewConfig = {
		backgroundColor: "#253342",
		width: Ti.UI.FILL,
	 	image: '/images/700x400.png',
	 	itemId: exhibit.id
	};
	if(exhibit.image) {
		viewConfig.image = exhibit.image;	
	}
	var exhibitView = Ti.UI.createImageView(viewConfig);
	exhibitView.add(createExhibitTitleLabel(exhibit.name));
	return exhibitView;
}

function createExhibitsImageAndroid(exhibit){
	
	var itemContainer = Ti.UI.createView({
		itemId: exhibit.id
	});
	var image = Ti.UI.createImageView({		
		backgroundColor: "#253342",
		width: Ti.UI.FILL,
	 	image: '/images/700x400.png',
	});
	var clickCatcher = Ti.UI.createView({
		itemId: exhibit.id
	});//*/
	image.image = exhibit.image;
	
	itemContainer.add(image);
	itemContainer.add(createTitleLabel(exhibit.name, '25dip'));
	itemContainer.add(clickCatcher);
	return itemContainer;
}

function createExhibitTitleLabel(name){
	var titleLabelView = Ti.UI.createView({
		top: 0,
		height: Ti.UI.SIZE,
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
	$.collapsibleInfoView.height = $.collapsibleInfoView.height; //Fixes bug on iOS where components wouldn't scroll if collapsible info collapsed
	componentsInExhibit[currExhibitId].width = 0;
	componentsInExhibit[e.view.itemId].width = Ti.UI.SIZE;
	currExhibitId = e.view.itemId;
	var index = $.exhibitsCarousel.currentPage;
	$.exhibitInfoLabel.text = exhibits[index].description;
	
	if ($.collapsibleInfoView.height != 0){
		//Collapsible view is open; must update the exhibit info
		$.collapsibleInfoLabel.text = exhibits[index].long_description;
	}
}

function createComponentsScrollView(exhibits){
	currExhibitId = exhibits[0].id;
	for (var i=0; i<exhibits.length; i++){
		componentsInExhibit[exhibits[i].id] = Ti.UI.createView({
			layout: 'horizontal',
			horizontalWrap: false,
			width: Ti.UI.SIZE
		});
		for(var j=0; j<exhibits[i].components.length; j++){
			var component = createLabeledPicView(exhibits[i].components[j], '15dip');
			component.left = 3;
			// component.right = 3;
			component.width = '300dip';
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
	var controller = Alloy.createController('componentLanding', component);
	var analyticsTitle = component.getScreenName();
	var analyticsLevel = "Component Landing";
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
	Alloy.Globals.analyticsController.trackEvent("Landing Pages", "Open Page", analyticsLevel, 1);	
}

function createLabeledPicView(item, type){
	var itemContainer = Ti.UI.createView();
	var image = Ti.UI.createImageView({
		height: '100%',
		width: '100%'
	});
	var clickCatcher = Ti.UI.createView({
		itemId: item.id
	});//*/
	image.image = item.image;
	
	itemContainer.add(image);
	itemContainer.add(createTitleLabel(item.name, type));
	itemContainer.add(clickCatcher);
	return itemContainer;
}

function createTitleLabel(name, type){
	var titleLabel = Ti.UI.createView({
		backgroundColor: 'black',
		opacity: 0.8,
		height: '15%',
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
	//$.infoRow.add($.exhibitInfoLabel);
	//$.exhibitInfoScrollView.add($.infoRow);
} 