class BozoList {
	constructor() {
		this.promise = Promise.reject('list not loaded');
	}
	
	fetchList() {
		this.promise = browser.storage.sync.get('bozos')
			.then(res => res.bozos || []);
		return this.promise;
	}
	
	getList() {
		return this.promise.catch(() => this.fetchList());
	}
	
	// TODO: if there are a LOT of bozos, keep sorted and binary search
	isBozo(userId) {
		return this.getList().then(bozos => ~bozos.indexOf(userId));
	}
	
	addBozo(userId) {
		return this.fetchList().then(function (bozos) {
			!~bozos.indexOf(userId) && bozos.push(userId);
			return browser.storage.sync.set({bozos: bozos});
		});
	}
	
	removeBozo(userId) {
		return this.fetchList().then(function (bozos) {
			let idIndex = bozos.indexOf(userId);
			if (idIndex > -1) {
				bozos.splice(idIndex, 1);
			}
			return browser.storage.sync.set({bozos: bozos});
		});
	}
}
