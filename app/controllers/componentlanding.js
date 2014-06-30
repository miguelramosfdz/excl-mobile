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
	var sectionIndex = existingSortByAge.indexOf(post.section);
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
	Alloy.Globals.analyticsController.trackScreen(component.getScreenName() + '/' + post.name);
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

function compileAgeRange(post) {
	if (!post.min_age && !post.max_age) {
		return "For All Selected Ages";
	} else if (!post.min_age && post.max_age) {
		return "For My 1-" + replaceBoleanWithNumeric(post.max_age) + " Yr Old";
	} else if (post.min_age && !post.max_age) {
		return "For My " + replaceBoleanWithNumeric(post.min_age) + " Yr Old";
	} else if (post.min_age && post.max_age) {
		if (parseInt(post.min_age) >= parseInt(post.max_age)) {
			return "Invalid Age Range";
		} else {
			return "For My " + replaceBoleanWithNumeric(post.min_age) + "-" + replaceBoleanWithNumeric(post.max_age) + " Yr Old";
		}
	}
}

function replaceBoleanWithNumeric(bol) {
	if (bol == true) {
		return "1";
	} else if (bol == false) {
		return "0";
	} else {
		return parseInt(bol);
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
		Ti.API.info("Should be: " + allPosts[i].min_age + ", " + allPosts[i].max_age);
		var ageRange = compileAgeRange(allPosts[i]);
		if (existingSortByAge.indexOf(ageRange) == -1) {
			existingSortByAge.push(ageRange);
			createNewSection(ageRange);
		}
		addToAgeSection(allPosts[i]);
	}
	setTableDataAndSpacing();
}

function init() {
	$.sortSwitch.value = false;
	setSwitchEvent();
	retrieveComponentData();
}

init();
