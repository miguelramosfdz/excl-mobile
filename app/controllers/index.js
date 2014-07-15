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

var reload = function() {
	var controller = Alloy.createController("index");
	return controller;
};

function fixIpadSpacing() {
	if (Titanium.Platform.osname == 'ipad') {
		$.bottomButtonContainer.bottom = "48dip";
	}
}

$.navBar.hideBackBtn();
retrieveJson(url, initializeWithJSON, this);
fixIpadSpacing();

function setAnalyticsPageTitle(title) {
	analyticsPageTitle = title;
}

function getAnalyticsPageTitle() {
	return analyticsPageTitle;
}

function setAnalyticsPageLevel(level) {
	analyticsPageLevel = level;
}

function getAnalyticsPageLevel() {
	return analyticsPageLevel;
}

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

function reloadWithJSON(json, controller) {
	populateWindow(json);
}

function populateWindow(json) {
	var components = Alloy.Collections.instance('component');
	for (var i = 0; i < json.data.museum.exhibits.length; i++) {
		var exhibit = json.data.museum.exhibits[i];
		for (var j = 0; j < exhibit.components.length; j++) {
			component = exhibit.components[j];
			var componentModel = Alloy.createModel('component');
			componentModel.set({
				'id' : component.id,
				'name' : component.name,
				'exhibit' : exhibit.name,
				'component_order' : component.component_order,
				'exhibit_order' : exhibit.exhibit_order
			});
			components.add(componentModel);
		}
	}
	createExhibitsCarousel(json.data.museum.exhibits);
	createExhibitSelect(json.data.museum.exhibits);
	createcollapsibleComponentView();
	createComponentsScrollView(json.data.museum.exhibits);
	setExhibitText(exhibitText[0]);
}

function clearAll() {

}

function createExhibitsCarousel(exhibits) {
	$.exhibitsCarousel.removeView($.placeholder);
	// This is an android hack

	/*exhibits.sort(function(a, b) {
	return a.exhibit_order > b.exhibit_order;
	});*/

	//exhibits.order_number.sort();
	for ( i = 0; i < exhibits.length; i++) {
		exhibitText[i] = exhibits[i].long_description;
		var exhibitView;

		if (OS_IOS) {
			exhibitView = createExhibitsImageIOS(exhibits[i], (i + 1 + " of " + exhibits.length));
		} else if (OS_ANDROID) {
			exhibitView = createExhibitsImageAndroid(exhibits[i], (i + 1 + " of " + exhibits.length));
			exhibitView.addEventListener("click", function(e) {
				onExhibitsClick(exhibits);
			});
		}
		$.exhibitsCarousel.addView(exhibitView);

		// Change the current page to force the arrows to appear
		if (i <= 1) {
			$.exhibitsCarousel.currentPage = i;
		}
	}

	// Change the current page back to 0
	$.exhibitsCarousel.currentPage = 0;
	if (OS_IOS) {
		//Android doesn't respond to singletap event, so the Android event listener is added above
		$.exhibitsCarousel.addEventListener("singletap", function(e) {
			onExhibitsClick(exhibits);
		});
	}
	$.exhibitsCarousel.addEventListener("scrollend", function(e) {
		onExhibitsScroll(e, exhibits);
	});
}

function createExhibitsImageIOS(exhibit, pageXofYtext) {
	var viewConfig = {
		backgroundColor : "#253342",
		width : Ti.UI.FILL,
		image: '/images/700x400.png',
		itemId : exhibit.id
	};
	if (exhibit.exhibit_image) {
		viewConfig.image = exhibit.exhibit_image;
	}
	var exhibitView = Ti.UI.createImageView(viewConfig);
	exhibitView.add(createExhibitTitleLabel(exhibit.name, pageXofYtext));
	return exhibitView;
}

function createExhibitsImageAndroid(exhibit, pageXofYtext) {

	var itemContainer = Ti.UI.createView({
		itemId : exhibit.id
	});
	var image = Ti.UI.createImageView({
		backgroundColor : "#253342",
		width : Ti.UI.FILL,
		image : '/images/700x400.png',
	});
	var clickCatcher = Ti.UI.createView({
		itemId : exhibit.id
	});
	image.image = exhibit.image;

	itemContainer.add(image);
	itemContainer.add(createTitleLabel(exhibit.name, '25dip', pageXofYtext));
	itemContainer.add(clickCatcher);
	return itemContainer;
}

function createExhibitTitleLabel(name, pageXofYtext) {
	var titleLabelView = Ti.UI.createView({
		top : 0,
		height : Ti.UI.SIZE,
		backgroundColor : '#000',
		opacity : 0.6
	});
	var label = Ti.UI.createLabel({
		top : 0,
		left : "3%",
		text : name,
		color : 'white',
		horizontalWrap : false,
		font : {
			fontFamily : 'Arial',
			fontSize : '24dip',
			fontWeight : 'bold'
		}
	});
	titleLabelView.add(label);

	if (pageXofYtext) {
		var pageXofYtextLabel = Ti.UI.createLabel({
			top : "10%",
			right : "3%",
			text : pageXofYtext,
			color : 'white',
			horizontalWrap : false,
			font : {
				fontFamily : 'Arial',
				fontSize : '18dip',
				fontWeight : 'normal'
			}
		});
		titleLabelView.add(pageXofYtextLabel);
	}

	return titleLabelView;
}

