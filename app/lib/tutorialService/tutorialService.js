var rootPath = (typeof Titanium == 'undefined')? '../../lib/' : '';

var TutorialService = function() {
	this.initializePagesToShowTutorial();
};

TutorialService.prototype.getStorageService = function() {
	if (!this.storageService) {
		var StorageService = require(rootPath + "storageService/storageService");
		this.storageService = new StorageService();
	}
	return this.storageService;
};

TutorialService.prototype.setStorageService = function(storageService) {
	this.storageService = storageService;
};

TutorialService.prototype.getNavService = function() {
	if (!this.navService) {
		var NavigationController = require(rootPath + "navigationService/NavigationController");
		this.navService = new NavigationController();
	}
	return this.navService;
};

TutorialService.prototype.setNavService = function(navService) {
	this.navService = navService;
};

TutorialService.prototype.getAlloyService = function() {
	if (!this.alloyService) {
		var AlloyService = require(rootPath + "customCalls/alloyService");
		this.alloyService = new AlloyService();
	}
	return this.alloyService;
};

TutorialService.prototype.setAlloyService = function(alloyService) {
	this.alloyService = alloyService;
};

TutorialService.prototype.initializePagesToShowTutorial = function() {
	var storage = this.getStorageService();
	if (!storage.getBoolProperty("tutorialInitialized")) {
		this.setAllPagesTo(true);
		storage.setBoolProperty("tutorialInitialized", true);
	}
};

TutorialService.prototype.resetTutorialMode = function() {
	this.setAllPagesTo(true);
};

TutorialService.prototype.endTutorialMode = function() {
	this.setAllPagesTo(false);
};

TutorialService.prototype.setAllPagesTo = function(trueOrFalse) {
	var storage = this.getStorageService();
	var pages = ["exhibitLandingTutorial", "componentLandingTutorial", "postLandingTutorial"];
	for (var i = 0; i < pages.length; i++) {
		storage.setBoolProperty(pages[i], trueOrFalse);
	}
	this.updateIsTutorialOn();
};

TutorialService.prototype.checkTutorialForPage = function(page) {
	var pageName = this.getPageNameFromWindow(page);
	var storage = this.getStorageService();
	var showTutorial = storage.getBoolProperty(pageName);
	return (showTutorial) ? pageName : false;
};

TutorialService.prototype.markAsSeen = function(pageName) {
	var storage = this.getStorageService();
	storage.setBoolProperty(pageName, false);
	this.updateIsTutorialOn();
};

TutorialService.prototype.updateIsTutorialOn = function() {
	var storage = this.getStorageService();
	if (this.isAnyPageOn()) {
		storage.setBoolProperty("tutorialOn", true);
		Alloy.Models.app.set("tutorialOn", true);
	} else {
		storage.setBoolProperty("tutorialOn", false);
		Alloy.Models.app.set("tutorialOn", false);
	}
};

TutorialService.prototype.isAnyPageOn = function() {
	var storage = this.getStorageService();
	var anyPageIsOn = false;
	var pages = ["exhibitLandingTutorial", "componentLandingTutorial", "postLandingTutorial"];
	for (var i = 0; i < pages.length; i++) {
		if(storage.getBoolProperty(pages[i])) {
			anyPageIsOn = true;
		}
	}
	return anyPageIsOn;
};

TutorialService.prototype.gotIt = function(page) {
	var storage = this.getStorageService();
	storage.setBoolProperty(page, false);
};

TutorialService.prototype.getPageNameFromWindow = function(page) {
	var pageName = page.analyticsPageLevel.replace(/\s/g, '') + "Tutorial";
	return pageName.charAt(0).toLowerCase() + pageName.substr(1);
};

module.exports = TutorialService;