/*global window console*/
(function (require, undefined) {
	require(
		[
			'thorny',
			'thorny!math/vector2',
			'thorny!observer/observable',
			// 'thorny!core>*>math/vector2',
			// 'thorny!*>math/vector2',
			
			// 'thorny!common>math/vector2',
			// 'thorny!browser>math/vector2',
			// 'thorny!node.js>math/vector2',
			// 'thorny!blah>common>math/vector2'
		], 
		function (
			Thorny,
			Vector2,
			observable,
			list
		) {
			console.log(
				list
				);
			var v2s, t = new Thorny();
			
			console.log(
				t,
				'**',
				typeof Vector2,
				'**'
				);
				
			console.log(
				Vector2.lineIntersection(
					new Vector2(0, 0),
					new Vector2(50, 50),
					new Vector2(0, 50),
					new Vector2(50, 0)
					)
				);
			
			v2s = [
				new Vector2(12, 34),
				new Vector2(56, 78),
				new Vector2(90, 12)
			];
			
			console.log(
				v2s[0].getX(), v2s[0].getY(),
				v2s[1].getX(), v2s[1].getY(),
				v2s[2].getX(), v2s[2].getY()
				);
			
			
			console.log('********************************');
			observable(v2s[0]);
			
			console.log(
				typeof v2s[0].getX,
				typeof v2s[0].getY,
				v2s[0].data('cake', 'nom'),
				v2s[0].getX(), v2s[0].getY(), v2s[0].clone().normalize().getSimpleCoords()
				);
		}
	);
}(typeof window === 'undefined' ? require('./lib/r') : require));
(function (require, undefined) {
	return;
	/*
	require(
		[
			'thorny!math/vector2',
			'thorny!common>math/vector2',
			'thorny!core>common>math/vector2',
			'thorny!core>math/vector2'
		], 
		function (
			Vector2,
			v2,
			v3,
			v4
		) {
			console.log(
				'**',
				typeof Vector2,
				typeof v2,
				typeof v3,
				typeof v4,
				'**'
				);
		}
	);
	*/
}(typeof window === 'undefined' ? require('./lib/r') : require));