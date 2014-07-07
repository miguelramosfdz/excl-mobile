var args = arguments[0] || {};
var component = args;
var componentID = component.get('id');
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

var hashOrderedPostsBySection = {};
var hashOrderedPostsByAge = {};
var selectedAges;

var allPosts;
var initialLoad = false;
var genericAllAgesSectionTitle = "For Everyone in Your Group";
var noContentMessage = "Sorry!\n\nLooks like we're still in the\nprocess of adding content here.\n\nCheck here later for new and\nexciting activities!";

var dataRetriever = Alloy.Globals.setPathForLibDirectory('dataRetriever/dataRetriever');
var viewService = Alloy.Globals.setPathForLibDirectory('customCalls/viewService');
var view = new viewService();
var labelService = Alloy.Globals.setPathForLibDirectory('customCalls/labelService');
var label = new labelService();
var loadingSpinner = Alloy.Globals.setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();

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

Alloy.Models.app.on("change:customizeLearning", detectEvent);
var ageFilterOn;

function changeTitleOfThePage(name) {
	$.componentLanding.title = name;
}

function goToPostLandingPage(e) {
	var post = fetchPostById(e.source.itemId);
	var analyticsTitle = component.getScreenName() + '/' + post.name;
	var analyticsLevel = "Post Landing";
	var controller = Alloy.createController('postLanding', post);
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
}

function checkPostViewSpacing() {
	if (OS_IOS) {
		$.scrollView.bottom = "48dip";
	}
}

function clearOrderedPostHashes() {
	hashOrderedPostsBySection = {};
	hashOrderedPostsByAge = {};
	$.scrollView.removeAllChildren();
}

function detectEvent() {
	ageFilterOn = Alloy.Models.app.get("customizeLearning");
	Ti.API.info("Age Filter On: " + ageFilterOn);
	clearOrderedPostHashes();
	addSpinner();
	retrieveComponentData(ageFilterOn);
}

function retrieveComponentData(ageFilterOn) {
	clearOrderedPostHashes();
	addSpinner();
	if (!initialLoad) {
		dataRetriever.fetchDataFromUrl(url, function(returnedData) {
			changeTitleOfThePage(returnedData.data.component.name);
			allPosts = returnedData.data.component.posts;
			initialLoad = true;
			checkIfAgeFilterOn(allPosts, ageFilterOn);
			checkPostViewSpacing();
			removeSpinner();
		});
	} else {
		checkIfAgeFilterOn(allPosts);
		checkPostViewSpacing();
	}
}

function addSpinner() {
	spinner.addTo($.topBar);
	spinner.show();
}

function removeSpinner() {
	spinner.hide();
}

