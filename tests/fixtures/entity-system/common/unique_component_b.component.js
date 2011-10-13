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
		Entity.registerComponent('uniqueComponentB', function (entity) {
			return {
				name: 'component b',
				isUnique: true,
				attach: function (pass) {
					return (pass || pass === undefined) ? true : false;
				}
			};
		});
	}
);