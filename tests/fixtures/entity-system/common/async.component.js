/*global define setTimeout*/
define(
	[
		'compose',
		'thorny!entity-system>main'
	], 
	function (
		Compose,
		Entity
	) {
		Entity.registerComponent('async-component', function (entity) {
			return {
				name: 'async-component',
				isUnique: false,
				
				/**
				 * Used to bind the async test module to the engine
				 * @param void
				 * @return function Containing the async operation
				 */
				attach: function () {
					// Return a function that is called asyncronsly
					return function (component, id) {
						// If the id is not set, then set it
						if (id === undefined) {
							id = 0;
						}
						
						// Localise the this callback, because its scope 
						// changes once we enter the setTimeout.
						var that = this;

						// Fake an async request.
						setTimeout(function () {
							that(id += 1);
						}, 50);
					};
				}
			};
		});
	}
);