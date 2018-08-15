describe('app toplevel', function () {
	let app;
	beforeEach(function () {
		app = new BozoBitApp();
		spyOn(app.bozoList, 'fetchList').and.returnValue(Promise.resolve());
		spyOn(app.pageWatcher, 'run');
	});
	
	it('creates dependencies', function () {
		expect(app.bozoList instanceof BozoList).toBeTruthy();
		expect(app.tweetMarker instanceof TweetMarker).toBeTruthy();
		expect(app.pageWatcher instanceof PageWatcher).toBeTruthy();
	});
	
	it('loads bozo list', function () {
		app.start();
		expect(app.bozoList.fetchList).toHaveBeenCalled();
	});
	
	it('watches the page', function (done) {
		app.start()
			.then(function () {
				expect(app.pageWatcher.run).toHaveBeenCalled();
				done();
			})
			.catch(done.fail);
	});
});
