//Testing variable
var selectedAges = [0, 4, 6, "13+", "Adult"];
//will become: alloy.collection.filters
////

var args = arguments[0] || {};
var component = args;
var componentID = component.get('id');
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

var hashOrderedPostsBySection = {};
var hashOrderedPostsByAge = {};

var allPosts;
var initialLoad = false;

var dataRetriever = Alloy.Globals.setPathForLibDirectory('dataRetriever/dataRetriever');
var loadingSpinner = Alloy.Globals.setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner;

var analyticsPageTitle = "";
var analyticsPageLevel = "";

var setAnalyticsPageTitle = function(title) {
	analyticsPageTitle = title;
};
var getAnalyticsPageTitle = function() {
	return analyticsPageTitle;
};
var setAnalyticsPageLevel = function(level) {
	analyticsPageLevel = level;
};
var getAnalyticsPageLevel = function() {
	return analyticsPageLevel;
};
exports.setAnalyticsPageTitle = setAnalyticsPageTitle;
exports.getAnalyticsPageTitle = getAnalyticsPageTitle;
exports.setAnalyticsPageLevel = setAnalyticsPageLevel;
exports.getAnalyticsPageLevel = getAnalyticsPageLevel;

function changeTitleOfThePage(name) {
	$.componentlanding.title = name;
}

function goToPostLandingPage(e) {
	var post = fetchPostById(e.source.itemId);
	var analyticsTitle = component.getScreenName() + '/' + post.name;
	var analyticsLevel = "Post Landing";
	var controller = Alloy.createController('postlanding', post);
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
}

function checkPostViewSpacing() {
	if (OS_IOS) {
		$.postView.bottom = "48dip";
	}
}

function clearOrderedPostHashes() {
	hashOrderedPostsBySection = {};
	hashOrderedPostsByAge = {};
}

function setSwitchEvent() {
	//DEPRECIATED///////////////////////////////////////////////////////////////////////
	$.sortSwitch.addEventListener("click", function(e) {
		clearOrderedPostHashes();
		addSpinner();
		retrieveComponentData();
	});
}

function retrieveComponentData() {
	//if (!initialLoad) {
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {
		changeTitleOfThePage(returnedData.data.component.name);
		allPosts = returnedData.data.component.posts;
		initialLoad = true;
		checkIfAgeFilterOn(allPosts);
		checkPostViewSpacing();
	});
	//} else {
	// checkIfAgeFilterOn(allPosts);
	// checkPostViewSpacing();
	//}
}

function addSpinner() {
	spinner.addTo($.sortBar);
	spinner.show();
}

function removeSpinner() {
	spinner.hide();
}

function checkIfAgeFilterOn(allPosts) {
	//CHANGE REFERENCE TO SWITCH TO REF TO GLOBAL CHECKING FOR AGE SET ENABLED
	if ($.sortSwitch.value == false) {
		$.sortIndicator.text = "Filter By Age On";
		$.sortIndicator.color = "#00CC00";
		organizeByAge(allPosts);
		Ti.API.info("All sections: " + JSON.stringify(returnHashKeys(hashOrderedPostsByAge)));
	} else if ($.sortSwitch.value == false) {
		$.sortIndicator.text = "Filter By Age Off";
		$.sortIndicator.color = "#FFFFFF";
		organizeBySection(allPosts);
		Ti.API.info("All sections: " + JSON.stringify(returnHashKeys(hashOrderedPostsBySection)));
	}
	removeSpinner();
}

function organizeBySection(allPosts) {
	hashOrderedPostsBySection = {};

	for (var i = 0; i < allPosts.length; i++) {
		compileHashOfSections(allPosts[i], hashOrderedPostsBySection);
	}
	Ti.API.info("sections: " + JSON.stringify(hashOrderedPostsBySection));
	sortPostsIntoSections(hashOrderedPostsBySection);
	checkPostViewSpacing();
}

function compileHashOfSections(post, hash) {
	if (post.section) {
		addItemArrayToHash(post.section, "[" + post + "]", hash);
	}
}

