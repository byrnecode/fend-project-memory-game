// APP Module
const APP = (function ($, swal, AC, stopwatch) {
	
	// **************************************************************************
	// PRIVATE
	// **************************************************************************
	
	let opened = [], // array for currently opened cards
			cards = $('.card'), // card items
			totalCards = cards.length, // total nubmer of cards
			cardMatched = 0, // matched cards counter
			moves = 0, // move counter
			rating = 3, // rating counter
			timeRunning = false; // time control
	
	const deck = $('.deck'), // deck container
				moveCounter = $('.moves'), // moves container
				stars = $('.stars'), // rating container
				starsDefault = $('.stars').html(), // initial rating content
				ratingThreeStar = 16, // max moves allowed to get 3 stars rating
				ratingTwoStar = 24, // max moves allowed to get 2 stars rating
				classOpen = 'open show', // class for 'open' cards
				classMatch = 'match', // class for 'match' cards
				classMisMatch = 'mismatch', // class for 'mismatch' cards
				classRatingIcon = 'fa', // class for rating icon
				classRatingFill = 'fa-star', // class for filled rating icon
				classRatingBlank = 'fa-star-o', // class for blank rating icon
				time = $('.stopwatch'), // total time container
				timeDefault = $('.stopwatch').html(); // total time default 00:00:00
	
	// Function to initialize APP module
	const init = function () {
		resetDeck();
	};
	
	// Shuffle function from http://stackoverflow.com/a/2450976
	const shuffle = function (array) {
		let currentIndex = array.length,
			temporaryValue, randomIndex;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};
	
	// Function to reset deck
	const resetDeck  = function () {
		// empty the 'opened' cards array
		opened = [];
		
		// reset card matched counter
		cardMatched = 0;
		
		// remove dynamic classes
		cards.removeClass(`${classMatch} ${classMisMatch} ${classOpen}`);
		
		// reset move counter
		resetMove();
		
		// reset rating
		resetRating();
		
		// stop and reset time
		timeRunning = false;
		stopwatch.restart();
		stopwatch.stop();
		time.html(timeDefault);
		
		// shuffle cards
		cards = shuffle(cards); 
		
		// clear deck
		deck.empty(); 
		
		// add cards to deck
		cards.each( function(card) {
			deck.append($(this));
		});
	};
	
	// Function to open and check cards
	// Params: jquery object or element that is being clicked
	const openCard = function (current) {
		
		// start time
		if (!timeRunning) {
			timeRunning = true;
			stopwatch.start();
		}
		
		// make sure it's not the same card
		if ( current.hasClass(classOpen) || current.hasClass(classMatch) ) {
			return;
		}
		
		// open card
		current.addClass(classOpen);
		
		// increment move counter
		countMove();

		// rating
		ratingCount();
		
		// check card after opening animation
		const transitionEvent = AC.whichTransitionEvent();
		current.one(transitionEvent, function(e) {
				cardChecker(current);
		});
		
	};
	
	// Function to check currently opened cards
	// Params: jquery object - element that is being clicked
	const cardChecker = function (current) {
		
		// store the current element
		// in the 'opened' cards array
		opened.push(current);
		
		// when 2 cards are opened
		if (opened.length === 2) {
			const firstOpened = opened[0],
						secondOpened = opened[1];
			
			// compare 2 opened cards through the 'data-card' attribute
			if ( firstOpened.attr('data-card') === secondOpened.attr('data-card') ) {
				correctMatch(firstOpened, secondOpened);
			}
			else {
				wrongMatch(firstOpened, secondOpened);
			}
			
			opened = []; // empty the 'opened' cards array
		}
		
	};
	
	// Function to set classes when cards are 'match'
	// Params: jquery object - first and second clicked card
	const correctMatch = function (firstCard, secondCard) {
		cardMatched += 2;
		winChecker();
		firstCard.addClass(classMatch).removeClass(classOpen);
		secondCard.addClass(classMatch).removeClass(classOpen);
	};
	
	// Function to set classes when cards are 'mismatch'
	// Params: jquery object - first and second clicked card
	const wrongMatch = function (firstCard, secondCard) {
		firstCard.addClass(classMisMatch);
		secondCard.addClass(classMisMatch);
		
		// check card after opening animation
		const animationEvent = AC.whichAnimationEvent();
		firstCard.one(animationEvent, function(e) {
				firstCard.removeClass(`${classMisMatch} ${classOpen}`);
		});
		secondCard.one(animationEvent, function(e) {
				secondCard.removeClass(`${classMisMatch} ${classOpen}`);
		});
		
	};

	// Function to check if game is won
	const winChecker = function () {
		if (cardMatched === totalCards) {
			// stop time
			timeRunning = false;
			stopwatch.stop();
			const totalTime = time.html();
			
			swal({
				title: 'You won!',
				text: `Your rating is: ${rating} star. Your total time is: ${totalTime}`,
				icon: 'success',
				buttons: ["Cancel", "Play again"]
			})
			.then((playAgain) => {
				if (playAgain) {
					resetDeck();
				}
			});
		}
	};
	
	// Function to increment move counter
	const countMove = function () {
		moves++;
		moveCounter.html(moves);
	};
	
	// Function to reset move counter
	const resetMove = function () {
		moves = 0;
		moveCounter.html(moves);
	};
	
	// Function for rating
	const ratingCount = function () {
		if ( ( (moves > ratingThreeStar) && (rating === 3) ) ||
				( (moves > ratingTwoStar) && (rating === 2) ) ) {
			stars.children(`:nth-child(${rating})`).find(`.${classRatingIcon}`).removeClass(classRatingFill).addClass(classRatingBlank);
			rating--;
		}
	};
	
	// Function to reset rating
	const resetRating = function () {
		rating = 3;
		stars.html(starsDefault);
	};
	
	
	// **************************************************************************
	// PUBLIC
	// **************************************************************************
	
	return {
		init: init,
		resetDeck: resetDeck,
		openCard: openCard
	};
	
}(jQuery, swal, ANIMCALLBACK, stopwatch)); // end APP Module



$(document).ready( function () {
	
	// initialize APP module
	APP.init();
	
	// when restart is clicked
	// reset everything
	$('.restart').click( function () {
		APP.resetDeck();
	});
	
	// card open and checking
	$('.deck').on( 'click', '.card', function () {
		APP.openCard( $(this) );
	});
	
});
