/**
* bozobit
* Flags Twitter users as bozos
**/

let bozoList = new BozoList();

let tweetMarker = new TweetMarker(bozoList);

let pageWatcher = new PageWatcher(tweetMarker);

bozoList.fetchList().then(function() {
	pageWatcher.run();
});
