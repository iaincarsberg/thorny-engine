/*global console window describe it expect runs waitsFor*/
(function (require) {
	describe('The vector2 object', function () {
		it('should have a number of helper functions, and Compose.js helpers', function () {
			var ran = false;
			require(['thorny!math/vector2'], function (Vector2) {
				expect(typeof Vector2).toEqual('function');// Because it has a constructer
				expect(typeof Vector2.extend).toEqual('function');
				expect(typeof Vector2.lineIntersection).toEqual('function');
				expect(typeof Vector2.centroid).toEqual('function');
				expect(typeof Vector2.isLeftOfEdge).toEqual('function');
				// ran = true;
			});
			
			waitsFor(function () {
				return ran;
			}, 'thorny!math/vector2 failed to load', 100);
		});
		
		describe('creating a new Vector2', function () {
			it('should contain the following functions', function () {
				require(['thorny!math/vector2'], function (Vector2) {
					var v1 = new Vector2(12, 34);
					
					console.log(v1.x);
				});
			});
		});
	});
}(typeof window === 'undefined' ? require('lib/r') : require));