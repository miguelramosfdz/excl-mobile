var args = arguments[0] || {};

//-----------------------------------------------------------------------------------------------------------------------------------------
//   JSON ISH
//-----------------------------------------------------------------------------------------------------------------------------------------

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
              "image": "http://funnyfilez.funnypart.com/pictures/FunnyPart-com-happy_seal.jpg"
            },
            {
              "id": 54321,
              "name": "Spinning Disc",
              "image": "http://bp2.uuuploads.com/photoshopped-animals-gyyp/photoshopped-animals-gyyp-2.jpg"
            }
          ]
        }
      ]
    }
  }
};

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------

var tableData = [];
// simulate data from wordpress using Jess' model

// Modify with new MODULE methods
function openPostLanding(e){
		
	var postLandingWindow = Alloy.createController('postlanding').getView();
	postLandingWindow.open();  
}

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------

function createPlainRow() {
	var row = Ti.UI.createTableViewRow({
		// height: (Ti.Platform.displayCaps.platformHeight / 8),
		height : '190dp',
		top: '10dp',
		backgroundColor : 'black',
	});
	return row;
}

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------

function createHeadingRow() {
		var row = Ti.UI.createTableViewRow({
			height : '40dp',
			backgroundColor : 'yellow',
			color:'black',
			text: "Cups and Balls",
			textAlign : 'center',
			width:'50%'
		});
		
		var heading = Ti.UI.createLabel({
		color : 'black',
		font : {
			fontFamily : 'Arial',
			fontSize : 22,
			fontWeight : 'bold'
		},
		text :'Article 1',
		textAlign : 'center'
	});
	return row;
}

function createExhibitsCarousel(exhibits){
	
	var row = createPlainRow();
	var headingRow = createHeadingRow();


	tableData.push(headingRow);

	var imageWrappers = [];
	
	for (var i = 0; i < exhibits.length; i++){//imageCollection.length; i++) {
		var tempImage = Ti.UI.createImageView({
			image : exhibits[i].image,
			defaultImage : 'http://placehold.it/700x300',
			width : '100%',
			height : '100%'
		});
				
		tempImage.addEventListener('click', openPostLanding);

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


createExhibitsCarousel(json.data.museum.exhibits);

var tableView = Ti.UI.createTableView({
	// backgroundColor : '#07B5BE',
	backgroundColor : 'white',
	data : tableData,
	width: '100%',
	height:'100%'
});


$.componentlanding.title = "Component";
$.componentlanding.add(tableView);


