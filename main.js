/*global window console*/
(function (require, undefined) {
	require(
		[
			'thorny!math/vector2',
			'thorny!thorny>math/vector2',
			// 'thorny!common>math/vector2',
			// 'thorny!browser>math/vector2',
			// 'thorny!node.js>math/vector2',
			// 'thorny!blah>common>math/vector2'
		], 
		function (
			v1,
			v2
		) {
			console.log(v1, v2);
		}
	);
}(typeof window === 'undefined' ? require('./lib/r') : require));