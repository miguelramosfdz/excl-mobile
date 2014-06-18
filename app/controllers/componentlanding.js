var args = arguments[0] || {};
var dataRetriever = require('dataRetriever');
var componentID = args;
var url = "http://excl.dreamhosters.com/dev/wp-json/v01/excl/component/" + componentID;
var allSections = [];
var tableData = [];

function changeTitleOfThePage(name) {
	$.componentlanding.title = name;
}

function createNewSection(titleOfSection) {
	createSectionHeading(titleOfSection);
	// createPostCarousel();
}

function addToExistingSection() {

}

function createRow() {
	var row = Ti.UI.createTableViewRow({
		height : '190dp',
		top : '10dp',
		backgroundColor : 'white',
	});
	return row;
}

function createHeadingRow() {
	var row = Ti.UI.createTableViewRow({
		height : '50dp',
		backgroundColor : 'cyan',
	});
	return row;
}

function createSectionHeading(headingTitle) {
	var headingRow = createHeadingRow();
	var sectionHeading = Ti.UI.createLabel({
		color : 'black',
		font : {
			fontFamily : 'Arial',
			fontSize : 22,
			fontWeight : 'bold'
		},
		text : headingTitle,
		textAlign : 'center',
	});
	headingRow.add(sectionHeading);
	tableData.push(headingRow);
}

function createPostCarousel(posts) {
	var row = createRow();

	for ( i = 0; i >= posts.length; i++) {
		postViews[i] = createLabeledPostView(posts[i], '22');
		// will later say 'exhibit', and will create the pic item of that class
		postSwipeableView.add(postViews[i]);
		postViews[i].hide();
	}
	// postViews[0].show();
	row.add(postSwipeableView);
	tableData.push(row);
}

function createSection(posts) {
	createSectionHeading(posts);
	createPostCarousel(posts);
}

function init() {
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		changeTitleOfThePage(returnedData.data.component.name);
		var allPosts = returnedData.data.component.posts;

		for (var i = 0; i < allPosts.length; i++) {
			// Getting all section names first
			if (allPosts[i].section) {
				if (allSections.indexOf(allPosts[i].section) > -1) {
					// do nothing
				} else {
					allSections.push(allPosts[i].section);
				}
			}
		}

		// filter the sections and display the 'like ones' together
		// sorting in ascedning order alphabetically
		allSections.sort();

		for (var i = 1; i < allPosts.length; i++) {
			if (allPosts[i - 1] == allPosts[i]) {
				// section exists
				addToExistingSection();
			} else {
				// create a new sections
				createNewSection(allPosts[i].section);
			}
		}

		var tableView = Ti.UI.createTableView({//has to be under everything to work
			backgroundColor : 'white',
			data : tableData,
			width : '100%',
			height : '100%'
		});
		$.componentlanding.add(tableView);

	});
}

init();
