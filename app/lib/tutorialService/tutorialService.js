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
	var pages = ["exhibitLandingTutorial", "componentLandingTutorial", "postLandingTutorial"];
	for (var i = 0; i < pages.length; i++) {
		if (!storage.getProperty(pages[i])) {
			storage.setProperty(pages[i], true);
		}
	}
};

TutorialService.prototype.endTutorialMode = function() {
	var storage = this.getStorageService();
	var pages = ["exhibitLandingTutorial", "componentLandingTutorial", "postLandingTutorial"];
	for (var i = 0; i < pages.length; i++) {
		if (!storage.getProperty(pages[i])) {
			storage.setProperty(pages[i], false);
		}
	}
};

String.prototype.lcfirst = function()
{
    return this.charAt(0).toLowerCase() + this.substr(1);
};

TutorialService.prototype.checkTutorialForPage = function(page) {
	var pageName = page.analyticsPageLevel.replace(/\s/g, '') + "Tutorial";
	pageName = pageName.lcfirst();
	Ti.API.info("checking for page " + pageName);
	var storage = this.getStorageService();
	var showTutorial = storage.getProperty(pageName);
	return (showTutorial) ? pageName : false;
};

module.exports = TutorialService;