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

TutorialService.prototype.initializePagesToShowTutorial = function() {
	var storage = this.getStorageService();
	if (!storage.getProperty("tutorialInitialized")) {
		this.setAllPagesTo(true);
		storage.setProperty("tutorialInitialized", true);
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
		storage.setProperty(pages[i], trueOrFalse);
	}
};

TutorialService.prototype.checkTutorialForPage = function(page) {
	var pageName = this.getPageNameFromWindow(page);
	var storage = this.getStorageService();
	var showTutorial = storage.getProperty(pageName);
	return (showTutorial) ? pageName : false;
};

TutorialService.prototype.gotIt = function(page) {
	var storage = this.getStorageService();
	storage.setProperty(page, false);
};

TutorialService.prototype.getPageNameFromWindow = function(page) {
	var pageName = page.analyticsPageLevel.replace(/\s/g, '') + "Tutorial";
	return pageName.charAt(0).toLowerCase() + pageName.substr(1);
};

module.exports = TutorialService;