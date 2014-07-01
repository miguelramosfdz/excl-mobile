//Testing variable
var selectedAges = [7, 4, 6, 0].sort();
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
	Ti.API.info("output: " + JSON.stringify(hashOrderedPostsByAge));
	Ti.API.info("Selected ages: " + JSON.stringify(selectedAges));
	displayDictKeys(hashOrderedPostsByAge);

	//replaceTempHeadingsForAgeFiltering(selectedAges);
	//attatchHashToTableData

	setTableDataAndSpacing();
}

function returnHashKeys(hash) {
	var listKeys;
	for (key in hash) {
		listKeys += " " + key;
	}
	return listKeys;
}

function compileHashOfSelectedAgesToPostAgeRange(selectedAges, hashOrderedPostsByAge, post) {
	var postAgeRange = JSON.parse("[" + repairEmptyAgeRange(post.age_range) + "]");
	
	Ti.API.info("102 keys: [" + returnHashKeys(hashOrderedPostsByAge) + "]");
	
	if (postAgeRange == selectedAges) {
		Ti.API.info("Matched all selected");
		addItemArrayToHash(0, postAgeRange[j], hasSelectedAgesToPost);
		//hashOrderedPostsByAge[0] = postAgeRange[j];
	} else {
		for (var i = 0; i < selectedAges.length; i++) {
			var itemArray = createPostArray(postAgeRange, selectedAges[i], post);

			Ti.API.info("Item ary: " + JSON.stringify(itemArray));

			addItemArrayToHash(selectedAges[i], itemArray, hashOrderedPostsByAge);
		}
	}

	Ti.API.info("105 keys: [" + returnHashKeys(hashOrderedPostsByAge) + "]");
}

function addItemArrayToHash(selectedAge, itemArray, hashOrderedPostsByAge) {

	Ti.API.info("To be matched: " + hashOrderedPostsByAge[selectedAges[i]]);
	Ti.API.info("i-" + i + " , selected: " + selectedAges[i]);
	Ti.API.info("104 keys: [" + returnHashKeys(hashOrderedPostsByAge) + "]");

	hashOrderedPostsByAge[selectedAge] = hashOrderedPostsByAge[selectedAge].concat(itemArray);
}

function createPostArray(postAgeRange, selectedAge, post) {
	var itemArray = [];
	for (var j = 0; j < postAgeRange.length; j++) {
		//Ti.API.info("i-" + i + ", j-" + j + ": " + (postAgeRange[j] == selectedAges[i]));
		if (postAgeRange[j] == selectedAges[i]) {
			Ti.API.info("post: " + post);
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

function replaceTempHeadingsForAgeFiltering(hashOrderedPostsByAge) {

	//Replace dict keys with real headings

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
