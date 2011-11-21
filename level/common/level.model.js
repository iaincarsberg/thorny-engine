/*global define*/
define(
	[
		'thorny!model>main'
	], 
	function (
		Model
	) {
		return function () {
			Model.register(
				'level', 
				Model.expand(
					['level', {format: 'thorny!math/poly2'}],
					['level-segment']
				)
			);
		};
	}
);