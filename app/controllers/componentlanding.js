//Testing variable
//var selectedAges = ["0", "4", "6", "13+"];
var selectedAges = parseFilterHashIntoArray(JSON.stringify(Alloy.Collections.filter));
//will become: alloy.collection.filter
////

var args = arguments[0] || {};
var component = args;
var componentID = component.get('id');
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

var hashOrderedPostsBySection = {};
var hashOrderedPostsByAge = {};

var allPosts;
var initialLoad = false;
var genericAllAgesSectionTitle = "For All Selected Ages";

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

// function checkPostViewSpacing() {
// if (OS_IOS) {
// $.scrollView.bottom = "48dip";
// }
// }

function clearOrderedPostHashes() {
	hashOrderedPostsBySection = {};
	hashOrderedPostsByAge = {};
	$.scrollView.removeAllChildren();
}

function setSwitchEvent(view) {
	//DEPRECIATED///////////////////////////////////////////////////////////////////////
	$.sortSwitch.addEventListener("change", function(e) {
		Ti.API.info("Switch toggled: " + $.sortSwitch.value);
		clearOrderedPostHashes();
		addSpinner();
		retrieveComponentData();
	});
}

function retrieveComponentData() {
	if (!initialLoad) {
		dataRetriever.fetchDataFromUrl(url, function(returnedData) {
			changeTitleOfThePage(returnedData.data.component.name);
			allPosts = returnedData.data.component.posts;
			initialLoad = true;
			checkIfAgeFilterOn(allPosts);
			//checkPostViewSpacing();
		});
	} else {
		checkIfAgeFilterOn(allPosts);
		//checkPostViewSpacing();
	}
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
	if ($.sortSwitch.value == true) {
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
	sortPostsIntoSections(hashOrderedPostsBySection);
	Ti.API.info("Organized Content: " + JSON.stringify(hashOrderedPostsBySection));
	Ti.API.info("Finished Organizing by Section");
	//checkPostViewSpacing();
}

function compileHashOfSections(post, hash) {
	if (post.section) {
		addItemArrayToHash(post.section, post, hash);
	}
}

function organizeByAge(allPosts) {
	hashOrderedPostsByAge = {};
	for (var i = 0; i < allPosts.length; i++) {
		compileHashOfSelectedAgesToPostAgeRange(selectedAges, hashOrderedPostsByAge, allPosts[i]);
	}
	hashOrderedPostsByAge = replaceHashKeysWithFilterHeadings(hashOrderedPostsByAge);
	sortPostsIntoSections(hashOrderedPostsByAge);
	
	
	Ti.API.info("Organized Content: " + JSON.stringify(hashOrderedPostsByAge));
	Ti.API.info("Finished Filtering by Age");
	//checkPostViewSpacing();
}

function returnHashKeys(hash) {
	var listKeys = [];
	for (key in hash) {
		listKeys.push(key);
	}
	return listKeys;
}

function compileHashOfSelectedAgesToPostAgeRange(selectedAges, hashOrderedPostsByAge, post) {
	var postAgeRange = repairEmptyAgeRange(post.age_range);
	postAgeRange = parseStringIntoArray(String(postAgeRange), ", ");
	if ((postAgeRange != selectedAges && selectedAges.length != 1) || postAgeRange == "0" || (selectedAges.length == 1 && selectedAges[0] == "0")) {
		addItemArrayToHash("0", post, hashOrderedPostsByAge);
	} else {
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
	for (var i = 0; i < hashLength; i++) {
		//cycle through hash keys
		var postCollection = Alloy.createCollection('post');
		stepIntoHash(hash, hashKeys[i], postCollection);
		
		Ti.API.info("key: " + JSON.stringify(hashKeys[i]) + ", postCollection: " + JSON.stringify(postCollection));

		//if (hashKeys[i] != genericAllAgesSectionTitle && JSON.stringify(postCollection) != "[]") {
		if (JSON.stringify(postCollection) != "[]") {

			args = {
				posts : postCollection
			};
		}
		var postScroller = Alloy.createController('postScroller', args);
		postScroller.sectionTitle.text = hashKeys[i];

		$.scrollView.add(postScroller.getView());
	}

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
	//Ti.API.info("Post: " + JSON.stringify(post));
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

function init() {
	$.sortSwitch.value = false;
	setSwitchEvent();
	retrieveComponentData();

	Ti.API.info("Age Filter: " + JSON.stringify(selectedAges));

}

init();
