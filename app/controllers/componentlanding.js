//Testing variable
var selectedAges = [0, 4, 6, 7, "Adult"];
////

var args = arguments[0] || {};
var component = args;
var componentID = component.get('id');
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

var sectionCarousels = [];
var tableData = [];
var existingSortBySections = [];
var hashOrderedPostsByAge = {};
var allPosts;
var analyticsPageTitle = "";
var analyticsPageLevel = "";

var setAnalyticsPageTitle = function(title) { analyticsPageTitle = title; };
var getAnalyticsPageTitle = function() { return analyticsPageTitle; };
var setAnalyticsPageLevel = function(level) { analyticsPageLevel = level; };
var getAnalyticsPageLevel = function() { return analyticsPageLevel; };
exports.setAnalyticsPageTitle = setAnalyticsPageTitle;
exports.getAnalyticsPageTitle = getAnalyticsPageTitle;
exports.setAnalyticsPageLevel = setAnalyticsPageLevel;
exports.getAnalyticsPageLevel = getAnalyticsPageLevel;

function changeTitleOfThePage(name) {
	$.componentlanding.title = name;
}

var dataRetriever = Alloy.Globals.setPathForLibDirectory('dataRetriever/dataRetriever');
var loadingSpinner = Alloy.Globals.setPathForLibDirectory('loadingSpinner/loadingSpinner');
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
	var analyticsTitle = component.getScreenName() + '/' + post.name;
	var analyticsLevel = "Post Landing";
	Alloy.Globals.analyticsController.trackScreen(analyticsTitle, analyticsLevel);
	var controller = Alloy.createController('postlanding', post);
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
	Alloy.Globals.navController.open(controller);
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
	hashOrderedPostsByAge = {};
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
		Ti.API.info("All sections: " + returnHashKeys(hashOrderedPostsByAge));
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
	hashOrderedPostsByAge = {};

	Ti.API.info("101 keys: [" + returnHashKeys(hashOrderedPostsByAge) + "]");

	for (var i = 0; i < allPosts.length; i++) {
		compileHashOfSelectedAgesToPostAgeRange(selectedAges, hashOrderedPostsByAge, allPosts[i]);
	}
	
	Ti.API.info("106 keys: [" + returnHashKeys(hashOrderedPostsByAge) + "]");
	Ti.API.info("106 Full: " + JSON.stringify(hashOrderedPostsByAge));

	hashOrderedPostsByAge = replaceHashKeysWithFilterHeadings(hashOrderedPostsByAge);
	//attatchHashToTableData

	setTableDataAndSpacing();
}

function returnHashKeys(hash) {
	var listKeys = [];
	for (key in hash) {
		listKeys.push(key);
	}
	return listKeys;
}

function compileHashOfSelectedAgesToPostAgeRange(selectedAges, hashOrderedPostsByAge, post) {
	var postAgeRange = JSON.parse("[" + repairEmptyAgeRange(post.age_range) + "]");
	if (postAgeRange == selectedAges | postAgeRange == 0) {
		Ti.API.info("Matched all selected");
		addItemArrayToHash(0, postAgeRange, hashOrderedPostsByAge);
		//hashOrderedPostsByAge[0] = postAgeRange[j];
	} else {
		for (var i = 0; i < selectedAges.length; i++) {
			var itemArray = createPostArray(postAgeRange, selectedAges[i], post);
			addItemArrayToHash(selectedAges[i], itemArray, hashOrderedPostsByAge);
		}
	}

	Ti.API.info("106 keys: [" + returnHashKeys(hashOrderedPostsByAge) + "]");
}

function addItemArrayToHash(selectedAge, itemArray, hashOrderedPostsByAge) {
	if (hashOrderedPostsByAge[selectedAge]) {
		hashOrderedPostsByAge[selectedAge] = hashOrderedPostsByAge[selectedAge].concat(itemArray);
		Ti.API.info("105a keys: [" + returnHashKeys(hashOrderedPostsByAge) + "]");
	} else {
		hashOrderedPostsByAge[selectedAge] = itemArray;
		Ti.API.info("105b keys: [" + returnHashKeys(hashOrderedPostsByAge) + "]");
	}
}

function createPostArray(postAgeRange, selectedAge, post) {
	var itemArray = [];
	for (var j = 0; j < postAgeRange.length; j++) {
		//Ti.API.info("i-" + i + ", j-" + j + ": " + (postAgeRange[j] == selectedAges[i]));
		if (postAgeRange[j] == selectedAges[i]) {
			itemArray.push(post);
		}
	}
	return itemArray;

}

function repairEmptyAgeRange(ageRange) {
	if (ageRange == "a:0:{}") {
		return 0;
	} else {
		return ageRange;
	}
}

function replaceStringWithFilterHeading (st){
	if (st == 0){
			newKeys.push("For All Selected Ages");
		} else if (!Alloy.Globals.isNumber(st)) {
			newKeys.push("For my " + st);
		} else if(Alloy.Globals.isNumber(st)){
			newKeys.push("For my " + st + " year old");
		}
}

function replaceHashKeysWithFilterHeadings(oldHash) {
	var oldKeys = returnHashKeys(oldHash);
	var newKeys = [];
	var newHash = {};
	for (var i = 0; i < oldKeys.length; i++){
		replaceStringWithFilterHeading (oldKeys[i]);
	}
	
	Ti.API.info("new keys: " + JSON.stringify(newKeys));
	
	for (var i = 0; i < oldKeys.length; i++){
		newHash[newKeys[i]] = oldHash[oldKeys[i]];
	}
	return newHash;
}

function init() {
	$.sortSwitch.value = false;
	setSwitchEvent();
	retrieveComponentData();
}

init();

/*
 * TODO
 * Add entries to dict
 *
 * Populate keys with appropriate posts
 *
 * Replace titles of hash
 *
 * Push to table data
 */