function createTitleLabel(name, type, pageXofYtext) {
	var titleLabel = Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.6,
		height : '15%',
		top : 0
	});
	//$.addClass(exhibitImages[i], "exhibitTitleShadow");

	var label = Ti.UI.createLabel({
		text : name,
		top : 0,
		left : 10,
		color : 'white',
		font : {
			fontFamily : 'Arial',
			fontSize : type,
			fontWeight : 'bold'
		}
	});
	//$.addClass(label, "myLabel");
	titleLabel.add(label);

	if (pageXofYtext) {
		var pageXofYtextLabel = Ti.UI.createLabel({
			top : "10%",
			right : "3%",
			text : pageXofYtext,
			color : 'white',
			horizontalWrap : false,
			font : {
				fontFamily : 'Arial',
				fontSize : '18dip',
				fontWeight : 'normal'
			}
		});
		titleLabel.add(pageXofYtextLabel);
	}

	return titleLabel;
}

function createcollapsibleComponentView() {
	$.collapsibleComponentView.hidden = true;
	$.collapsibleComponentView.height = 0;
}

function onExhibitsClick(exhibits) {
	if ($.collapsibleComponentView.hidden == true) {
		$.collapsibleComponentView.hidden = false;
		var pageIndex = $.exhibitsCarousel.currentPage;
		$.exhibitSelectLabel.text = "Go Back";
		$.collapsibleInfoLabel.text = exhibits[pageIndex].long_description;

		$.exhibitInfoView.animate({
			opacity : 0,
			duration : 300
		});

		var slideOut = Ti.UI.createAnimation({
			height : '210dip',
			duration : 300,
			curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
		});

		setTimeout(function() {
			$.exhibitInfoView.height = 0;
		}, 300);

		$.collapsibleComponentView.height = '210dip';
		$.collapsibleComponentView.animate(slideOut);
	} else {
		$.collapsibleComponentView.hidden = true;
		$.exhibitSelectLabel.text = "Explore This Exhibit!";
		$.exhibitInfoView.animate({
			opacity : 1,
			duration : 300
		});

		$.exhibitInfoView.height = Ti.UI.SIZE;
		setTimeout(function() {
			$.exhibitInfoView.height = Ti.UI.SIZE;
		}, 300);

		var slideIn = Ti.UI.createAnimation({
			height : '0dip',
			duration : 300,
			curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		$.collapsibleComponentView.animate(slideIn);
	}
}

function onExhibitsScroll(e, exhibits) {
	componentsInExhibit[currExhibitId].width = 0;
	componentsInExhibit[e.view.itemId].width = Ti.UI.SIZE;
	currExhibitId = e.view.itemId;
	var index = $.exhibitsCarousel.currentPage;
	$.exhibitInfoLabel.text = exhibits[index].description;
	$.collapsibleInfoLabel.text = exhibits[index].long_description;
	$.exhibitSelectLabel.text = "Explore This Exhibit!";

	setTimeout(function() {
		$.exhibitInfoView.height = Ti.UI.SIZE;
	}, 150);

	$.exhibitInfoView.animate({
		opacity : 1,
		duration : 150
	});

	$.collapsibleComponentView.animate({
		height : 0,
		duration : 150,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
	});
	$.collapsibleComponentView.hidden = true;
}

function createComponentsScrollView(exhibits) {
	currExhibitId = exhibits[0].id;

	for (var i = 0; i < exhibits.length; i++) {
		componentsInExhibit[exhibits[i].id] = Ti.UI.createView({
			layout : 'horizontal',
			horizontalWrap : false,
			width : Ti.UI.SIZE
		});

		/*exhibits[i].components.sort(function(a, b) {
		 return a.component_order > b.component_order;
		 });*/

		for (var j = 0; j < exhibits[i].components.length; j++) {
			var component = createLabeledPicView(exhibits[i].components[j], '15dip');

			component.left = 3;
			component.width = '300dip';
			component.id = exhibits[i].components[j].id;
			component.addEventListener('click', openComponent);
			/*
			 component.sort(function(a,b){
			 return a.component_order > b.component_order;
			 });*/
			componentsInExhibit[exhibits[i].id].add(component);
		}

		$.componentScrollView.add(componentsInExhibit[exhibits[i].id]);
		componentsInExhibit[exhibits[i].id].width = 0;
	}
	componentsInExhibit[currExhibitId].width = Ti.UI.SIZE;
}

function openComponent(e) {
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

function createLabeledPicView(item, type) {
	var itemContainer = Ti.UI.createView();
	var image = Ti.UI.createImageView({
		height : '100%',
		width : '100%'
	});
	var clickCatcher = Ti.UI.createView({
		itemId : item.id
	});
	image.image = item.image;

	itemContainer.add(image);
	itemContainer.add(createTitleLabel(item.name, type));
	itemContainer.add(clickCatcher);
	return itemContainer;
}

function createExhibitSelect(exhibits) {
	$.exhibitSelect.addEventListener('click', function(e) {
		onExhibitsClick(exhibits);
	});
}

function setExhibitText(text) {
	$.exhibitInfoLabel.text = text;
}

exports.reload = reload;
