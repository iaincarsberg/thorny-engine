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
		Entity.registerComponent('componentD', function (entity) {
			return {
				name: 'element d',
				someUniqueValue: false,
				attach: function (someUniqueValue) {
					this.someUniqueValue = someUniqueValue;
					return true;
				}
			};
		});
	}
);