function organizeByAge(allPosts) {
	hashOrderedPostsByAge = {};
	for (var i = 0; i < allPosts.length; i++) {
		compileHashOfSelectedAgesToPostAgeRange(selectedAges, hashOrderedPostsByAge, allPosts[i]);
	}
	hashOrderedPostsByAge = replaceHashKeysWithFilterHeadings(hashOrderedPostsByAge);

	//Ti.API.info("110: " + JSON.stringify(hashOrderedPostsByAge));

	sortPostsIntoSections(hashOrderedPostsByAge);

	Ti.API.info("Did it happen?");

	checkPostViewSpacing();
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
		addItemArrayToHash(0, postAgeRange, hashOrderedPostsByAge);
	} else {
		for (var i = 0; i < selectedAges.length; i++) {
			var itemArray = createPostArray(postAgeRange, selectedAges[i], post);
			addItemArrayToHash(selectedAges[i], itemArray, hashOrderedPostsByAge);
		}
	}
}

function addItemArrayToHash(key, itemArray, hash) {

	//Ti.API.info("103: " + key + ", " + JSON.stringify(itemArray));
	if (JSON.stringify(itemArray) != "[0]") {
		if (hash[key]) {
			//hash[key] = hash[key].concat(itemArray);
			hash[key] = itemArray;
		} else {
			hash[key] = [].concat(itemArray);
		}
	} else {
		Ti.API.info("Empty Array prevented: " + JSON.stringify(itemArray));
	}
}

function createPostArray(postAgeRange, selectedAge, post) {
	var itemArray = [];
	for (var j = 0; j < postAgeRange.length; j++) {
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

function replaceStringWithFilterHeading(st) {
	var newSt = "";
	if (st == 0) {
		newSt = "For All Selected Ages";
	} else if (st.toLowerCase() == "adult") {
		newSt = "For " + st + "s";
	} else if (!Alloy.Globals.isNumber(st[0])) {
		newSt = "For " + st;
	} else if (Alloy.Globals.isNumber(st[0])) {
		newSt = "For my " + st + " year old";
	}
	return newSt;
}

function replaceHashKeysWithFilterHeadings(oldHash) {
	var oldKeys = returnHashKeys(oldHash);
	var newKeys = [];
	var newHash = {};
	for (var i = 0; i < oldKeys.length; i++) {
		newKeys.push(replaceStringWithFilterHeading(oldKeys[i]));
	}
	for (var i = 0; i < oldKeys.length; i++) {
		newHash[newKeys[i]] = oldHash[oldKeys[i]];
	}
	return newHash;
}

function sortPostsIntoSections(hash) {
	var hashLength = returnHashKeys(hash).length;
	for (key in hash) {
		var postScroller = Alloy.createController('postScroller');
		//cycle through hash keys
		postScroller.sectionTitle = key;
		stepIntoHash(hash, key, postScroller);
		Ti.API.info("Adding has been disabled for now");
		//$.vertView.add(postScroller);
	}
}

function stepIntoHash(hash, key, scroller) {
	//This level is a list of dictionaries
	var length = hash[key].length;
	for (var i = 0; i < length; i++) {
		//send single dictionary
		dict = hash[key][i];
		stepIntoPostDictionaryCollection(dict, scroller);
	}
}

function stepIntoPostDictionaryCollection(dict, scroller) {
	//This level is a single dictionary
	var length = returnHashKeys(dict).length;
	var post = Alloy.createModel('post');
	for (var i = 0; i < length; i++) {
		//send single key
		key = returnHashKeys(dict)[i];
		stepIntoPostDictionary(dict, key, post);
	}

	Ti.API.info("Post: " + JSON.stringify(post));

	//scroller.posts.add(post);
}

function stepIntoPostDictionary(dict, key, post) {
	//This level is a key
	//examine key-value pair
	if (key == "name") {
		post.set({name: dict[key]});
	}
	if (key == "image") {
		post.set({image: dict[key]});
	}
}

function init() {
	$.sortSwitch.value = false;

	//alert("did this work? " + JSON.stringify(alloy.collection.filters));

	setSwitchEvent();
	retrieveComponentData();
}

init();