function checkIfAgeFilterOn(allPosts) {
	if (ageFilterOn == true) {
		organizeByAge(allPosts);
		Ti.API.info("All sections: " + JSON.stringify(returnHashKeys(hashOrderedPostsByAge)));
	} else if (ageFilterOn == false) {
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
	sortPostsIntoSections(hashOrderedPostsBySection);
	Ti.API.info("Organized Content: " + JSON.stringify(hashOrderedPostsBySection));
	Ti.API.info("Finished Organizing by Section");
	checkPostViewSpacing();
}

function compileHashOfSections(post, hash) {
	if (post.section) {
		addItemArrayToHash(post.section, post, hash);
	}
}

function organizeByAge(allPosts) {
	hashOrderedPostsByAge = {};
	selectedAges = parseFilterHashIntoArray(JSON.stringify(Alloy.Collections.filter));
	Ti.API.info("Age Filter: " + JSON.stringify(selectedAges));

	for (var i = 0; i < allPosts.length; i++) {
		compileHashOfSelectedAgesToPostAgeRange(selectedAges, hashOrderedPostsByAge, allPosts[i]);
	}
	hashOrderedPostsByAge = replaceHashKeysWithFilterHeadings(hashOrderedPostsByAge);
	sortPostsIntoSections(hashOrderedPostsByAge);

	Ti.API.info("Organized Content: " + JSON.stringify(hashOrderedPostsByAge));
	Ti.API.info("Finished Filtering by Age");
	checkPostViewSpacing();
}

function returnHashKeys(hash) {
	var listKeys = [];
	for (key in hash) {
		listKeys.push(key);
	}
	return listKeys;
}

function checkIfArrayInArray(arySmall, aryLarge) {
	if (checkIfAbbrevArray(aryLarge)) {
		return true;
	}
	if (JSON.stringify(arySmall) == JSON.stringify(aryLarge)) {
		return true;
	}
	lengthSmall = arySmall.length;
	lengthLarge = aryLarge.length;

	if (lengthSmall > lengthLarge) {
		var holder = arySmall;
		arySmall = aryLarge;
		aryLarge = holder;
	}
	for (var i = 0; i < arySmall.length; i++) {
		for (var j = 0; j < aryLarge.length; j++) {
			if (aryLarge[j] == arySmall[i]) {
				if (i == arySmall.length - 1) {
					return true;
				}
			}
		}
	}
	return false;
}

function checkIfAbbrevArray(ary) {
	if (ary.length == 1 && ary[0] == "0") {
		return true;
	}
	return false;
}

function compileHashOfSelectedAgesToPostAgeRange(selectedAges, hashOrderedPostsByAge, post) {
	var postAgeRange = repairEmptyAgeRange(post.age_range);
	postAgeRange = parseStringIntoArray(String(postAgeRange), ", ");

	if (checkIfArrayInArray(postAgeRange, selectedAges)) {
		Ti.API.info("1-Adding to zed: " + JSON.stringify(post));
		addItemArrayToHash("0", post, hashOrderedPostsByAge);
	} else if (checkIfAbbrevArray(postAgeRange)) {
		Ti.API.info("2-Adding to zed: " + JSON.stringify(post));
		addItemArrayToHash("0", post, hashOrderedPostsByAge);
	} else {
		Ti.API.info("3-Adding to other: " + JSON.stringify(post));
		for (var i = 0; i < selectedAges.length; i++) {
			var itemArray = createPostArray(postAgeRange, selectedAges[i], post);
			addItemArrayToHash(selectedAges[i], itemArray, hashOrderedPostsByAge);
		}
	}
}

function addItemArrayToHash(key, itemArray, hash) {
	if (JSON.stringify(itemArray) != ["0"]) {
		if (hash[key]) {
			hash[key] = hash[key].concat(itemArray);
		} else {
			hash[key] = [].concat(itemArray);
		}
	} else {
		Ti.API.info("Empty Array prevented: " + JSON.stringify(itemArray));
	}
}

function createPostArray(postAgeRange, selectedAge, post) {
	var itemArray = [];
	for (var i = 0; i < postAgeRange.length; i++) {
		if (postAgeRange[i] == selectedAge) {
			itemArray.push(post);
		}
	}
	return itemArray;
}

function repairEmptyAgeRange(ageRange) {
	if (ageRange == "a:0:{}") {
		return "0";
	} else {
		return ageRange;
	}
}

function parseStringIntoArray(st, deliniator) {
	var output;
	if (deliniator.length >= String(st).length) {
		return st.split();
	} else {
		for (var i = 0; i < st.length - deliniator.length + 1; i++) {
			if (st.substring(i, i + deliniator.length) == deliniator) {
				return st.split(deliniator);
			}
		}
		return st.split();
	}
}

function replaceStringWithFilterHeading(st) {
	var newSt = "";
	if (st == "0") {
		newSt = genericAllAgesSectionTitle;
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
	var hashKeys = returnHashKeys(hash);
	var hashLength = hashKeys.length;
	var bolEmpty;
	if (hashLength == 0) {
		var error = label.createLabel(noContentMessage);
		var errorView = view.createView();
		errorView.add(error);
		$.scrollView.add(errorView);
	} else {
		for (var i = 0; i < hashLength; i++) {
			//cycle through hash keys
			var postCollection = Alloy.createCollection('post');
			stepIntoHash(hash, hashKeys[i], postCollection);
			Ti.API.info("key: " + JSON.stringify(hashKeys[i]) + ", postCollection: " + JSON.stringify(postCollection));
			if (hashKeys[i] == genericAllAgesSectionTitle) {
				if (JSON.stringify(postCollection) != "[]") {
					args = {
						posts : postCollection
					};
					bolEmpty = "false";
					addPostScroller(i, hashKeys[i], hashLength, postCollection, bolEmpty);
				}
			} else if (hashKeys[i] != genericAllAgesSectionTitle) {
				if (JSON.stringify(postCollection) != "[]") {
					args = {
						posts : postCollection
					};
					bolEmpty = "false";
					addPostScroller(i, hashKeys[i], hashLength, postCollection, bolEmpty);
				} else {
					args = "";
					bolEmpty = "true";
					addPostScroller(i, hashKeys[i], hashLength, postCollection, bolEmpty);
				}
			}
		}
	}
}

function addPostScroller(i, title, hashLength, postCollection, bolEmpty) {
	var view = createPostScroller(title, postCollection);
	view = adjustViewHeight(view, i, hashLength, bolEmpty);
	$.scrollView.add(view);
}

function createPostScroller(title, postCollection) {
	var postScroller = Alloy.createController('postScroller', args);
	postScroller.sectionTitle.text = title;
	return postScroller.getView();
}

function adjustViewHeight(view, i, hashLength, bolEmpty) {
	var tempView = view;
	tempView.top = "0";

	Ti.API.info("empty? " + bolEmpty);

	if (bolEmpty == "false") {
		if (OS_IOS) {
			tempView.height = "60%";
		} else {
			tempView.height = "340dip";
		}
	} else {
		tempView.height = "150dip";
	}
	if (i == hashLength - 1) {
		tempView.bottom = "60dip";
	}
	return tempView;
}

function stepIntoHash(hash, key, postCollection) {
	//This level is a list of dictionaries
	var dictList = hash[key];
	for (var i = 0; i < dictList.length; i++) {
		//send single dictionary
		dict = dictList[i];
		stepIntoPostDictionaryCollection(dict, postCollection);
	}
}

function stepIntoPostDictionaryCollection(dict, postCollection) {
	//This level is a single dictionary
	var length = returnHashKeys(dict).length;
	var post = Alloy.createModel('post');
	for (var i = 0; i < length; i++) {
		//send single key
		key = returnHashKeys(dict)[i];
		stepIntoPostDictionary(dict, key, post);
	}
	post.set({
		raw : dict
	});
	postCollection.add(post);
}

function stepIntoPostDictionary(dict, key, post) {
	//This level is a key >>> examine key-value pair
	if (key == "name") {
		post.set({
			name : dict[key]
		});
	}
	if (key == "image") {
		post.set({
			image : dict[key]
		});
	}
}

function parseFilterHashIntoArray(ary) {
	var newAry = ["0"];
	ary = JSON.parse(ary);
	for (var i = 0; i < ary.length; i++) {
		var hash = ary[i];
		if (hash["active"] == true) {
			newAry.push(hash["name"]);
		}
	}
	return newAry;
}

detectEvent();
