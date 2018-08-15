/**
* bozobit
* Flags Twitter users as bozos
**/

class BozoBitApp {
	constructor() {
		this.bozoList = new BozoList();
		this.tweetMarker = new TweetMarker(this.bozoList);
		this.pageWatcher = new PageWatcher(this.tweetMarker);
	}
	
	start() {
		return this.bozoList.fetchList().then(() => {
			this.pageWatcher.run();
		});
	}
}

let bozoBitApp = new BozoBitApp();
bozoBitApp.start();
