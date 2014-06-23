var args = arguments[0] || {};
var dataRetriever = require('dataRetriever/dataRetriever');
var componentID = args;
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

//var url = "http://www.mocky.io/v2/53a1e425b4ac142006024b75";
var allSections = [];
var sectionCarousels = [];
var tableData = [];
var sectionsThatAlreadyExist = [];
var allPosts;

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
		top: '10dp',
		backgroundColor : 'white',
	});
	return row;
}

function createHeadingRow() {
	var row = Ti.UI.createTableViewRow({
		height : '50dp',
		backgroundColor : '#253342',
	});
	return row;
}

function createSectionHeading(headingTitle) {
	var headingRow = createHeadingRow();
	var sectionHeading = Ti.UI.createLabel({
		color : '#FFFFFF',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '22dp',
			fontWeight : 'bold'
		},
		text : headingTitle,
		textAlign : 'center',
	});
	headingRow.add(sectionHeading);
	tableData.push(headingRow);
}

function goToPostLandingPage(e){
	var post = fetchPostById(e.source.itemId);
	var componentWindow = Alloy.createController('postlanding', post).getView();
	Alloy.Globals.navController.open(componentWindow, post);
}

function fetchPostById(postID){
	var toReturn;
	for(var i=0; i<allPosts.length; i++){
		if(allPosts[i].id == postID){
			toReturn = allPosts[i];
		}
	}
	return toReturn;
}

function init() {
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		changeTitleOfThePage(returnedData.data.component.name);
		allPosts = returnedData.data.component.posts;

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

		if (OS_IOS){
			//Accounts for bounce buffer
			$.tableView.bottom = "48dip";
		}

		$.tableView.data = tableData;

	});
}

init();
