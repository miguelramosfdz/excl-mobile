var args = arguments[0] || {};
var dataRetriever = require('dataRetriever');
var componentID = args;
var url = "http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/13/component/" + componentID;

//var url = "http://www.mocky.io/v2/53a1e425b4ac142006024b75";
var allSections = [];
var sectionCarousels = [];
var tableData = [];
var sectionsThatAlreadyExist = [];

function changeTitleOfThePage(name) {
	$.componentlanding.title = name;
}

function createNewSection(titleOfSection) {
	createSectionHeading(titleOfSection);
	createSectionCarousel(titleOfSection);
	// createPostCarousel();
}

function createSectionCarousel(titleOfSection){
	var row = createRow();
	var sectionIndex = sectionsThatAlreadyExist.indexOf(titleOfSection);
	sectionCarousels[sectionIndex] = Alloy.createWidget("itemCarousel");
	row.add(sectionCarousels[sectionIndex].getView());
	tableData.push(row);
}

function addToExistingSection(post) {
	var sectionIndex = sectionsThatAlreadyExist.indexOf(post.section);
	sectionCarousels[sectionIndex].addItem(post, goToPostLandingPage);
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

function goToPostLandingPage(e){
	var componentWindow = Alloy.createController('postlanding').getView();
	Alloy.Globals.navController.open(componentWindow, e.source.itemId);
}

function init() {
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		changeTitleOfThePage(returnedData.data.component.name);
		var allPosts = returnedData.data.component.posts;

		for (var i = 0; i < allPosts.length; i++) {
			if (allPosts[i].section) {
				if (sectionsThatAlreadyExist.indexOf(allPosts[i].section) == -1) {
					// create a new section
					sectionsThatAlreadyExist.push(allPosts[i].section);
					createNewSection(allPosts[i].section);
				} else {
					// section already exists
				}
				addToExistingSection(allPosts[i]);
			}
		}
		Ti.API.info(sectionsThatAlreadyExist);

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
