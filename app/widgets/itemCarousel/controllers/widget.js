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
	itemViews[numOfItems].addEventListener("click", onClick);		
	$.carouselView.add(itemViews[numOfItems]);
	itemViews[numOfItems].hide();
	numOfItems++;
};

// Extract into a service in the Lib folder -> make into a widget when we write this in XML
function createLabeledPicView(item){
	var itemContainer = Ti.UI.createView();
	var image = Ti.UI.createImageView({
		height: '100%',
		width: '100%',
		itemId: 'blank'
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
			itemViews[index].hide();
			// Incrememnt Index
			index= (index+1)%numOfItems;
			// Show new exhibit and it's 
			itemViews[index].show();
		}
		else if(e.direction = 'left'){
			itemViews[index].hide();
			index--;
			// Decrement index 
			if(index=-1)
				index=numOfItems -1;
			// Show new Exhibit and it's contents
			itemViews[index].show();
		}
	}
}

init();
