var args = arguments[0] || {};

//-----------------------------------------------------------------------------------------------------------------------------------------
//   JSON ISH
//-----------------------------------------------------------------------------------------------------------------------------------------

var json = {
  "status": "ok",
  "error": "Optional Error Message",
  "data": {
    "component": {
      "id": 12345,
      "name": "Cups and Balls",
      "posts" : [
        {
          "section": "What Do I Do?",
          "id": 001,
          "name": "Example 1",
          "thumbnail": "https://www.tannens.com/shop/secure/images/products/1995.jpg",
          "parts": [ 
            {
              "type": "video",
              "url" : "http://vimeo.com/86796095",
              "thumbnail": "http://vimeo.com/86796095"
            },
            {
              "type": "text",
              "body": "This is how you use cups and balls! XD"
            },

          ],
          "liking": false,
          "sharing": true,
          "commenting": true,
          "default-message": "#cmh #cupsandballs is awesome!",
          "like-count": 180,
          "comments": [
            {
              "body": "Nice!!"
            }
          ]
        },        
		{
          "section": "What Do I Do?",
          "id": 002,
          "name": "Example 2",
          "thumbnail": "http://www.johnsonmagicproducts.com/shop/images/CupsandBalls.png",
          "parts": [ 
            {
              "type": "video",
              "url" : "https://www.youtube.com/watch?v=itoK3KIbrxQ",
              "thumbnail": "https://www.youtube.com/watch?v=itoK3KIbrxQ"
            },
            {
              "type": "text",
              "body": "Another thing you can do with cups and balls!"
            },

          ],
          "liking": true,
          "sharing": true,
          "commenting": true,
          "default-message": "#cmh is awesome!",
          "like-count": 20,
          "comments": [
            {
              "body": "Now we're talking!"
            }
          ]
        },
		{
          "section": "What Do I Do?",
          "id": 003,
          "name": "Example 3",
          "thumbnail": "http://www.proginosko.com/wordpress/wp-content/uploads/cup-and-ball-trick.jpg",
          "parts": [ 
            {
              "type": "image",
              "url" : "http://www.proginosko.com/wordpress/wp-content/uploads/cup-and-ball-trick.jpg",
              "thumbnail" : "http://www.proginosko.com/wordpress/wp-content/uploads/cup-and-ball-trick.jpg"
            },
            {
              "type": "text",
              "body": "The cups and balls is a classic performance of magic with innumerable adaptations. The effect known as acetabula et calculi was performed by Roman conjurers as far back as two thousand years ago.[1] One popularly circulated picture, thought to date from 2500 B.C. from the walls of a burial chamber in Beni Hasan, Egypt,[2] shows two men kneeling over four inverted bowls. It was taken by early Egyptologists Wilkinson[3] and Newberry[4] as evidence that the cups and balls effect, or its related deceptive gambling game, thimblerig, possibly dates back to Ancient Egypt. Because of its context, modern Egyptologists regard the image as a game using pots[5] or cups[6] but details of the game are unknown. The illustration is unique in ancient Egyptian art, so whether or not the game utilizes sleight of hand trickery may never be known unless a future discovery produces a similar image in a more explanatory context."
            },

          ],
          "liking": true,
          "sharing": true,
          "commenting": true,
          "default-message": "#cmh is awesome!",
          "like-count": 100,
          "comments": [
            {
              "body": "What a great media file you have!"
            }
          ]
        },
		
		{
          "section": "How Does It Work?",
          "id": 101,
          "name": "Gravity",
          "thumbnail": "http://discovermagazine.com/~/media/Images/Issues/2013/July-Aug/apple-gravity.jpg",
          "parts": [ 
            {
              "type": "video",
              "url" : "http://shows.howstuffworks.com/stuff-to-blow-your-mind/51310-stuff-to-blow-your-kids-mind-gravity-video.htm",
              "thumbnail": "http://discovermagazine.com/~/media/Images/Issues/2013/July-Aug/apple-gravity.jpg"
            },
            {
              "type": "text",
              "body": "Every time you jump, you experience gravity. It pulls you back down to the ground. Without gravity, you'd float off into the atmosphere -- along with all of the other matter on Earth. You see gravity at work any time you drop a book, step on a scale or toss a ball up into the air. It's such a constant presence in our lives, we seldom marvel at the mystery of it -- but even with several well-received theories out there attempting to explain why a book falls to the ground (and at the same rate as a pebble or a couch, at that), they're still just theories. The mystery of gravity's pull is pretty much intact." 
            },

          ],
          "liking": true,
          "sharing": true,
          "commenting": true,
          "default-message": "#cmh is awesome!",
          "like-count": 9001,
          "comments": [
            {
              "body": "What a great media file you have!"
            }
          ]
        },
		
		{
          "section": "What Happens If?",
          "id": 201,
          "name": "What happens if you eat the ball",
          "thumbnail": "http://1.bp.blogspot.com/_A4ONWKn09vw/S8KBnfWnGOI/AAAAAAAADwI/GYM1hlwkwZs/s1600/dv755016.jpg",
          "parts": [ 
            {
              "type": "image",
              "url" : "http://1.bp.blogspot.com/_A4ONWKn09vw/S8KBnfWnGOI/AAAAAAAADwI/GYM1hlwkwZs/s1600/dv755016.jpg",
              "thumbnail" : "http://1.bp.blogspot.com/_A4ONWKn09vw/S8KBnfWnGOI/AAAAAAAADwI/GYM1hlwkwZs/s1600/dv755016.jpg"
            },
            {
              "type": "text",
              "body": "insert_text_here"
            },

          ],
          "liking": true,
          "sharing": true,
          "commenting": true,
          "default-message": "#cmh is awesome!",
          "like-count": 1,
          "comments": [
            {
              "body": ""
            }
          ]
        },
		
		{
          "section": "Why Do I Care?",
          "id": 301,
          "name": "Why You Should Care About Cups and Balls",
          "thumbnail": "http://petergreenberg.com/wp-content/uploads/2013/11/o-GRUMPY-CAT-MOVIE-facebook.jpg",
          "parts": [ 
            {
              "type": "image",
              "url" : "http://petergreenberg.com/wp-content/uploads/2013/11/o-GRUMPY-CAT-MOVIE-facebook.jpg",
              "thumbnail" : "http://petergreenberg.com/wp-content/uploads/2013/11/o-GRUMPY-CAT-MOVIE-facebook.jpg"
            },
            {
              "type": "text",
              "body": "Before asking why you *should* care, perhaps it would be worth thinking about the fact that you *do* care. Human beings are emotional and moral beings - we simply aren't capable of observing other people's behaviour without reacting emotionally and morally (though not always rightly!) to it. Because we are good at thinking, we can learn to override our initial emotional reactions and behave as detached, scientific observers in certain circumstances. But this requires an effort, even if we don't recognise it as such.We care about other people because we can't help it. When we cease to care altogether, we cease to function as humans. The important question, then, is how we live with caring about other people, given how painful and demanding that is."
            },

          ],
          "liking": true,
          "sharing": true,
          "commenting": true,
          "default-message": "#cmh is awesome!",
          "like-count": 0,
          "comments": [
            {
              "body": "Sorry, but I still don't care"
            }
          ]
        },
		{
          "section": "Do You Actually Care?",
          "id": 401,
          "name": "What do you think of cups and balls?",
          "thumbnail": "http://www.muscogeemoms.com/wp-content/uploads/2013/04/question-mark.jpg",
          "parts": [ 
            {
              "type": "image",
              "url" : "http://www.muscogeemoms.com/wp-content/uploads/2013/04/question-mark.jpg",
              "thumbnail" : "http://www.muscogeemoms.com/wp-content/uploads/2013/04/question-mark.jpg"
            },
            {
              "type": "text",
              "body": "Follow the URL below to give your input on how we can improve Cups and Balls!"
            },
            {
              "type": "poll",
              "url" : "http://sdfjsadfsd.com"
            }

          ],
          "liking": true,
          "sharing": true,
          "commenting": true,
          "default-message": "#cmh is awesome!",
          "like-count": 0,
          "comments": [
            {
              "body": ""
            }
          ]
        }
      ]
    }
  }
};


