var args = arguments[0] || {};

var index;
var numOfItems;
var carouselView;
var itemViews;
var extraRotateFunc = false;

function init(){
	numOfItems = 0;
	index = 0;
	itemViews = [];
	initArrows();
	if(args)
		Ti.API.info(args);
};

function initArrows(){
	$.leftArrow.addEventListener('click', rotateLeft);
	$.rightArrow.addEventListener('click', rotateRight);
}

$.addToRotateFunc = function(newHandler){
	extraRotateFunc = newHandler;
};

$.addItem = function(item, onClick){
	itemViews[numOfItems] = createLabeledPicView(item);
	itemViews[numOfItems].itemId = item.id;
	itemViews[numOfItems].addEventListener("click", onClick);		
	$.carouselView.add(itemViews[numOfItems]);
	if(numOfItems!=0){
		itemViews[numOfItems].zIndex = 0;
		$.leftArrow.zIndex = 2;
		$.rightArrow.zIndex = 2;
	}else{
		itemViews[numOfItems].zIndex = 1;
	}
	numOfItems++;
};

// Extract into a service in the Lib folder -> make into a widget when we write this in XML
function createLabeledPicView(item){
	var itemContainer = Ti.UI.createView();
	var image = Ti.UI.createImageView({
		height: '100%',
		width: '100%',
		itemId: item.id,
		
	});
	if( item.image)
		image.image = item.image;
	else
		image.image = 'http://placehold.it/700x300/556270';
	
	itemContainer.add(image);
	itemContainer.add(createTitleLabel(item.name));
	return itemContainer;
}

function createTitleLabel(name, type){
	var titleLabel = Ti.UI.createView({
		backgroundColor: 'black',
		opacity: 0.5,
		height: '20%',
		top: 0
	});
	//$.addClass(exhibitImages[i], "exhibitTitleShadow"); 
	
	var label = Ti.UI.createLabel({
		text: name,
		top: 0,
		left: "10dip",
		color: 'white',
		horizontalWrap: false,
		font: {
			fontFamily : 'Arial',
			fontSize : '25dip',
			fontWeight : 'bold'
		}
	});

	titleLabel.add(label);

	return titleLabel;
}

function swipeHandler(e){
	if(numOfItems>0){
		if(e.direction = 'right')
			rotateRight();
		else if(e.direction = 'left')
			rotateLeft();
	}
}

function rotateLeft(){
	
	if(extraRotateFunc)
		extraRotateFunc("left", index, numOfItems);
	
	itemViews[index].zIndex = 0;
	index--;			// Decrement index 
	
	if(index== -1)
		index=numOfItems -1;
	itemViews[index].zIndex = 1;
}

function rotateRight(){
	
	if(extraRotateFunc)
		extraRotateFunc("right", index, numOfItems);
	
	itemViews[index].zIndex = 0;
	index= (index+1)%numOfItems;
	itemViews[index].zIndex = 1;
}

init();
