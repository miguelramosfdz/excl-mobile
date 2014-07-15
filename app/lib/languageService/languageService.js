function languageService(){
	this.museumJSON = [];
};

languageService.prototype.getLanguageOptionsTwoLetterCodeFromJSON = function(){
	languageOptionsTwoLetter = ['en', 'es', 'af'];
	return languageOptionsTwoLetter;
};

languageService.prototype.twoLetterToFullWord = function(twoLetter){
	var toReturn = "";
	var length = this.languageLibrary.length;
	for (i = 0; i<length; i++){
		if (this.languageLibrary[i][0] == twoLetter){
			Ti.API.info("Found a match! " + this.languageLibrary[i][0]);
			return this.languageLibrary[i][2];
		}
	}
	return ""; //TODO: Accommodate language not found
};

languageService.prototype.getLanguageOptionsFullWord = function(languageOptionsTwoLetter){
	var languageOptionsFullWord = ["", "", ""];
	var twoLetter = languageOptionsTwoLetter;
	var length = languageOptionsTwoLetter.length;
	
	for (toFind in languageOptionsTwoLetter){
		languageOptionsFullWord[toFind] = this.twoLetterToFullWord(languageOptionsTwoLetter[toFind]);
		Ti.API.info(toFind + " to " + languageOptionsFullWord[toFind]);
	}

	return languageOptionsFullWord;
};

languageService.prototype.configureCancel = function(languageOptionsTwoLetter, languageOptionsFullWord){
	languageOptionsTwoLetter.push('CANCEL');
	if (OS_IOS){
		languageOptionsFullWord.push('Cancel');
	}
	cancelIndex = OS_IOS? (languageOptionsFullWord.length - 1) : languageOptionsFullWord.length;
	return cancelIndex;
};

languageService.prototype.displayDialog = function(){
	languageOptionsTwoLetterCode = this.getLanguageOptionsTwoLetterCodeFromJSON();
	languageOptionsFullWord = this.getLanguageOptionsFullWord(languageOptionsTwoLetterCode);
	cancelIndex = this.configureCancel(languageOptionsTwoLetterCode, languageOptionsFullWord);
	
	var languageDialog = Titanium.UI.createOptionDialog({
		options : languageOptionsFullWord,	
		cancel : cancelIndex,
		selectedIndex : languageOptionsTwoLetterCode.indexOf(Alloy.Globals.currentLanguage)
	});
	languageDialog.addEventListener("click", function(e){
		languageService.prototype.languageDialogClickListener(e, languageOptionsTwoLetterCode);
	});
	
	languageDialog.show();
};

languageService.prototype.languageDialogClickListener = function(e, languageOptionsTwoLetterCode){
	var currentLanguage = languageOptionsTwoLetterCode[e.index];
		
	if (currentLanguage != 'CANCEL'){
		Alloy.Globals.currentLanguage = currentLanguage;
		if (currentLanguage != 'en'){
			alert("We'll display this language's content where we can. Anything not translated will appear in English.");
		}
	}
};	
	
languageService.prototype.languageLibrary = [
	['af', 'af', 'Afrikaans'],
	['ar', 'ar', 'العربية', 'rtl'],
	['be', 'be_BY', 'Беларуская мова'],
	['bg', 'bg_BG', 'български'],
	['bs', 'bs_BA', 'Bosanski'],
	['ca', 'ca', 'Català'],
	['cs', 'cs_CZ', 'Čeština'],
	['cy', 'cy', 'Cymraeg'],
	['da', 'da_DK', 'Dansk'],
	['de', 'de_DE', 'Deutsch'],
	['el', 'el', 'Ελληνικά'],
	['en', 'en_CA', 'English'],
	['en', 'en_US', 'English'],
	['eo', 'eo', 'Esperanto'],
	['es', 'es_CL', 'Español'],
	['es', 'es_ES', 'Español'],
	['es', 'es_PE', 'Español'],
	['es', 'es_VE', 'Español'],
	['et', 'et', 'Eesti'],
	['fa', 'fa_AF', 'فارسی', 'rtl'],
	['fa', 'fa_IR', 'فارسی', 'rtl'],
	['fi', 'fi', 'Suomi'],
	['fo', 'fo', 'Føroyskt'],
	['fr', 'fr_FR', 'Français'],
	['fy', 'fy', 'Frysk'],
	['gd', 'gd', 'Gàidhlig'],
	['gl', 'gl_ES', 'Galego'],
	['he', 'he_IL', 'עברית', 'rtl'],
	['hi', 'hi_IN', 'हिन्दी'],
	['hr', 'hr', 'Hrvatski'],
	['hu', 'hu_HU', 'Magyar'],
	['id', 'id_ID', 'Bahasa Indonesia'],
	['is', 'is_IS', 'Íslenska'],
	['it', 'it_IT', 'Italiano'],
	['ja', 'ja', '日本語'],
	['jv', 'jv_ID', 'Basa Jawa'],
	['ka', 'ka_GE', 'ქართული'],
	['kk', 'kk', 'Қазақ тілі'],
	['ko', 'ko_KR', '한국어'],
	['ku', 'ckb', 'کوردی', 'rtl'],
	['lo', 'lo', 'ພາສາລາວ'],
	['lt', 'lt_LT', 'Lietuviškai'],
	['lv', 'lv', 'Latviešu valoda'],
	['mk', 'mk_MK', 'македонски јазик'],
	['mn', 'mn', 'Монгол хэл'],
	['ms', 'ms_MY', 'Bahasa Melayu'],
	['my', 'my_MM', 'ဗမာစာ'],
	['nb', 'nb_NO', 'Norsk Bokmål'],
	['ne', 'ne_NP', 'नेपाली'],
	['nl', 'nl_NL', 'Nederlands'],
	['nn', 'nn_NO', 'Norsk Nynorsk'],
	['pl', 'pl_PL', 'Polski'],
	['pt', 'pt_BR', 'Português'],
	['pt', 'pt_PT', 'Português'],
	['ro', 'ro_RO', 'Română'],
	['ru', 'ru_RU', 'Русский'],
	['si', 'si_LK', 'සිංහල'],
	['sk', 'sk_SK', 'Slovenčina'],
	['sl', 'sl_SI', 'Slovenščina'],
	['so', 'so_SO', 'Af-Soomaali'],
	['sq', 'sq', 'Shqip'],
	['sr', 'sr_RS', 'Српски језик'],
	['su', 'su_ID', 'Basa Sunda'],
	['sv', 'sv_SE', 'Svenska'],
	['ta', 'ta_LK', 'தமிழ்'],
	['th', 'th', 'ไทย'],
	['tr', 'tr_TR', 'Türkçe'],
	['ug', 'ug_CN', 'Uyƣurqə'],
	['uk', 'uk', 'Українська'],
	['ur', 'ur', 'اردو', 'rtl'],
	['uz', 'uz_UZ', 'Oʻzbek'],
	['vec', 'vec', 'Vèneto'],
	['vi', 'vi', 'Tiếng Việt'],
	['zh', 'zh_CN', '中文 (中国)'],
	['zh', 'zh_HK', '中文 (香港)'],
	['zh', 'zh_TW', '中文 (台灣)'],
];

module.exports = languageService;