var postIndex = 0;
var tableData = [];
var postViews = [];
var numOfPosts = json.data.component.posts.length; //stores how many posts there are into a variable (shows how many post sections will be created)

/*-----------------------------------------------------------------------------------------------------------------------------------------
 * To do list
 * 
 * Set up the tableviewrows for each post
 */

var postSwipeableView = Ti.UI.createView({	
	top: '5%',
	backgroundColor: 'cyan'
});	// XML

var sectionHeading = Ti.UI.createLabel({
	color : 'black',
	font : {
		fontFamily : 'Arial',
		fontSize : 22,
		fontWeight : 'bold'
	},
	text : sectionHeading,
	textAlign : 'center',
});// XML


function createRow() {											//createPlainRow()
	var row = Ti.UI.createTableViewRow({
		height : '190dp',
		top: '10dp',
		backgroundColor : 'white',
	});
	return row;
}// XML


function createTitleLabel(name, type){
	var titleLabel = Ti.UI.createView({
		backgroundColor: 'black',
		opacity: 0.5,
		height: '20%',
		top: 0
	});
	var label = Ti.UI.createLabel({
		text: name,
		top: 0,
		left: 10,
		color: 'white',
		font: {
			fontFamily : 'Arial',
			fontSize : type,
			fontWeight : 'bold'
		}
	});
	
	titleLabel.add(label);
	return titleLabel;
}

