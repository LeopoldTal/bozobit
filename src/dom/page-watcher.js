/* Find and mark tweets */

class PageWatcher {
	constructor(tweetMarker) {
		this.tweetMarker = tweetMarker;
	}
	
	// Re-mark all tweets on page
	refreshPage() {
		this.tweetMarker.markChildTweets(document.body);
	}
	
	// Watch as new tweets are loaded
	// callback for mutation observer, receives list of mutations
	watchNewTweets(mutationList) {
		let tweetMarker = this.tweetMarker;
		mutationList.forEach(function (mutation) {
			mutation.addedNodes.forEach(function (newNode) {
				if (newNode.nodeType === Node.ELEMENT_NODE) {
					tweetMarker.markChildTweets(newNode);
				}
			});
		});
	}
	
	// Start watching page
	run() {
		// Provide refresh callback to global namespace
		window.bozobitRefreshPage = () => this.refreshPage();
	
		// Watch new tweets
		let observer = new MutationObserver(mutations => this.watchNewTweets(mutations));
		observer.observe(document.body, { childList: true, subtree: true });

		// Mark tweets that are already there on start
		bozobitRefreshPage();
	}
}
