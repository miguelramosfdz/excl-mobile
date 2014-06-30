var args = arguments[0] || {};
var dataRetriever = require('dataRetriever/dataRetriever');
var url = Alloy.Globals.rootWebServiceUrl;

var LoadingSpinner = require('loadingSpinner/loadingSpinner');
var spinner = new LoadingSpinner();

var exhibitIndex = 0;
var numOfExhibits;
var exhibitViews = [];
var exhibitText = [];
var loaded = false;
var componentsInExhibit = [];

function retrieveJson(jsonURL, callback) {
	spinner.addTo($.exhibitsSwipeableRow);
	spinner.show();
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			callback(returnedData);
			spinner.hide();
		}
	});
}

function openComponent(e){
	var components = Alloy.Collections.instance('component');
	var component = components.where({"id": e.source.itemId})[0];
	Alloy.Globals.navController.open(Alloy.createController('componentlanding', component));
	Alloy.Globals.analyticsController.trackScreen(component.getScreenName());
}

function openExhibitInfo(e){
	//alert("will open additional Exhibit info"); 
}

function createExhibitsCarousel(exhibits){
	$.exhibitsSwipeableCarousel.addToRotateFunc(rotateHandler);
	for(i = 0 ; i < exhibits.length; i++){
		exhibitText[i] = exhibits[i].description;
		$.exhibitsSwipeableCarousel.addItem(exhibits[i], openExhibitInfo);
		numOfExhibits++;
	}
}

// Extract into a service in the Lib folder -> make into a widget when we write this in XML
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

function createComponentHeading(componentHeadingText){
	$.componentHeading.text = componentHeadingText;
}

function createComponentsScrollView(exhibits){

	var image;
	var component;

	for (var i = 0; i < exhibits.length; i++){
		componentsInExhibit[i] = Ti.UI.createView({
			layout: 'horizontal',
			horizontalWrap: false,
			width: 'auto'
		});// TSS CLASS

		for(var j = 0; j< exhibits[i].components.length; j++){
			component = createLabeledPicView(exhibits[i].components[j], '15dip');	// Later type will be 'component' and that wil be linked to the TSS class
			component.left = 5;
			component.right = 5;
			component.width = '225dip';
			component.id = exhibits[i].components[j].id;
			component.addEventListener('click', openComponent);
			componentsInExhibit[i].add(component);
		}			
		$.componentScrollView.add(componentsInExhibit[i]);
		componentsInExhibit[i].width = 0;
	}
	componentsInExhibit[0].width = 'auto';
}

function setExhibitText(text){
	$.exhibitInfoLabel.text = text;
} 

function rotateHandler(direction, index, numOfItems){
	if(numOfExhibits > 0){
		exhibitIndex = index;
		numOfExhibits = numOfItems;
		if(direction == "right"){
			removeComponents(exhibitIndex);		// Increment Index
			exhibitIndex = (exhibitIndex + 1) % numOfExhibits;
			showComponents(exhibitIndex);
			setExhibitText(exhibitText[exhibitIndex]);
		}else if(direction == "left"){
			removeComponents(exhibitIndex);
			exhibitIndex--;
			if(exhibitIndex == -1) {
				exhibitIndex = numOfExhibits - 1;
			}
			showComponents(exhibitIndex);
			setExhibitText(exhibitText[exhibitIndex]);
		}
	}
}

function removeComponents(index){
	if(componentsInExhibit.length>0){
		componentsInExhibit[index].width = 0;
	}
	$.componentScrollView.contentWidth = 0;
}

function showComponents(index){
	if(index<componentsInExhibit.length){
		if (OS_ANDROID){
			componentsInExhibit[index].width = 'auto';
		}
		else if (OS_IOS){
			componentsInExhibit[index].width = Ti.UI.SIZE;
		}
		$.componentScrollView.contentWidth = componentsInExhibit[index].size.width;
	}
}

retrieveJson(url, initializeWithJSON);

function initializeWithJSON(json) {
	Alloy.Globals.analyticsController.setTrackerID(json.data.museum.tracker_id);
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

	numOfExhibits = json.data.museum.exhibits.length;
	createExhibitsCarousel(json.data.museum.exhibits);
	createComponentHeading("Check out our Stations");
	createComponentsScrollView(json.data.museum.exhibits);
	setExhibitText(exhibitText[0]);
	loaded = true;
}

// while(exhibitViews.length == 0); // WHAT IS THIS SUPOSED TO DO?

//var componentWindow = Alloy.createController('componentlanding', e.source.itemId).getView();
Alloy.Globals.navController.open(this);
