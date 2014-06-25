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

function addToBfaSection(post) {
	var sectionIndex = sectionsForBfa.indexOf(post.section);
	sectionCarousels[sectionIndex].addItem(post, goToPostLandingPage);
}

function createAgeRange(post) {
	var ageRange;
	if (checkAgeRangeForMinAndMax(post)) {
		ageRange = compileAgeRange(post.min_age, post.max_age);
		if (checkAgeRangeForMinOnly(post)) {
			ageRange = compileAgeRange(post.min_age, "");
		}
		return ageRange;
	}
}

function compileAgeRange(min_age, max_age) {
	if (max_age == "" && min_age == "") {
		return "All";
	} else if (max_age == "") {
		return min_age;
	} else if (min_age >= max_age) {
		return "Invalid Age Range";
	} else {
		return min_age + "-" + max_age;
	}
}

function checkAgeRangeForMinAndMax(post) {
	if (post.min_age && post.max_age) {
		return true;
	} else {
		return false;
	}
}

function checkAgeRangeForMinOnly(post) {
	if (post.min_age) {
		return true;
	} else {
		return false;
	}
}

function organizeBySection(allPosts) {
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
}

function organizeByBfa(allPosts) {
	for (var i = 0; i < allPosts.length; i++) {
		var ageRange = createAgeRange(allPosts[i]);

		Ti.API.info("age: " + ageRange + " for " + allPosts[i].name);

		if (sectionsForBfa.indexOf(ageRange) == -1) {
			sectionsForBfa.push(ageRange);
			createNewSection(ageRange);
		}
		addToBfaSection(allPosts[i]);
	}
}

function checkStateOfSwitch(switchId, allPosts) {
	if (switchId.value == true) {
		$.bfaIndicator.text = "BFA Enabled";
		switchId.titleOn == " ";
		organizeByBfa(allPosts);
	} else {
		organizeBySection(allPosts);
		$.bfaIndicator.text = "BFA Disabled";
		switchId.titleOff == " ";
	}
}

// function init() {
	// dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		// changeTitleOfThePage(returnedData.data.component.name);
		// allPosts = returnedData.data.component.posts;
// 
		// $.bfaSwitch.value = false;
		// $.bfaSwitch.left = "80%";
		// $.bfaIndicator.text = "BFA Disabled";
		// $.bfaIndicator.left = "60%";
		// checkStateOfSwitch($.bfaSwitch, allPosts);
		// $.bfaSwitch.addEventListener("change", function(e) {
			// checkStateOfSwitch($.bfaSwitch, allPosts);
		// });
// 
		// for (var i = 0; i < allPosts.length; i++) {
			// if (allPosts[i].section) {
				// if (sectionsThatAlreadyExist.indexOf(allPosts[i].section) == -1) {
					// sectionsThatAlreadyExist.push(allPosts[i].section);
					// createNewSection(allPosts[i].section);
				// }
				// addToExistingSection(allPosts[i]);
			// }
		// }
		// Ti.API.info(sectionsThatAlreadyExist);
		// Ti.API.info("data: " + tableData);
// 
		// if (OS_IOS) {
			// //Accounts for bounce buffer
			// $.tableView.bottom = "48dip";
		// }
		// $.tableView.data = tableData;
	// });
// 	
// }

function createBfaNavRow(){
	var toggle = Ti.UI.createSwitch({
		titleOn: "",
		titleOff: "",
		left: "100%",
		value: "false"
	});
	var label = Ti.UI.createLabel({
		text: "BFA Disabled"
	});
	var row = createRow();
	row.add(label);
	row.add(toggle);
}

 function init() {
 	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
 		tableData.push(createBfaNavRow());
 		changeTitleOfThePage(returnedData.data.component.name);
 		allPosts = returnedData.data.component.posts;
 		for (var i = 0; i < allPosts.length; i++) {
 			if (allPosts[i].section) {
 				if (sectionsThatAlreadyExist.indexOf(allPosts[i].section) == -1) {
 					sectionsThatAlreadyExist.push(allPosts[i].section);
 					createNewSection(allPosts[i].section);
				} else {
					// section already exists
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
