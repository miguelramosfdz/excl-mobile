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
        }
      ]
    }
  }
};

var tableData = [];
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



function createExhibitsCarousel(headingText, exhibits){
	
	var row = createPlainRow();
	var headingRow = createHeadingRow();

	var heading = Ti.UI.createLabel({
		color : 'black',
		font : {
			fontFamily : 'Arial',
			fontSize : 22,
			fontWeight : 'bold'
		},
		text : headingText,
		textAlign : 'center',
	});
	headingRow.add(heading);
	tableData.push(headingRow);

	var imageWrappers = [];
	
	for (var i = 0; i < exhibits.length; i++){//imageCollection.length; i++) {
		var tempImage = Ti.UI.createImageView({
			image : exhibits[i].image,
			defaultImage : 'http://placehold.it/700x300',
			width : '100%',
			height : '100%'
		});
		var tempWrapper = Ti.UI.createView({
			width : '100%',
			height : '100%',
			backgroundColor: 'white',
			opacity: '50%',
		});
		
		var labelTint = Ti.UI.createView({
			backgroundColor: 'black',
			opacity: 0.5,
			height: '20%',
			top: 0
		});
		
		var label = Ti.UI.createLabel({
			text: exhibits[i].name,
			top: 0,
			left: 10,
			color: 'white',
			font: {
				fontFamily : 'Arial',
				fontSize : 22,
				fontWeight : 'bold'
			}
		});
		
		labelTint.add(label);
		tempWrapper.add(tempImage);
		tempWrapper.add(labelTint);
		//imageWrappers[i] = tempImage;
		imageWrappers[i] = tempWrapper;
	}

	var scrollableView = Ti.UI.createScrollableView({
		views : imageWrappers,
		showPagingControl : true,
		pagingControlTimeout : 0, // Set to less than or equal to 0 to disable timeout, to keep controls displayed.
		maxZoomScale : 5,
		minZoomScale : 1,
		borderRadius : 4,
		height : '90%',
		width : '90%',
	});
	row.add(scrollableView);
	tableData.push(row);
}

function createComponentsScrollView(componentsMessage, components){
	var row = createPlainRow();
	var headingRow = createHeadingRow();
	
	var heading = Ti.UI.createLabel({
		color : 'black',
		font : {
			fontFamily : 'Arial',
			fontSize : 22,
			fontWeight : 'bold'
		},
		text : componentsMessage,
		textAlign : 'center',
	});
	row.height = 100;
	headingRow.add(heading);
	tableData.push(headingRow);
	
	var image; 	
	var scrollView = Ti.UI.createScrollView({
		layout: 'horizontal',
		//pagingControlTimeout : 0, // Set to less than or equal to 0 to disable timeout, to keep controls displayed.
		height : '100%',
		showHorizontalScrollIndicator: true,
		width: '100%',
		contentWidth: 'auto',
		scrollType: 'horizontal',
		horizontalWrap: false
	});
	
	for (var i = 0; i < components.length; i++){//imageCollection.length; i++) {
		image = Ti.UI.createImageView({
			image : components[i].image,
			defaultImage : 'http://placehold.it/700x300',
			height: '100%',
			width: 200
		});				
		
		var wrapper = Ti.UI.createView({
			backgroundColor: 'white',
			width: 200,
			left: 10,
			right: 10
		});
		var labelTint = Ti.UI.createView({
			backgroundColor: 'black',
			opacity: 0.5,
			height: '20%',
			top: 0
		});
		var label = Ti.UI.createLabel({
			text: components[i].name,
			top: 0,
			left: 10,
			color: 'white',
			font: {
				fontFamily : 'Arial',
				fontSize : 14,
				fontWeight : 'bold'
			}
		});	
		
		image.addEventListener('click', openComponent);
		
		labelTint.add(label);
		wrapper.add(image);
		wrapper.add(labelTint);
		
		scrollView.add(wrapper);
	}
	
	row.add(scrollView);
	tableData.push(row);
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



createExhibitsCarousel("All Exhibits", json.data.museum.exhibits);
createComponentsScrollView("Check out our Stations", json.data.museum.exhibits[0].components);
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

