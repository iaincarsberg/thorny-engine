/*global define console window describe it expect runs waitsFor*/
define(
	function () {
		describe('The thorny base object', function () {
			it('should be able to load a wide range of local files', function () {
				var ran = false;
				require(
					[
						'thorny!core>common>math/vector2',
						'thorny!core>math/vector2',
						'thorny!common>math/vector2',
						'thorny!math/vector2'
					],
					function (
						v1,
						v2,
						v3,
						v4
					) {
						expect(typeof v1).toEqual('function');
						expect(typeof v2).toEqual('function');
						expect(typeof v3).toEqual('function');
						expect(typeof v4).toEqual('function');
						ran = true;
					}
				);
				
				waitsFor(function () {
					return ran;
				});
			});// it should be able to load a wide range of local files
		});// desc The thorny base object
	}
);