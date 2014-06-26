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

//Google Analytics
function trackComponentscreen() {
	Alloy.Globals.analyticsController.trackScreen("Component Landing");
}

trackComponentscreen();

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

function addToBfaSection(post) {
	var sectionIndex = sectionsForBfa.indexOf(post.section);
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
	Alloy.Globals.analyticsController.trackScreen("Post Landing");
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

function createAgeRange(post) {
	var ageRange;
	ageRange = compileAgeRange(post.min_age, post.max_age);
	return ageRange;
}

function compileAgeRange(min_age, max_age) {
	if (max_age == "" && min_age == "") {
		return "For All Selected Ages";
	} else if (max_age == "") {
		return "For age " + min_age;
	} else if (min_age >= max_age) {
		return "Invalid Age Range";
	} else {
		return "For ages " + min_age + "-" + max_age;
	}
}

function setTableDataAndSpacing() {
	$.tableView.data = tableData;
	if (OS_IOS) {
		$.tableView.bottom = "48dip";
	}
}

function clearTableAndData() {
	tableData = [];
	$.tableView.data = tableData;
	sectionsThatAlreadyExist = [];
	sectionsForBfa = [];
}

function setSwitchEvent() {
	$.bfaSwitch.addEventListener("click", function(e) {
		clearTableAndData();
		retrieveComponentData();
	});
}

function retrieveComponentData() {
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		changeTitleOfThePage(returnedData.data.component.name);
		allPosts = returnedData.data.component.posts;
		checkStateOfSwitch(allPosts);
		setTableDataAndSpacing();
	});
}

function checkStateOfSwitch(allPosts) {
	Ti.API.info("toggle: " + $.bfaSwitch.value);

	if ($.bfaSwitch.value == true) {
		
		Ti.API.info("Entered ages");
		
		$.bfaIndicator.text = "Sorted By Age";
		$.bfaSwitch.titleOn == " ";
		organizeByBfa(allPosts);
		Ti.API.info(sectionsForBfa);
	} else if ($.bfaSwitch.value == false) {
		
		Ti.API.info("Entered sections");
		
		$.bfaIndicator.text = "Sorted By Section";
		$.bfaSwitch.titleOff == " ";
		organizeBySection(allPosts);	
		Ti.API.info(sectionsThatAlreadyExist);
	}
}

function organizeBySection(allPosts) {
	for (var i = 0; i < allPosts.length; i++) {
		if (allPosts[i].section) {
			if (sectionsThatAlreadyExist.indexOf(allPosts[i].section) == -1) {
				sectionsThatAlreadyExist.push(allPosts[i].section);
				createNewSection(allPosts[i].section);
			}
			addToExistingSection(allPosts[i]);
		}
	}
	setTableDataAndSpacing();
}

function organizeByBfa(allPosts) {
	for (var i = 0; i < allPosts.length; i++) {
		var ageRange = createAgeRange(allPosts[i]);
		if (sectionsForBfa.indexOf(ageRange) == -1) {
			sectionsForBfa.push(ageRange);
			createNewSection(ageRange);
		}
		addToBfaSection(allPosts[i]);
	}
	setTableDataAndSpacing();
}

function init() {
	$.bfaSwitch.value = false;
	setSwitchEvent();
	retrieveComponentData();
}

init();
