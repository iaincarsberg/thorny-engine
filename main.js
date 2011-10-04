/*global window console*/
(function (require, undefined) {
	require(
		[
			'thorny!math/vector2',
			/*
			'thorny!common>math/vector2',
			'thorny!core>common>math/vector2',
			'thorny!core>math/vector2',
			*/
			// 'thorny!core>*>math/vector2',
			// 'thorny!*>math/vector2',
			
			// 'thorny!common>math/vector2',
			// 'thorny!browser>math/vector2',
			// 'thorny!node.js>math/vector2',
			// 'thorny!blah>common>math/vector2'
		], 
		function (
			Vector2
		) {
			console.log(
				Vector2.lineIntersection(
					new Vector2(0, 0),
					new Vector2(50, 50),
					new Vector2(0, 50),
					new Vector2(50, 0)
					)
				);
			
			var v2s = [
				new Vector2(12, 34),
				new Vector2(56, 78),
				new Vector2(90, 12)
			];
			
			console.log(
				v2s[0].getX(), v2s[0].getY(),
				v2s[1].getX(), v2s[1].getY(),
				v2s[2].getX(), v2s[2].getY()
				);
		}
	);
}(typeof window === 'undefined' ? require('./lib/r') : require));