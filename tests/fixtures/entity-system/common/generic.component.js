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
		Entity.registerComponent('generic', function (entity) {
			return {
				isUnique: true,
				name: 'generic component',
				attach: function (pass) {
					return (pass || pass === undefined) ? true : false;
				},
				dance: function () {
					return 'put your left leg in, take your left leg out, in, out, in, out, shake it all about';
				}
			};
		});
	}
);