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
		Entity.registerComponent('commonOne', function (entity) {
			return {
				name: 'common one',
				isUnique: false,
				attach: function (param1, param2, param3) {
					this.param1 = param1;
					this.param2 = param2;
					this.param3 = param3;
					
					return true;
				}
			};
		});
	}
);