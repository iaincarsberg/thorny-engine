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
		Entity.registerComponent('uniqueComponentA', function (entity) {
			return {
				name: 'component a',
				isUnique: true,
				attach: function (pass) {
					return (pass || pass === undefined) ? true : false;
				}
			};
		});
	}
);