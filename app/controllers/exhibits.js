var args = arguments[0] || {};
var dataRetriever = require('dataRetriever');
var componentID = 23;

/*
var json = {
  "status": "ok",
  "error": "Optional Error Message",
  "data": {
    "museum": {
      "name": "Children's Museum of Houston",
      "about": {
        "description": "This is the museum description here.",
        "map": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg",
        "prices": "$5/person",
        "image": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg"
      },
      "contact": {
        "website": "http://cmh.org",
        "phone": "878787878",
        "email": "me@cmh.org"
      },
      "exhibits": [
        {
          "id": 12345,
          "name": "Water Animals",
          "description": "<This area would contain the information for an exhibit>",
          "image": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg",
          "components": [
            {
              "id": 12345,
              "name": "Mammals",
              "image": "http://media.carbonated.tv/76127_story__unlikely%20friends.jpg"
            },
            {
              "id": 54321,
              "name": "Fish",
              "image": "http://upload.wikimedia.org/wikipedia/commons/9/94/Mandarin_Fish_-_mating.jpg"
            }
          ]
        }, 
        {
          "id": 12344,
          "name": "Land Animals",
          "description": "<This area would also contain the information for a different exhibit>",
          "image": "http://k-science.wikispaces.com/file/view/Lion.jpg/302874032/240x263/Lion.jpg",
          "components": [
            {
              "id": 12345,
              "name": "Mammals",
              "image": "http://oddstuffmagazine.com/wp-content/uploads/2011/09/animals03.jpg"
            },
            {
              "id": 54321,
              "name": "Reptiles",
              "image": "http://www.liveknowledgeworld.com/wp-content/uploads/2013/12/Reptiles_wallpapers_1.jpg"
            },           
            {
              "id": 54321,
              "name": "Arachnids",
              "image": "http://www.clusterflock.org/wp-content/uploads/2008/11/spider.png"
            }
          ]
        }, 
        {
          "id": 12346,
          "name": "Flying Animals",
          "description": "Such a great exhibit. Check it out!",
          "image": "http://cdn.theanimals.pics/pictures/hdwallpaperbackgrounds.info/wp-content/uploads/2012/02/Flying-Eagle-HD-Wallpaper.jpg",
          "components": [
            {
              "id": 12345,
              "name": "Birds",
              "image": "http://www.pouted.com/wp-content/uploads/2013/04/Beautiful-Birds-Wallpapers-15.jpg"
            },
            {
              "id": 54321,
              "name": "Insects",
              "image": "http://www.redorbit.com/media/uploads/2011/10/sciencepress-100411-001-617x416.jpg"
            }
          ]
        }
      ]
    }
  }
}; // Extract to required file*/

var url = "http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/13";


var json;
var exhibitIndex = 0;
var numOfExhibits;
var exhibitViews = [];
var componentsInExhibit = [];

/*
var museum = Alloy.createModel("museum");
museum.fetch();
*/
//Ti.API.info("\n\n\n\n\n\n"+JSON.stringify(data)+"\n\n\n\n\n\n\n");




function retrieveJson(jsonURL) {
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			populateWindow(returnedData);
		}
	});
}


function openComponent(e){
	//alert("Component Id: "+e.source.itemId);
	var componentWindow = Alloy.createController('componentlanding').getView();
	Alloy.Globals.navController.open(componentWindow, e.source.itemId);
}

function createExhibitsCarousel(exhibits){
	for(i = exhibits.length -1 ; i >= 0; i--){
		exhibitViews[i] = createLabeledPicView(exhibits[i], '25dp');		// will later say 'exhibit', and will create the pic item of that class
		$.exhibitsSwipeableView.add(exhibitViews[i]);
		exhibitViews[i].hide();
	}
	exhibitViews[0].show();
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
			component = createLabeledPicView(exhibits[i].components[j], '15dp');	// Later type will be 'component' and that wil be linked to the TSS class
			component.left = 5;
			component.right = 5;
			component.width = '225dp';
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

// Break into two more functions
function swipeHandler(e){
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

function removeComponents(index){
	if(componentsInExhibit.length>0){
		componentsInExhibit[index].width = 0;
	}
	$.componentScrollView.contentWidth = 0;
}

function showComponents(index){
	if(index<componentsInExhibit.length){
		componentsInExhibit[index].width = 'auto';
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
	
	setExhibitText(json.data.museum.exhibits[0].description);
}

$.exhibitsSwipeableView.addEventListener('swipe', swipeHandler);
$.exhibits.title = "Exhibits";

function openPostLanding(e){
	var componentWindow = Alloy.createController('postlanding').getView();
	Alloy.Globals.navController.open(componentWindow);
}







