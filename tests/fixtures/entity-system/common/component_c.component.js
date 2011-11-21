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
		Entity.registerComponent('componentC', function (entity) {
			return {
				name: 'element c',
				someUniqueValue: false,
				attach: function (someUniqueValue) {
					this.someUniqueValue = someUniqueValue;
					return true;
				}
			};
		});
	}
);