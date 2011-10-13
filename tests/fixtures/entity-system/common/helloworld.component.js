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
		Entity.registerComponent('helloworld', function (entity) {
			return {
				attach: function (pass) {
					return (pass || pass === undefined) ? true : false;
				}
			};
		});
	}
);