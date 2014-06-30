//Testing variable
var selectedAges = [7, 4, 6].sort();
////

var args = arguments[0] || {};
var component = args;
var componentID = component.get('id');
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

var sectionCarousels = [];
var tableData = [];
var existingSortBySections = [];
var existingSortByAge = [];
var allPosts;

function changeTitleOfThePage(name) {
	$.componentlanding.title = name;
}

//Create require paths
function setPathForLibDirectory(libfile) {
	var libPath;
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		libPath = require("../../lib/" + libfile);
	} else {
		libPath = require(libfile);
	}
	return libPath;
}

var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner;

function createNewSection(titleOfSection) {
	Ti.API.info("title: " + titleOfSection);
	createSectionHeading(titleOfSection);
	createSectionCarousel(titleOfSection);
	// createPostCarousel();
}

function createSectionCarousel(titleOfSection) {
	var row = createRow();
	var sectionIndex = existingSortBySections.indexOf(titleOfSection);
	sectionCarousels[sectionIndex] = Alloy.createWidget("itemCarousel");
	row.add(sectionCarousels[sectionIndex].getView());
	tableData.push(row);
}

function addToExistingSection(post) {
	var sectionIndex = existingSortBySections.indexOf(post.section);
	sectionCarousels[sectionIndex].addItem(post, goToPostLandingPage);
}

function addToAgeSection(post) {
	var sectionIndex = existingSortByAge.indexOf(post.section); //need to change post.section to the age appropriate section title
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
	Alloy.Globals.analyticsController.trackScreen(component.getScreenName() + '/' + post.name, "Post Landing");
	Alloy.Globals.navController.open(Alloy.createController('postlanding', post));
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

function createNumericalArray(st) {
	var array = [];
	for (var i = 0; i < st.length; i++) {
		if (Alloy.Globals.isNumeric(st[i])) {
			array.push(st[i]);
		}
	}
	Ti.API.info("array: " + array);
	return array.sort();
}

function createAgeRange(post) {
	var ageRange = post.age_range;
	if (!ageRange | ageRange == "a:0:{}") {
		return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
	}
	createNumericalArray(ageRange);
	return ageRange;
}

function replaceNumeric(int) {
	var newInt = int;
	newInt = replaceBoleanWithNumeric(int);
	if (newInt == "14") {
		newInt == "Adult";
	}
	return parseInt(newInt);
}

function replaceBoleanWithNumeric(bol) {
	if (bol == true) {
		return "1";
	} else if (bol == false) {
		return "0";
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
	existingSortBySections = [];
	existingSortByAge = [];
}

function setSwitchEvent() {
	$.sortSwitch.addEventListener("click", function(e) {
		clearTableAndData();
		addSpinner();
		retrieveComponentData();
	});
}

function checkIfSelectedAgeInPostAgeRange(selectedAge, ageRange) {
	if (selectedAge.lenth == 0) {
		Ti.API.info("No ages selected");
	} else if (ageRange.length == 1) {
		if (selectedAge == ageRange[0]) {
			return true;
		} else {
			return false;
		}
	} else if (ageRange.length == 2) {
		if (selectedAge >= ageRange[0] && selectedAge <= ageRange[1]) {
			return true;
		} else {
			return false;
		}
	}
}

function createSectionHeadingsForSelectedAges(selectedAges) {
	existingSortByAge.push("For All Selected Ages");
	createNewSection("For All Selected Ages");
	for (var j = 0; j < selectedAges.length; j++) {
		var section = "For My " + selectedAges[j] + " Yr Old";
		existingSortByAge.push(section);
		createNewSection(section);
	}
}

function retrieveComponentData() {
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		changeTitleOfThePage(returnedData.data.component.name);
		allPosts = returnedData.data.component.posts;
		checkStateOfSwitch(allPosts);
		setTableDataAndSpacing();
	});
}

function addSpinner() {
	spinner.addTo($.sortBar);
	spinner.show();
}

function removeSpinner() {
	spinner.hide();
}

function checkStateOfSwitch(allPosts) {
	Ti.API.info("toggle: " + $.sortSwitch.value);

	if ($.sortSwitch.value == true) {
		$.sortIndicator.text = "Filter By Age On";
		$.sortIndicator.color = "#00CC00";
		organizeByAge(allPosts);
		Ti.API.info("All sections: " + existingSortByAge);
	} else if ($.sortSwitch.value == false) {
		$.sortIndicator.text = "Filter By Age Off";
		$.sortIndicator.color = "#FFFFFF";
		organizeBySection(allPosts);
		Ti.API.info("All sections: " + existingSortBySections);
	}
	removeSpinner();
}

function organizeBySection(allPosts) {
	for (var i = 0; i < allPosts.length; i++) {
		if (allPosts[i].section) {
			if (existingSortBySections.indexOf(allPosts[i].section) == -1) {
				existingSortBySections.push(allPosts[i].section);
				createNewSection(allPosts[i].section);
			}
			addToExistingSection(allPosts[i]);
		}
	}
	setTableDataAndSpacing();
}

function organizeByAge(allPosts) {
	for (var i = 0; i < allPosts.length; i++) {
		Ti.API.info("Should be: " + allPosts[i].age_range[0] + "to " + allPosts[i].age_range[parseInt(allPosts[i].age_range.length - 1)]);
		var ageRange = createAgeRange(allPosts[i]);

		createSectionHeadingsForSelectedAges(selectedAges);

		for (var j = 0; j < selectedAges.length; j++) {
			if (checkIfSelectedAgeInPostAgeRange(selectedAges[j], ageRange)) {
				addToAgeSection(allPosts[j]);
			}
		}

	}
	setTableDataAndSpacing();
}

function init() {
	$.sortSwitch.value = false;
	setSwitchEvent();
	retrieveComponentData();
}

init();
