var args = arguments[0] || {};
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
          "description": "Such a great exhibit. Check it out!",
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
          "description": "Such a great exhibit. Check it out!",
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
}; // Extract to required file

var exhibitIndex = 0;
var numOfExhibits = json.data.museum.exhibits.length;
var exhibitViews = [];
var componentsInExhibit = [];
var componentsRow = createPlainRow();

var tableData = [];

var componentHeading = Ti.UI.createLabel({
	color : 'black',
	font : {
		fontFamily : 'Arial',
		fontSize : 22,
		fontWeight : 'bold'
	},
	text : componentHeading,
	textAlign : 'center',
});// XML
	

var scrollView = Ti.UI.createScrollView({
	layout: 'horizontal',
	//pagingControlTimeout : 0, // Set to less than or equal to 0 to disable timeout, to keep controls displayed.
	height : '100%',
	showHorizontalScrollIndicator: true,
	width: '100%',
	contentWidth: 'auto',
	scrollType: 'horizontal',
	horizontalWrap: false
});// XML

var exhibitsSwipeableView = Ti.UI.createView({	
	top: '5%',
	backgroundColor: 'cyan'
});	// XML

// simulate data from wordpress using Jess' model


function openComponent(e){
	var componentWindow = Alloy.createController('componentlanding').getView();
	componentWindow.componentId = e.source.componentId;
	alert("component Id: "+e.source.componentId);
	componentWindow.open();  
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
function createPlainRow() {
	var row = Ti.UI.createTableViewRow({
		// height: (Ti.Platform.displayCaps.platformHeight / 8),
		height : '190dp',
		top: '10dp',
		backgroundColor : 'white',
	});
	return row;
}// XML

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
function createHeadingRow() {
	var row = Ti.UI.createTableViewRow({
		// height: (Ti.Platform.displayCaps.platformHeight / 8),
		height : '50dp',
		backgroundColor : 'cyan',
	});
	return row;
}// XML


function createExhibitsCarousel(exhibits){
	// These parts should be defined by TSS
	var row = createPlainRow();
	
	for(i = exhibits.length -1 ; i >= 0; i--){
		exhibitViews[i] = createLabeledPicView(exhibits[i], '22');		// will later say 'exhibit', and will create the pic item of that class
		exhibitsSwipeableView.add(exhibitViews[i]);
		exhibitViews[i].hide();
		//$.addClass(exhibitImages[i], "exhibitImage"); 
	}
	exhibitViews[0].show();
	row.add(exhibitsSwipeableView);
	tableData.push(row);
}

// Extract into a service in the Lib folder -> make into a widget when we write this in XML
function createLabeledPicView(item, type){
	var itemContainer = Ti.UI.createView();
	
	var image = Ti.UI.createImageView({
		height: '100%',
		width: '100%'
	});//$.addClass(exhibitImages[i], "exhibitImage"); 
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
	var headingRow = createHeadingRow();	

	componentHeading.text = componentHeadingText;
	headingRow.add(componentHeading);
	tableData.push(headingRow);
}

function createComponentsScrollView(exhibits){

	var image;
	componentsRow.height = 100;
	var component;
	var components;
	
	for (var i = 0; i < exhibits.length; i++){
		componentsInExhibit[i] = Ti.UI.createView({
			layout: 'horizontal',
			horizontalWrap: false,
			width: 'auto'
		});// TSS CLASS

		for(var j = 0; j< exhibits[i].components.length; j++){
			component = createLabeledPicView(exhibits[i].components[j], '12');	// Later type will be 'component' and that wil be linked to the TSS class
			component.left = 5;
			component.right = 5;
			component.width = 200;
			component.componentId = exhibits[i].components[j].id;
			component.addEventListener('click', openComponent);
			componentsInExhibit[i].add(component);
		}			
		scrollView.add(componentsInExhibit[i]);
		componentsInExhibit[i].width = 0;
	}
	componentsInExhibit[0].width = 'auto';
	componentsRow.add(scrollView);
	tableData.push(componentsRow);
}

function setExhibitText(text){
	var textRow = createHeadingRow();
	
	var label = Ti.UI.createLabel({
		color : 'black',
		font : {
			fontFamily : 'Arial',
			fontSize : 12,
			fontWeight : 'bold'
		},
		width: 'auto',
		left: 20,
		horizontalWrap: true,
		text : text
	});
	textRow.top = 20;
	textRow.height = '100%';
	textRow.add(label);
	textRow.height = 120;
	tableData.push(textRow);
} // XML

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
		}
	}
	//alert("swipe!");
}

function removeComponents(index){
	if(componentsInExhibit.length>0){
		componentsInExhibit[index].width = 0;
	}
	scrollView.contentWidth = 0;
}

function showComponents(index){
	if(index<componentsInExhibit.length){
		componentsInExhibit[index].width = 'auto';
		//alert("At index "+index+" the number of children is: "+componentsInExhibit[index].children.length);
		scrollView.contentWidth = componentsInExhibit[index].size.width;
	}
}



//createExhibitsCarousel2("All Exhibits", json.data.museum.exhibits);
createExhibitsCarousel(json.data.museum.exhibits);
createComponentHeading("Check out our Stations");
createComponentsScrollView(json.data.museum.exhibits);

setExhibitText("Lorem ipsem antrhhc buert sdjr bejsu ache thfk ook nsj rhjejjc kkdjf eifj nivi rjf,\nAsd ehw tn iidjs thne shcu ndusr.");

var tableView = Ti.UI.createTableView({
	// backgroundColor : '#07B5BE',
	backgroundColor : 'white',
	data : tableData,
	width: '90%',
	left: '5%'
});

exhibitsSwipeableView.addEventListener('swipe', swipeHandler);
$.exhibits.title = "Exhibits";
$.exhibits.add(tableView);

