describe('BozoList', function () {
	let fakeList;
	let fakeStored;
	
	beforeEach(function () {
		fakeList = [23, 42, 1337];
		fakeStored = Promise.resolve({bozos: fakeList});
	});
	
	describe('fetchList', function () {
		it('loads the list of bozos', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
			let list = new BozoList();
			list.fetchList()
				.then(function (bozos) {
					expect(bozos).toEqual(fakeList);
					done();
				})
				.catch(done.fail);
		});
		
		it('defaults to empty', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(Promise.resolve({}));
			let list = new BozoList();
			list.fetchList()
				.then(function (bozos) {
					expect(bozos).toEqual([]);
					done();
				})
				.catch(done.fail);
		});
		
		// TODO: handle failure
		
		it('always refreshes the list', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
			let list = new BozoList();
			list.fetchList()
				.then(function () {
					return list.fetchList();
				})
				.then(function (bozos) {
					expect(browser.storage.sync.get).toHaveBeenCalledTimes(2);
					done();
				})
				.catch(done.fail);
		});
	});
	
	describe('getList', function () {
		it('gets the list of bozos', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
			let list = new BozoList();
			list.getList()
				.then(function (bozos) {
					expect(bozos).toEqual(fakeList);
					done();
				})
				.catch(done.fail);
		});
		
		it('defaults to empty', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(Promise.resolve({}));
			let list = new BozoList();
			list.getList()
				.then(function (bozos) {
					expect(bozos).toEqual([]);
					done();
				})
				.catch(done.fail);
		});
		
		it('only fetches the list once', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
			let list = new BozoList();
			list.getList()
				.then(function () {
					return list.getList();
				})
				.then(function (bozos) {
					expect(browser.storage.sync.get).toHaveBeenCalledTimes(1);
					done();
				})
				.catch(done.fail);
		});
	});
	
	describe('isBozo', function () {
		beforeEach(function () {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
		});
	
		it('finds an id in the list', function (done) {
			let list = new BozoList();
			list.isBozo(42)
				.then(function (isBozo) {
					expect(isBozo).toBeTruthy();
					expect(browser.storage.sync.get).toHaveBeenCalledWith('bozos');
					done();
				})
				.catch(done.fail);
		});
		
		it('rejects an id not in the list', function (done) {
			let list = new BozoList();
			list.isBozo(314)
				.then(function (isBozo) {
					expect(isBozo).toBeFalsy();
					expect(browser.storage.sync.get).toHaveBeenCalledWith('bozos');
					done();
				})
				.catch(done.fail);
		});
	});
	
	describe('addBozo', function () {
		it('adds a bozo', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
			spyOn(browser.storage.sync, 'set').and.returnValue(Promise.resolve);
			
			let list = new BozoList();
			list.addBozo(314)
				.then(function () {
					expect(browser.storage.sync.set)
						.toHaveBeenCalledWith({bozos: [23, 42, 1337, 314]});
					done();
				})
				.catch(done.fail);
		});
		
		it('keeps values unique', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
			spyOn(browser.storage.sync, 'set').and.returnValue(Promise.resolve);
			
			let list = new BozoList();
			list.addBozo(42)
				.then(function () {
					expect(browser.storage.sync.set).toHaveBeenCalledWith({bozos: [23, 42, 1337]});
					done();
				})
				.catch(done.fail);
		});
		
		// TODO: handle failure
	});
	
	describe('removeBozo', function () {
		it('removes a bozo', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
			spyOn(browser.storage.sync, 'set').and.returnValue(Promise.resolve);
			
			let list = new BozoList();
			list.removeBozo(42)
				.then(function () {
					expect(browser.storage.sync.set)
						.toHaveBeenCalledWith({bozos: [23, 1337]});
					done();
				})
				.catch(done.fail);
		});
		
		it('does nothing if not in the list', function (done) {
			spyOn(browser.storage.sync, 'get').and.returnValue(fakeStored);
			spyOn(browser.storage.sync, 'set').and.returnValue(Promise.resolve);
			
			let list = new BozoList();
			list.removeBozo(314)
				.then(function () {
					expect(browser.storage.sync.set)
						.toHaveBeenCalledWith({bozos: [23, 42, 1337]});
					done();
				})
				.catch(done.fail);
		});
		
		// TODO: handle failure
	});
});
