/*global window runs waits expect describe it*/
(function (module) {
	/**
	 * Used to execute tests
	 * @param function callback Used to launch a new instance of thorny then 
	 * exeucte a range of tests.
	 * @param string config Contains the configuration file(s) to use
	 * @return void
	 */
	module.exports = function (callback, config) {
		if (typeof callback !== 'function') {
			return;
		}
		
		if (config === undefined) {
			config = './config/thorny-spec-demo.json';
		}
		
		var 
			ran = false,
			completed = function () {
				ran = true;
			};
		runs(function () {
			require('thorny/base')(config)(function ($) {
				callback($, completed);
				
			});//instanceof thorny
		});
		waits(200);
		runs(function () {
			expect(ran).toBeTruthy();
		});
	};
}((typeof window === 'undefined') ? module : window.thorny_path('./thorny-specs/test-runner')));