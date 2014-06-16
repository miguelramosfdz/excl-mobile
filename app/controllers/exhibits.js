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
          "name": "How Does It Work?",
          "description": "Such a great exhibit. Check it out!",
          "image": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg",
          "components": [
            {
              "id": 12345,
              "name": "Cups and Balls",
              "image": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg"
            },
            {
              "id": 54321,
              "name": "Spinning Disc",
              "image": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg"
            }
          ]
        }, 
        {
          "id": 12345,
          "name": "How Doesn't It Work?",
          "description": "Such a great exhibit. Check it out!",
          "image": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg",
          "components": [
            {
              "id": 12345,
              "name": "Cups or Balls",
              "image": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg"
            },
            {
              "id": 54321,
              "name": "Spun Disc",
              "image": "http://2.bp.blogspot.com/-Aa7MNnxjsqc/UAaxfj35ohI/AAAAAAAANBo/VVfnQt399rQ/s1600/Dolphin.jpg"
            }
          ]
        }
      ]
    }
  }
};

var exhibitIndex = 0;
var numOfExhibits = json.data.museum.exhibits.length;
var exhibitViews = [];
var componentsInExhibit = [];
var componentsRow = createPlainRow();
var tableData = [];

var scrollView = Ti.UI.createScrollView({
	layout: 'horizontal',
	//pagingControlTimeout : 0, // Set to less than or equal to 0 to disable timeout, to keep controls displayed.
	height : '100%',
	showHorizontalScrollIndicator: true,
	width: '100%',
	contentWidth: 'auto',
	scrollType: 'horizontal',
	horizontalWrap: false
});// Can Do in XML

// simulate data from wordpress using Jess' model

// Modify with new MODULE methods
function openComponent(e){
		
	var componentWindow = Alloy.createController('componentlanding').getView();
	componentWindow.open();  
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
function createPlainRow() {
	var row = Ti.UI.createTableViewRow({
		// height: (Ti.Platform.displayCaps.platformHeight / 8),
		height : '190dp',
		top: '10dp',
		backgroundColor : 'grey',
	});
	return row;
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
function createHeadingRow() {
	var row = Ti.UI.createTableViewRow({
		// height: (Ti.Platform.displayCaps.platformHeight / 8),
		height : '50dp',
		backgroundColor : 'blue',
	});
	return row;
}

function createExhibitsCarousel(exhibits){
	// These parts should be defined by TSS
	var row = createPlainRow();
	
	var view = Ti.UI.createView({	
		top: '5%',
		backgroundColor: 'red'
	});	// ADD THIS PART TO XML ^^
	
	for(i = exhibits.length -1 ; i >= 0; i--){
		exhibitViews[i] = createLabeledPicView(exhibits[i]);
		view.add(exhibitViews[i]);
		exhibitViews[i].hide();
		//$.addClass(exhibitImages[i], "exhibitImage"); 
	}
	view.addEventListener('swipe', swipeHandler);
	exhibitViews[0].show();
	row.add(view);
	tableData.push(row);
}

function swipeHandler(e){
	if(numOfExhibits>0){
		if(e.direction = 'right'){
			exhibitViews[exhibitIndex].hide();
			removeComponents();
			exhibitIndex= (exhibitIndex+1)%numOfExhibits;
			exhibitViews[exhibitIndex].show();
			showComponents(exhibitIndex);
		}
		else if(e.direction = 'left'){
			exhibitViews[exhibitIndex].hide();
			removeComponents();
			exhibitIndex--;
			if(exhibitIndex=-1)
				exhibitIndex=numOfExhibits -1;
				
			exhibitViews[exhibitIndex].show();
			showcomponents(exhibitIndex);
		}
	}
	//alert("swipe!");
}

function removeComponents(){
	if(scrollView.children.length>0)
		scrollView.removeAllChildren();
}

function showComponents(index){
	if(index<componentsInExhibit.length);
		//scrollView.add(componentsInExhibit[index].children[0]);
		alert(componentsInExhibit[index].children.length);
}

function createLabeledPicView(item){
	var itemContainer = Ti.UI.createView();
	
	var image = Ti.UI.createImageView({
		height: '100%',
		width: '100%'
	});//$.addClass(exhibitImages[i], "exhibitImage"); 
	image.image = item.image;
	
	itemContainer.add(image);
	itemContainer.add(createTitleLabel(item.name));
	return itemContainer;
}

function createTitleLabel(name){
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
			fontSize : 22,
			fontWeight : 'bold'
		}
	});
	//$.addClass(exhibitImages[i], "exhibitTitle"); 

	titleLabel.add(label);

	return titleLabel;
}

function createComponentHeading(componentHeading){
		var headingRow = createHeadingRow();	
	var heading = Ti.UI.createLabel({
		color : 'black',
		font : {
			fontFamily : 'Arial',
			fontSize : 22,
			fontWeight : 'bold'
		},
		text : componentHeading,
		textAlign : 'center',
	});
	headingRow.add(heading);
	tableData.push(headingRow);
}

function createComponentsScrollView(exhibits){

	var image;
	componentsRow.height = 100;
	var component;
	var components;
	
	for (var i = 0; i < exhibits.length; i++){
		components = Ti.UI.createView({
			layout: 'horizontal',
			horizontalWrap: false,
			width: 'auto'
		});// TSS CLASS

		for(var j = 0; j< exhibits[i].components.length; j++){
			component = createLabeledPicView(exhibits[i].components[j]);
			component.left = 5;
			component.right = 5;
			component.width = 200;
			//$.addClass blah
			component.componentId = exhibits[i].components[j].id;
			component.addEventListener('click', openComponent);
			components.add(component);
		}			
		componentsInExhibit[i] = components;
	}
	scrollView.add(componentsInExhibit[0]);
	componentsRow.add(scrollView);
	tableData.push(componentsRow);
}

function createExhibitText(text){
	var textRow = createHeadingRow();
	
	var label = Ti.UI.createLabel({
		color : 'black',
		font : {
			fontFamily : 'Arial',
			fontSize : 12,
			fontWeight : 'bold'
		},
		width: 'auto',
		horizontalWrap: true,
		text : text
	});
	textRow.top = 20;
	textRow.add(label);
	textRow.height = 120;
	tableData.push(textRow);
}



//createExhibitsCarousel2("All Exhibits", json.data.museum.exhibits);
createExhibitsCarousel(json.data.museum.exhibits);
createComponentHeading("Check out our Stations");
createComponentsScrollView(json.data.museum.exhibits);

createExhibitText("Blah blah blah blah blah blah blah blah,\nBlah blah blah.");

var tableView = Ti.UI.createTableView({
	// backgroundColor : '#07B5BE',
	backgroundColor : 'grey',
	data : tableData,
	width: '90%',
	left: '5%'
});

$.exhibits.title = "Exhibits";
$.exhibits.add(tableView);

