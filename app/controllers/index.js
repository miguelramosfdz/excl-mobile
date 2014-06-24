var args = arguments[0] || {};
var dataRetriever = require('dataRetriever/dataRetriever');
var url = Alloy.Globals.rootWebServiceUrl;

var exhibitIndex = 0;
var numOfExhibits;
var exhibitViews = [];
var componentsInExhibit = [];
var exhibitText = [];
var loaded = false;

/*
var museum = Alloy.createModel("museum");
museum.fetch();
*/
//Ti.API.info("\n\n\n\n\n\n"+JSON.stringify(data)+"\n\n\n\n\n\n\n");

function trackHomescreen(){
	Alloy.Globals.analyticsController.trackScreen("Exhibit Landing");
}

trackHomescreen();

function retrieveJson(jsonURL) {
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			populateWindow(returnedData);
		}
	});
}


function openComponent(e){
	var componentWindow = Alloy.createController('componentlanding', e.source.itemId).getView();
	Alloy.Globals.navController.open(componentWindow);
	Alloy.Globals.analyticsController.trackScreen("Component Landing");
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
			fontFamily : 'Arial',
			fontSize : type,
			fontWeight : 'bold'
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
	if(numOfExhibits>0){
		exhibitIndex = index;
		numOfExhibits = numOfItems;
		if(direction = "right"){
			removeComponents(exhibitIndex);		// Incrememnt Index
			exhibitIndex= (exhibitIndex+1)%numOfExhibits;
			showComponents(exhibitIndex);
			setExhibitText(exhibitText[exhibitIndex]);
		}else if(direction = "left"){
			removeComponents(exhibitIndex);
			exhibitIndex--;						// Decrement index 
			if(exhibitIndex=-1)
				exhibitIndex=numOfExhibits -1;
			showcomponents(exhibitIndex);
			setExhibitText(exhibitText[exhibitIndex]);
		}
	}
}
/*
// Break into two more functions
function swipeHandler2(e){
	if(numOfExhibits>0){
		if(e.direction = 'right'){
			exhibitViews[exhibitIndex].hide();
			removeComponents(exhibitIndex);
			
			// Incrememnt Index
			exhibitIndex= (exhibitIndex+1)%numOfExhibits;
			
			// Show new exhibit and it's 
			exhibitViews[exhibitIndex].show();
			showComponents(exhibitIndex);
			setExhibitText(json.data.museum.exhibits[exhibitIndex].description);
		}
		else if(e.direction = 'left'){
			exhibitViews[exhibitIndex].hide();
			removeComponents(exhibitIndex);
			exhibitIndex--;
			
			// Decrement index 
			if(exhibitIndex=-1)
				exhibitIndex=numOfExhibits -1;
			
			// Show new Exhibit and it's contents
			exhibitViews[exhibitIndex].show();
			showcomponents(exhibitIndex);
			setExhibitText(json.data.museum.exhibits[exhibitIndex].description);
		}
	}
}
*/
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
			totalComponentWidth = 225*componentsInExhibit.length; //225 is hard-coded above as the width of each component
			componentsInExhibit[index].width = totalComponentWidth + 'dip';
		}
		$.componentScrollView.contentWidth = componentsInExhibit[index].size.width;
	}
}


retrieveJson(url);


//populateWindow(json);
function populateWindow(json){
	numOfExhibits = json.data.museum.exhibits.length;
	createExhibitsCarousel(json.data.museum.exhibits);
	createComponentHeading("Check out our Stations");
	createComponentsScrollView(json.data.museum.exhibits);
	setExhibitText(exhibitText[0]);
	loaded = true;
}

function openPostLanding(e){
	var componentWindow = Alloy.createController('postlanding').getView();
	Alloy.Globals.navController.open(componentWindow);
	Alloy.Globals.analyticsController.trackScreen("The Landing");
}

while(exhibitViews.length = 0);
//var componentWindow = Alloy.createController('componentlanding', e.source.itemId).getView();
Alloy.Globals.navController.open($.index);