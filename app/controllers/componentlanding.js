var args = arguments[0] || {};
var dataRetriever = require('dataRetriever/dataRetriever');
var componentID = args;
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

//var url = "http://www.mocky.io/v2/53a1e425b4ac142006024b75";
//var allSections = [];
var sectionCarousels = [];
var tableData = [];
var sectionsThatAlreadyExist = [];
var sectionsForBfa = [];
var allPosts;

function changeTitleOfThePage(name) {
	$.componentlanding.title = name;
}

function createNewSection(titleOfSection) {
	Ti.API.info("title: " + titleOfSection);
	createSectionHeading(titleOfSection);
	createSectionCarousel(titleOfSection);
	// createPostCarousel();
}

function createSectionCarousel(titleOfSection) {
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

function goToPostLandingPage(e) {
	var post = fetchPostById(e.source.itemId);
	var componentWindow = Alloy.createController('postlanding', post).getView();
	Alloy.Globals.navController.open(componentWindow, post);
}

function fetchPostById(postID) {
	var toReturn;
	for (var i = 0; i < allPosts.length; i++) {
		if (allPosts[i].id == postID) {
			toReturn = allPosts[i];
		}
	}
	return toReturn;
}

// function addToBfaSection(post) {
// var sectionIndex = sectionsForBfa.indexOf(post.section);
// sectionCarousels[sectionIndex].addItem(post, goToPostLandingPage);
// }
//
// function createAgeRange(post) {
// var ageRange;
// if (post.min_age) {
// ageRange = post.min_age;
// }
// Ti.API.info("temp_age1: " + ageRange);
// if (post.max_age) {
// ageRange = ageRange + "-" + post.max_age;
// }
// Ti.API.info("temp_age2: " + ageRange);
// if (post.min_age && post.max_age && post.min_age >= post.max_age) {
// ageRange = "Invalid Age Range";
// }
// Ti.API.info("temp_age3: " + ageRange);
// if ( ageRange == "" || (post.min_age== "" && post.max_age=="")) {
// ageRange = "All";
// }
// Ti.API.info("temp_age4: " + ageRange);
// return ageRange;
// }
//
// function initBfa() {
// dataRetriever.fetchDataFromUrl(url, function(returnedData) {
// changeTitleOfThePage(returnedData.data.component.name);
// allPosts = returnedData.data.component.posts;
// for (var i = 0; i < allPosts.length; i++) {
// var ageRange = createAgeRange(allPosts[i]);
//
// Ti.API.info("age: "+ ageRange + " for " + allPosts[i].name);
//
// if (sectionsForBfa.indexOf(ageRange) == -1) {
// // create a new section
// //order of components are determined here
// sectionsForBfa.push(ageRange);
// createNewSection(ageRange);
// }
// addToBfaSection(allPosts[i]);
// }
// if (OS_IOS) {
// //Accounts for bounce buffer
// $.tableView.bottom = "48dip";
// }
// $.tableView.data = tableData;
//
// });
// }

function init() {
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		changeTitleOfThePage(returnedData.data.component.name);
		allPosts = returnedData.data.component.posts;

		for (var i = 0; i < allPosts.length; i++) {
			if (allPosts[i].section) {
				if (sectionsThatAlreadyExist.indexOf(allPosts[i].section) == -1) {
					// create a new section
					//order of components are determined here
					sectionsThatAlreadyExist.push(allPosts[i].section);
					createNewSection(allPosts[i].section);
				}
				addToExistingSection(allPosts[i]);
			}
		}
		Ti.API.info(sectionsThatAlreadyExist);

		if (OS_IOS) {
			//Accounts for bounce buffer
			$.tableView.bottom = "48dip";
		}

		$.tableView.data = tableData;

	});
}

init();
//initBfa();
