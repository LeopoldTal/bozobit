describe('PageWatcher', function () {
	let pageWatcher;
	beforeEach(function () {
		spyOn(TweetMarkerStub, 'markChildTweets');
		pageWatcher = new PageWatcher(TweetMarkerStub);
	});
	
	describe('refreshPage', function () {
		it('marks the page body', function () {
			pageWatcher.refreshPage();
			expect(TweetMarkerStub.markChildTweets).toHaveBeenCalledWith(document.body);
		});
	});
	
	describe('watchNewTweets', function () {
		let el1 = { nodeType: Node.ELEMENT_NODE, tagName: 'DIV' };
		let el2 = { nodeType: Node.ELEMENT_NODE, tagName: 'P' };
		
		it('runs for all mutations', function () {
			pageWatcher.watchNewTweets([
				{ addedNodes: [el1] },
				{ addedNodes: [el2] }
			]);
			expect(TweetMarkerStub.markChildTweets).toHaveBeenCalledWith(el1);
			expect(TweetMarkerStub.markChildTweets).toHaveBeenCalledWith(el2);
		});
		
		it('runs for added nodes in a mutation', function () {
			pageWatcher.watchNewTweets([
				{ addedNodes: [el1, el2] }
			]);
			expect(TweetMarkerStub.markChildTweets).toHaveBeenCalledWith(el1);
			expect(TweetMarkerStub.markChildTweets).toHaveBeenCalledWith(el2);
		});
		
		it('only runs for element nodes', function () {
			let otherNodes = [
				{ nodeType: Node.TEXT_NODE },
				{ nodeType: Node.PROCESSING_INSTRUCTION_NODE },
				{ nodeType: Node.COMMENT_NODE },
				{ nodeType: Node.DOCUMENT_NODE },
				{ nodeType: Node.DOCUMENT_TYPE_NODE },
				{ nodeType: Node.DOCUMENT_FRAGMENT_NODE }
			];
			pageWatcher.watchNewTweets([
				{ addedNodes: otherNodes }
			]);
			expect(TweetMarkerStub.markChildTweets).not.toHaveBeenCalled();
		});
	});
	
	describe('run', function () {
		beforeEach(function () {
			spyOn(pageWatcher, 'refreshPage');
			spyOn(pageWatcher, 'watchNewTweets');
		});
		
		it('provides global hook', function () {
			window.bozobitRefreshPage = undefined;
			pageWatcher.run();
			expect(typeof bozobitRefreshPage).toBe('function');
		});
		
		it('refreshes the page on startup', function () {
			pageWatcher.run();
			expect(pageWatcher.refreshPage).toHaveBeenCalled();
		});
		
		it('observes changes to body', function (done) {
			pageWatcher.run();
			let el = document.createElement('div');
			document.body.appendChild(el);
			// TODO: Can I prove the observer will fire before the timeout?
			setTimeout(function () {
				expect(pageWatcher.watchNewTweets).toHaveBeenCalled();
				done();
			});
		});
		
		it('observes changes to subtree', function (done) {
			let parent = document.createElement('div');
			document.body.appendChild(parent);
			
			pageWatcher.run();
			let child = document.createElement('div');
			parent.appendChild(child);
			setTimeout(function () {
				expect(pageWatcher.watchNewTweets).toHaveBeenCalled();
				done();
			});
		});
	});
});
