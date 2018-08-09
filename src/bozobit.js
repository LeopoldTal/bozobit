/**
* bozobit
* Flags Twitter users as bozos
**/

const BOZO_CLASS = 'bozobit-is-bozo';
const MENU_CONTROL_CLASS = 'bozobit-menu-control';

let bozos = [];

/* Bozo list */
// TODO: if there are a LOT of bozos, keep sorted and binary search

function loadBozoList() {
	return browser.storage.sync.get('bozos')
		.then(function (res) {
			bozos = res.bozos || [];
			return bozos;
		});
}

function saveBozoList() {
	return browser.storage.sync.set({bozos: bozos});
	// TODO: handle error on save
}

function addBozo(userId) {
	return loadBozoList().then(() => bozos.push(userId)).then(saveBozoList);
}

function removeBozo(userId) {
	return loadBozoList().then(function () {
		let idIndex = bozos.indexOf(userId);
		if (idIndex > -1) {
			bozos.splice(idIndex, 1);
		}
	}).then(saveBozoList);
}

/* Mark individual tweets */

// Mark a tweet
// - add bozo class if user has bozo bit set
// - add menu controls to set/clear bozo bit
function markTweet(tweet) {
	let userId = tweet.dataset.userId;
	if (!userId) {
		return;
	}
	
	let isBozo = ~bozos.indexOf(userId);
	
	setTweetClass(tweet, isBozo);
	setMenuControl(tweet, isBozo, userId);
}

// Adds or removes the bozo class on a tweet
function setTweetClass(tweet, isBozo) {
	if (isBozo) {
		tweet.classList.add(BOZO_CLASS);
	} else {
		tweet.classList.remove(BOZO_CLASS);
	}
}

// Adds appropriate "Mark/Unmark as bozo" action in tweet menu
function setMenuControl(tweet, isBozo, userId) {
	// find menu
	let dropdowns = tweet.getElementsByClassName('dropdown-menu');
	if (dropdowns.length !== 1) {
		return;
	}
	let menus = dropdowns[0].getElementsByTagName('ul');
	if (menus.length !== 1) {
		return;
	}
	let menu = menus[0];
	
	// clear existing controls if any
	let oldControls = menu.getElementsByClassName(MENU_CONTROL_CLASS);
	while (oldControls[0]) {
		oldControls[0].parentNode.removeChild(oldControls[0]);
	}
	
	// control callback
	let action = isBozo ? removeBozo : addBozo;
	let controlCallback = function() {
		action(userId).then(refreshPage);
	};
	
	// create menu control
	let menuControl = document.createElement('li');
	menuControl.classList.add(MENU_CONTROL_CLASS);
	menuControl.role = 'presentation';
	let button = document.createElement('button');
	button.classList.add('dropdown-link');
	button.type = 'button';
	button.role = 'menu-item';
	button.innerText = isBozo ? 'Unmark as bozo' : 'Mark as bozo';
	button.addEventListener('click', controlCallback);
	menuControl.appendChild(button);
	
	// find insertion position
	let position = 0;
	while (position < menu.children.length
		&& !menu.children[position].classList.contains('embed-link')) {
		position++;
	}
	position++;
	
	// insert in menu
	if (position < menu.children.length-1) {
		menu.insertBefore(menuControl, menu.children[position]);
	} else {
		menu.appendChild(menuControl);
	}
	
	console.log(menu.outerHTML);
}

// Mark all the tweets inside a html element
function markChildTweets(node) {
	for (let tweet of node.getElementsByClassName('tweet')) {
		markTweet(tweet);
	}
}

/* Find and mark tweets */

// Re-mark all tweets on page
function refreshPage() {
	markChildTweets(document.body);
}

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

loadBozoList().then(function() {
	// Watch new tweets
	let observer = new MutationObserver(watchNewTweets);
	observer.observe(document.body, { childList: true, subtree: true });

	// Mark tweets that are already there when the script loads
	refreshPage();
});
