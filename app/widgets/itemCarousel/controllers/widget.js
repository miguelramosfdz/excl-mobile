var args = arguments[0] || {};

var index;
var numOfItems;
var carouselView;
var itemViews;

function init(){
	numOfItems = 0;
	index = 0;
	itemViews = [];
	if(args)
		Ti.API.info(args);
};

$.addItem = function(item, onClick){
	itemViews[numOfItems] = createLabeledPicView(item);
	itemViews[numOfItems].itemId = item.id;
	itemViews[numOfItems].addEventListener("click", onClick);		
	$.carouselView.add(itemViews[numOfItems]);
	if(numOfItems!=0)
		itemViews[numOfItems].opacity = 0;
	numOfItems++;
};

// Extract into a service in the Lib folder -> make into a widget when we write this in XML
function createLabeledPicView(item){
	var itemContainer = Ti.UI.createView();
	var image = Ti.UI.createImageView({
		height: '100%',
		width: '100%',
		itemId: item.id
	});
	image.image = item.image;
	
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
		left: 10,
		color: 'white',
		font: {
			fontFamily : 'Arial',
			fontSize : '25dp',
			fontWeight : 'bold'
		}
	});

	titleLabel.add(label);

	return titleLabel;
}

function swipeHandler(e){
	if(numOfItems>0){
		if(e.direction = 'right'){
			itemViews[index].opacity = 0;
			// Incrememnt Index
			index= (index+1)%numOfItems;
			// Show new exhibit and it's 
			itemViews[index].opacity = 1;
		}
		else if(e.direction = 'left'){
			itemViews[index].opacity = 0;
			index--;
			// Decrement index 
			if(index=-1)
				index=numOfItems -1;
			// Show new Exhibit and it's contents
			itemViews[index].opacity = 1;
		}
	}
}

init();
