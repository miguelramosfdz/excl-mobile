var args = arguments[0] || {};

var tableData = [];
var imageCollection = ['http://placehold.it/700x300/556270', 'http://placehold.it/700x200/4ECDC4', 'http://placehold.it/600x300/C7F464', 'http://placehold.it/600x200/FF6B6B', 'http://placehold.it/700x300/C44D58'];


// simulate data from wordpress using Jess' model
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
function createPlainRow() {
	var row = Ti.UI.createTableViewRow({
		// height: (Ti.Platform.displayCaps.platformHeight / 8),
		height : '200dp',
		backgroundColor : '#ffff00',
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



function createExhibitsCarousel(headingText, imageCollection){
	
	var row = createPlainRow();
	var headingRow = createHeadingRow();

	var heading = Ti.UI.createLabel({
		color : 'brown',
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
	
	for (var i = 0; i < 5; i++){//imageCollection.length; i++) {
		var tempImage = Ti.UI.createImageView({
			image : imageCollection[i],
			defaultImage : 'http://placehold.it/700x300',
			width : '100%',
			height : '100%'
		});
		var tempWrapper = Ti.UI.createScrollView({
			maxZoomScale : 4.0,
		});
		tempWrapper.add(tempImage);
		imageWrappers[i] = tempWrapper;
		//imageWrappers[i] = tempImage;
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

function createComponentsScrollView(){
	
}

createExhibitsCarousel("All Exhibits", imageCollection);

var tableView = Ti.UI.createTableView({
	// backgroundColor : '#07B5BE',
	backgroundColor : 'green',
	data : tableData
});

$.exhibits.title = "Exhibits";
$.exhibits.add(tableView);
