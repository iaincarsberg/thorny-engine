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
		Entity.registerComponent('componentA', function (entity) {
			return {
				name: 'element a',
				someUniqueValue: false,
				attach: function (someUniqueValue) {
					this.someUniqueValue = someUniqueValue;
					return true;
				}
			};
		});
	}
);