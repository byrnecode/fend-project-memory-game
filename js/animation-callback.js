// ANIMCALLBACK Module
// Detect the end of a CSS transition or animation and then trigger a function.
// https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/
const ANIMCALLBACK = (function () {
	
	// **************************************************************************
	// PRIVATE
	// **************************************************************************
	
	// Function for CSS transition callback
	const whichTransitionEvent = function () {
		var t,
				el = document.createElement("fakeelement");

		var transitions = {
			"transition"      : "transitionend",
			"OTransition"     : "oTransitionEnd",
			"MozTransition"   : "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		}

		for (t in transitions){
			if (el.style[t] !== undefined){
				return transitions[t];
			}
		}
	}
	
	// Function for CSS animation callback
	const whichAnimationEvent = function () { 
		var t,
				el = document.createElement("fakeelement");

		var animations = {
			"animation"      : "animationend",
			"OAnimation"     : "oAnimationEnd",
			"MozAnimation"   : "animationend",
			"WebkitAnimation": "webkitAnimationEnd"
		}

		for (t in animations){
			if (el.style[t] !== undefined){
				return animations[t];
			}
		}
	};
	
	// **************************************************************************
	// PUBLIC
	// **************************************************************************
	
	return {
		whichTransitionEvent: whichTransitionEvent,
		whichAnimationEvent: whichAnimationEvent
	};
	
}()); // end ANIMCALLBACK