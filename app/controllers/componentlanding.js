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
var existingSortByAge = [];
var hashSelectedAgesToPosts = {};
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

function addToAgeSection(post) {
	var sectionIndex = existingSortByAge.indexOf(post.section);
	//need to change post.section to the age appropriate section title
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
		if (parseInt(selectedAge) >= parseInt(ageRange[0]) && parseInt(selectedAge) <= parseInt(ageRange[1])) {
			return true;
		} else {
			return false;
		}
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

		//Ti.API.info("Should be: " + allPosts[i].age_range[0] + "to " + allPosts[i].age_range[parseInt(allPosts[i].age_range.length - 1)]);

		compileDictOfSelectedAgesToPostAgeRange(selectedAges, hashSelectedAgesToPosts, allPosts[i]);

	}

	//createTempHeadingsForAgeFiltering(selectedAges);

	//replaceTempHeadingsForAgeFiltering(selectedAges);

	setTableDataAndSpacing();
}

function compileDictOfSelectedAgesToPostAgeRange(selectedAges, hashSelectedAgesToPosts, post) {
	hashSelectedAgesToPosts = Alloy.Globals.arrayToEmptyDict(selectedAges);
	var postAgeRange = Alloy.Globals.stringToArray(repairEmptyAgeRange(post.age_range), "|");
	
	Ti.API.info("stuff: " + JSON.stringify(postAgeRange));
	
	if (postAgeRange == selectedAges) {
		hashSelectedAgesToPosts[0] = postAgeRange[j];
	} else {
		for (var i = 0; i < selectedAges.length; i++) {
			for (var j = 0; j < postAgeRange.length; i++) {
				if (postAgeRange[j] == selectedAges[i]) {
					hashSelectedAgesToPosts[selectedAges[i]] = postAgeRange[j];
				}
			}

		}
	}

	Ti.API.info("stuff: " + JSON.stringify(hashSelectedAgesToPosts));
}

function repairEmptyAgeRange(ageRange){
	if (ageRange == "a:0:{}"){
		return 0;
	}
}

function replaceTempHeadingsForAgeFiltering(selectedAges) {

	//Replace dict keys with real headings

}

function init() {
	$.sortSwitch.value = false;
	setSwitchEvent();
	retrieveComponentData();
}

init();
