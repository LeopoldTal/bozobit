window.browser = window.browser || {};

window.browser.storage = {
	sync: {
		get: () => Promise.resolve(),
		set: () => Promise.resolve()
	}
};
