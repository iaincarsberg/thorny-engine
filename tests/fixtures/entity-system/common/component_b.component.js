/*global define*/
define(
	[
		'compose',
		'thorny!entity-system>main'
	], 
	function (
		Compose,
		Entity
	) {
		Entity.registerComponent('componentB', function (entity) {
			return {
				name: 'element b',
				someUniqueValue: false,
				attach: function (someUniqueValue) {
					this.someUniqueValue = someUniqueValue;
					return true;
				}
			};
		});
	}
);