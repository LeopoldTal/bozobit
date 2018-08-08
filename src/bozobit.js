/**
* bozobit
* Flags Twitter users as bozos
**/

const BOZO_CLASS = 'bozobit-is-bozo';

const bozos = ['108024396']; // TODO: store in storage.sync

/* Mark individual tweets */

// Mark a tweet
// - add bozo class if user has bozo bit set
// - (TODO:)add menu controls to set/clear bozo bit
function markTweet(tweet) {
	let userId = tweet.dataset.userId;
	if (!userId) {
		return;
	}
	
	if (~bozos.indexOf(userId)) {
		tweet.classList.add(BOZO_CLASS);
	} else {
		tweet.classList.remove(BOZO_CLASS);
	}
	
	// TODO: menu control
}

// Mark all the tweets inside a html element
function markChildTweets(node) {
	for (let tweet of node.getElementsByClassName('tweet')) {
		markTweet(tweet);
	}
}

/* Find and mark tweets */

// Watch as new tweets are loaded
// callback for mutation observer, receives list of mutations
function watchNewTweets(mutationList) {
	mutationList.forEach(function (mutation) {
		mutation.addedNodes.forEach(function (newNode) {
			if (newNode.nodeType === Node.ELEMENT_NODE) {
				markChildTweets(newNode);
			}
		});
	});
}

let observer = new MutationObserver(watchNewTweets);
observer.observe(document.body, { childList: true, subtree: true });

// Mark tweets that are already there when the script loads
markChildTweets(document.body);
