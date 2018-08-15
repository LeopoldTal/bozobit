module.exports = function(config) {
	config.set({
		testRunner: 'karma',
		mutator: 'javascript',
		transpilers: [],
		reporter: ['html', 'clear-text', 'progress'],
		packageManager: 'yarn',
		testFramework: 'jasmine',
		coverageAnalysis: 'perTest',
		karma: {
			project: 'custom',
			configFile: 'karma.conf.js',
			config: {}
		},
		mutate: ['src/**/*.js']
	});
};
