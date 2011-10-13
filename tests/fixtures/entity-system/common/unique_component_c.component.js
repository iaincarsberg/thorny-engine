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
		Entity.registerComponent('uniqueComponentC', function (entity) {
			return {
				name: 'component c',
				isUnique: true,
				attach: function (pass) {
					return (pass || pass === undefined) ? true : false;
				}
			};
		});
	}
);