function createLabeledPostView(item, type){				//createLabeledPicView()
	var itemContainer = Ti.UI.createView();
	
	var image = Ti.UI.createImageView({
		height: '100%',
		width: '100%'
	});
	image.image = item.image;
	
	itemContainer.add(image);
	itemContainer.add(createTitleLabel(item.name, type));
	return itemContainer;
}


function createPostCarousel(posts){							//createExhibitsCarousel()
	// These parts should be defined by TSS
	var row = createRow();									//createPlainRow()
	
	for(i=0; i>=posts.length; i++){
		postViews[i] = createLabeledPostView(posts[i], '22');		// will later say 'exhibit', and will create the pic item of that class
		postSwipeableView.add(postViews[i]);
		postViews[i].hide();
	}
	postViews[0].show();
	row.add(postSwipeableView);
	tableData.push(row);
}


function createHeadingRow() {
	var row = Ti.UI.createTableViewRow({
		height : '50dp',
		backgroundColor : 'cyan',
	});
	return row;
}// XML


function createSectionHeading(sectionHeadingText){
	var headingRow = createHeadingRow();	
	sectionHeading.text = sectionHeadingText;
	headingRow.add(sectionHeading);
	tableData.push(headingRow);
}

/*function swipeHandler(e){
	if(numOfExhibits>0){
		if(e.direction = 'right'){
			postViews[exhibitIndex].hide();
			removeComponents(exhibitIndex);
			
			// Incrememnt Index
			exhibitIndex= (exhibitIndex+1)%numOfExhibits;
			
			// Show new exhibit and it's 
			postViews[exhibitIndex].show();
			showComponents(exhibitIndex);
			setExhibitText(json.data.museum.exhibits[exhibitIndex]);
		}
		else if(e.direction = 'left'){
			postViews[exhibitIndex].hide();
			removeComponents(exhibitIndex);
			exhibitIndex--;
			
			// Decrement index 
			if(exhibitIndex=-1)
				exhibitIndex=numOfExhibits -1;
			
			// Show new Exhibit and it's contents
			postViews[exhibitIndex].show();
			showcomponents(exhibitIndex);
		}
	}
	//alert("swipe!");
}*/


function openPostLanding(e){
	var postLandingWindow = Alloy.createController('postlanding').getView;
	//Alloy.Globals.navController.open(postLandingWindow);
}


createPostCarousel(json.data.component.posts);   //pulls dummy data for function


var tableView = Ti.UI.createTableView({		//has to be under everything to work
	backgroundColor : 'white',
	data : tableData,
	width: '100%',
	height:'100%'
});


$.componentlanding.title = "Component landing loaded!";
$.componentlanding.add(tableView);
