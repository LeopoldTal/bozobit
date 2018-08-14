/* Mark individual tweets */

const BOZO_CLASS = 'bozobit-is-bozo';
const MENU_CONTROL_CLASS = 'bozobit-menu-control';

class TweetMarker {
	constructor(bozoList) {
		this.bozoList = bozoList;
	}
	
	// Mark all the tweets inside a html element
	markChildTweets(node) {
		for (let tweet of node.getElementsByClassName('tweet')) {
			this.markTweet(tweet);
		}
	}
	
	// Mark a tweet
	// - add bozo class if user has bozo bit set
	// - add menu controls to set/clear bozo bit
	markTweet(tweet) {
		let userId = tweet.dataset.userId;
		if (!userId) {
			return;
		}
	
		this.bozoList.isBozo(userId).then(isBozo => {
			this.setTweetClass(tweet, isBozo);
			this.setMenuControl(tweet, isBozo, userId);
		});
	}
	
	// Adds or removes the bozo class on a tweet
	setTweetClass(tweet, isBozo) {
		if (isBozo) {
			tweet.classList.add(BOZO_CLASS);
		} else {
			tweet.classList.remove(BOZO_CLASS);
		}
	}

	// Adds appropriate "Mark/Unmark as bozo" action in tweet menu
	setMenuControl(tweet, isBozo, userId) {
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
		let bozoList = this.bozoList;
		let action = isBozo ? bozoList.removeBozo : bozoList.addBozo;
		let controlCallback = e => {
			action.call(bozoList, userId)
				.then(() => window.bozobitRefreshPage());
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
		button.addEventListener('click', controlCallback, false);
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
	}
}
