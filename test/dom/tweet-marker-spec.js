describe('TweetMarker', function () {
	let tweetMarker;
	beforeEach(function () {
		tweetMarker = new TweetMarker(BozoListStub);
	});
	
	describe('markChildTweets', function () {
		beforeEach(function () {
			spyOn(tweetMarker, 'markTweet');
		});
		
		it('marks tweets', function () {
			let parent = document.createElement('div');
			let child = document.createElement('div');
			child.className = 'tweet';
			parent.appendChild(child);
			tweetMarker.markChildTweets(parent);
			
			expect(tweetMarker.markTweet).toHaveBeenCalledWith(child);
		});
		
		it('marks quote tweets', function () {
			let parent = document.createElement('div');
			let child = document.createElement('div');
			child.className = 'QuoteTweet-innerContainer';
			parent.appendChild(child);
			tweetMarker.markChildTweets(parent);
			
			expect(tweetMarker.markTweet).toHaveBeenCalledWith(child);
		});
		
		it('doesn\'t mark non-tweets', function () {
			let parent = document.createElement('div');
			let child = document.createElement('div');
			parent.appendChild(child);
			tweetMarker.markChildTweets(parent);
			
			expect(tweetMarker.markTweet).not.toHaveBeenCalled();
		});
		
		// TODO: should I bother testing it finds all descendants?
	});
	
	describe('markTweet', function () {
		beforeEach(function () {
			spyOn(BozoListStub, 'isBozo').and.returnValue(Promise.resolve(true));
			spyOn(tweetMarker, 'setTweetClass');
			spyOn(tweetMarker, 'setMenuControl');
		});
		
		it('doesn\'t mark a tweet with no user id', function (done) {
			let tweet = document.createElement('div');
			
			tweetMarker.markTweet(tweet)
				.then(done.fail)
				.catch(function () {
					expect(BozoListStub.isBozo).not.toHaveBeenCalled();
					expect(tweetMarker.setTweetClass).not.toHaveBeenCalled();
					expect(tweetMarker.setMenuControl).not.toHaveBeenCalled();
					done();
				});
		});
		
		it('marks a tweet with user id', function (done) {
			let tweet = document.createElement('div');
			tweet.dataset.userId = '42';
			
			tweetMarker.markTweet(tweet)
				.then(function () {
					expect(BozoListStub.isBozo).toHaveBeenCalledWith('42');
					expect(tweetMarker.setTweetClass).toHaveBeenCalledWith(tweet, true);
					expect(tweetMarker.setMenuControl).toHaveBeenCalledWith(tweet, true, '42');
					done();
				})
				.catch(done.fail);
		});
	});
	
	describe('setTweetClass', function () {
		it('adds bozo class', function () {
			let tweet = document.createElement('div');
			tweetMarker.setTweetClass(tweet, true);
			expect(tweet.classList).toContain('bozobit-is-bozo');
		});
		
		it('removes bozo class', function () {
			let tweet = document.createElement('div');
			tweet.className = 'bozobit-is-bozo';
			tweetMarker.setTweetClass(tweet, false);
			expect(tweet.classList).not.toContain('bozobit-is-bozo');
		});
	});
	
	describe('setMenuControl', function () {
		let tweet, menu, control;
		let testCallback = function () {};
		beforeEach(function () {
			tweet = document.createElement('div');
			menu = document.createElement('ul');
			control = document.createElement('li');
			
			spyOn(tweetMarker, 'clearOldControls');
			spyOn(tweetMarker, 'getControlCallback').and.returnValue(testCallback);
			spyOn(tweetMarker, 'createMenuControl').and.returnValue(control);
			spyOn(tweetMarker, 'attachControl');
		});
		
		it('does nothing if menu is missing', function () {
			spyOn(tweetMarker, 'findMenu').and.returnValue(undefined);
			tweetMarker.setMenuControl(tweet, true, '42');
			
			expect(tweetMarker.findMenu).toHaveBeenCalledWith(tweet);
			expect(tweetMarker.clearOldControls).not.toHaveBeenCalled();
			expect(tweetMarker.getControlCallback).not.toHaveBeenCalled();
			expect(tweetMarker.createMenuControl).not.toHaveBeenCalled();
			expect(tweetMarker.attachControl).not.toHaveBeenCalled();
		});
		
		it('creates and attaches a new menu control', function () {
			spyOn(tweetMarker, 'findMenu').and.returnValue(menu);
			tweetMarker.setMenuControl(tweet, true, '42');
			
			expect(tweetMarker.findMenu).toHaveBeenCalledWith(tweet);
			expect(tweetMarker.clearOldControls).toHaveBeenCalledWith(menu);
			expect(tweetMarker.getControlCallback).toHaveBeenCalledWith(true, '42');
			expect(tweetMarker.createMenuControl).toHaveBeenCalledWith(true, testCallback);
			expect(tweetMarker.attachControl).toHaveBeenCalledWith(menu, control);
		});
	});
	
	describe('findMenu', function () {
		it('finds nothing if dropdown is missing', function () {
			let tweet = document.createElement('div');
			
			let menu = tweetMarker.findMenu(tweet);
			expect(menu).not.toBeDefined();
		});
		
		it('finds nothing if there are two dropdowns', function () {
			let tweet = document.createElement('div');
			
			let dropdown = document.createElement('div');
			dropdown.className = 'dropdown-menu';
			tweet.appendChild(dropdown);
			
			let ul = document.createElement('ul');
			dropdown.appendChild(ul);
			
			let dropdown2 = document.createElement('div');
			dropdown2.className = 'dropdown-menu';
			dropdown.appendChild(dropdown2);
			
			let menu = tweetMarker.findMenu(tweet);
			expect(menu).not.toBeDefined();
		});
		
		it('finds nothing if list is missing', function () {
			let tweet = document.createElement('div');
			
			let dropdown = document.createElement('div');
			dropdown.className = 'dropdown-menu';
			tweet.appendChild(dropdown);
			
			let menu = tweetMarker.findMenu(tweet);
			expect(menu).not.toBeDefined();
		});
		
		it('finds nothing if there are two lists', function () {
			let tweet = document.createElement('div');
			
			let dropdown = document.createElement('div');
			dropdown.className = 'dropdown-menu';
			tweet.appendChild(dropdown);
			
			let ul = document.createElement('ul');
			dropdown.appendChild(ul);
			
			let ul2 = document.createElement('ul');
			dropdown.appendChild(ul2);
			
			let menu = tweetMarker.findMenu(tweet);
			expect(menu).not.toBeDefined();
		});
		
		it('finds the list', function () {
			let tweet = document.createElement('div');
			
			let dropdown = document.createElement('div');
			dropdown.className = 'dropdown-menu';
			tweet.appendChild(dropdown);
			
			let ul = document.createElement('ul');
			dropdown.appendChild(ul);
			
			let menu = tweetMarker.findMenu(tweet);
			expect(menu).toBe(ul);
		});
	});
	
	describe('clearOldControls', function () {
		let menu;
		beforeEach(function () {
			menu = document.createElement('ul');
		});
		function append(isMenuControl) {
			let item = document.createElement('li');
			item.className = isMenuControl ? 'bozobit-menu-control' : '';
			menu.appendChild(item);
		}
		
		it('does nothing if there are no controls', function () {
			tweetMarker.clearOldControls(menu);
			expect(menu.children.length).toBe(0);
		});
		
		it('removes at beginning', function () {
			append(true);
			append(false);
			tweetMarker.clearOldControls(menu);
			expect(menu.children.length).toBe(1);
		});
		
		it('removes at end', function () {
			append(false);
			append(true);
			tweetMarker.clearOldControls(menu);
			expect(menu.children.length).toBe(1);
		});
		
		it('removes two consecutive', function () {
			append(false);
			append(true);
			append(true);
			append(false);
			tweetMarker.clearOldControls(menu);
			expect(menu.children.length).toBe(2);
		});
		
		it('removes two non-consecutive', function () {
			append(true);
			append(false);
			append(true);
			tweetMarker.clearOldControls(menu);
			expect(menu.children.length).toBe(1);
		});
	});
	
	describe('getControlCallback', function () {
		beforeEach(function () {
			window.bozobitRefreshPage = function () {};
			spyOn(window, 'bozobitRefreshPage');
			spyOn(BozoListStub, 'addBozo').and.returnValue(Promise.resolve());
			spyOn(BozoListStub, 'removeBozo').and.returnValue(Promise.resolve());
		});
		
		it('adds a bozo', function (done) {
			let callback = tweetMarker.getControlCallback(false, '42');
			
			callback().then(function () {
				expect(BozoListStub.addBozo).toHaveBeenCalledWith('42');
				expect(window.bozobitRefreshPage).toHaveBeenCalled();
				done();
			}).catch(done.fail);
		});
		
		it('removes a bozo', function (done) {
			let callback = tweetMarker.getControlCallback(true, '42');
			
			callback().then(function () {
				expect(BozoListStub.removeBozo).toHaveBeenCalledWith('42');
				expect(window.bozobitRefreshPage).toHaveBeenCalled();
				done();
			}).catch(done.fail);
		});
	});
	
	describe('getControlText', function () {
		it('provides text for non-bozos', function () {
			let text = tweetMarker.getControlText(false);
			expect(text).toBe('Mark as bozo');
		});
		
		it('provides text for bozos', function () {
			let text = tweetMarker.getControlText(true);
			expect(text).toBe('Unmark as bozo');
		});
	});
	
	describe('createMenuControl', function () {
		let control, button, testCallback;
		beforeEach(function () {
			spyOn(tweetMarker, 'getControlText').and.returnValue('Lorem ipsum');
			testCallback = jasmine.createSpy('testCallback');
			
			control = tweetMarker.createMenuControl(true, testCallback);
			button = control.getElementsByTagName('button')[0];
		});
		
		it('is a menu list item', function () {
			expect(control.tagName).toBe('LI');
			expect(control.className).toBe('bozobit-menu-control');
			expect(control.role).toBe('presentation');
		});
		
		it('has one button', function () {
			let buttons = control.getElementsByTagName('button');
			expect(buttons.length).toBe(1);
		});
		
		it('styles the button', function () {
			expect(button.type).toBe('button');
			expect(button.className).toBe('dropdown-link');
			expect(button.role).toBe('menu-item');
		});
		
		it('sets the button text', function () {
			expect(button.innerText).toBe('Lorem ipsum');
		});
		
		it('sets the click handler', function () {
			button.click();
			expect(testCallback).toHaveBeenCalled();
		});
	});
	
	describe('attachControl', function () {
		let menu, control;
		beforeEach(function () {
			menu = document.createElement('ul');
			control = document.createElement('li');
		});
		function append(isTarget) {
			let item = document.createElement('li');
			item.className = isTarget ? 'embed-link' : '';
			menu.appendChild(item);
		}
		
		it('attaches to empty menu', function () {
			tweetMarker.attachControl(menu, control);
			expect(menu.children[0]).toBe(control);
		});
		
		it('attaches after embed control', function () {
			append(false);
			append(false);
			append(true);
			append(false);
			append(false);
			tweetMarker.attachControl(menu, control);
			expect(menu.children[3]).toBe(control);
		});
		
		it('attaches after embed control at end', function () {
			append(false);
			append(true);
			tweetMarker.attachControl(menu, control);
			expect(menu.children[2]).toBe(control);
		});
		
		it('attaches at end if embed control is missing', function () {
			append(false);
			append(false);
			append(false);
			append(false);
			tweetMarker.attachControl(menu, control);
			expect(menu.children[4]).toBe(control);
		});
	});
});
