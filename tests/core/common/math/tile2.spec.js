/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny!math/tile2',
		'thorny!math/vector2'
	],
	function (
		Tile2,
		Vector2
	) {	
		describe('The tile2 object', function () {
			describe('before instantiation', function () {
				it('should have a number of helper functions, and Compose.js helpers', function () {
					expect(typeof Tile2).toEqual('function');// Because it has a constructer
					expect(typeof Tile2.setDefaults).toEqual('function');
					expect(typeof Tile2.getLength).toEqual('function');
				});// it should have a number of helper functions, and Compose.js helpers
				
				describe('describe', function () {
					describe('the getLength function', function () {
						it('it should always return 4', function () {
							expect(Tile2.getLength()).toEqual(4);
						});// it should always return 4
					});// desc the getLength function
				});// desc describe
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should have the following functions', function () {
					var t2 = new Tile2(0, 0);
					
					expect(typeof t2.getVector2s).toEqual('function');
					expect(typeof t2.getMidpoint).toEqual('function');
					expect(typeof t2.sharesEdge).toEqual('function');
					expect(typeof t2.isVector2Internal).toEqual('function');
				});// it should have the following functions
				
				it('it should be possible to instantiate Tile2 by parsing in a Vector2', function () {
					Tile2.setDefaults({
						height: 32,
						width: 32
					});
					
					expect(new Tile2(new Vector2(0, 0)).getSimpleCoords()).toEqual([16, 16]);
					expect(new Tile2(new Vector2(1, 0)).getSimpleCoords()).toEqual([48, 16]);
					expect(new Tile2(new Vector2(0, 1)).getSimpleCoords()).toEqual([16, 48]);
					expect(new Tile2(new Vector2(1, 1)).getSimpleCoords()).toEqual([48, 48]);
				});
				
				describe('has the following function,', function () {
					describe('getVector2s', function () {
						it('it should allow us to create a small 8x8 tile', function () {
							var 
								t2 = new Tile2(0, 0, 8, 8),
								v2s = t2.getVector2s();
							expect(v2s.length).toEqual(4);
							expect(typeof v2s[0]).toEqual('object');
							expect(typeof v2s[1]).toEqual('object');
							expect(typeof v2s[2]).toEqual('object');
							expect(typeof v2s[3]).toEqual('object');
							
							expect(v2s[0].getSimpleCoords()).toEqual([0, 0]);
							expect(v2s[1].getSimpleCoords()).toEqual([8, 0]);
							expect(v2s[2].getSimpleCoords()).toEqual([8, 8]);
							expect(v2s[3].getSimpleCoords()).toEqual([0, 8]);
							
						});// it should allow us to create a small 8x8 tile
						
						it('it should allow us to create a small 8x16 tile', function () {
							var 
								t2 = new Tile2(0, 0, 8, 16),
								v2s = t2.getVector2s();
							expect(v2s.length).toEqual(4);
							expect(typeof v2s[0]).toEqual('object');
							expect(typeof v2s[1]).toEqual('object');
							expect(typeof v2s[2]).toEqual('object');
							expect(typeof v2s[3]).toEqual('object');
							
							expect(v2s[0].getSimpleCoords()).toEqual([0, 0]);
							expect(v2s[1].getSimpleCoords()).toEqual([8, 0]);
							expect(v2s[2].getSimpleCoords()).toEqual([8, 16]);
							expect(v2s[3].getSimpleCoords()).toEqual([0, 16]);
							
						});// it should allow us to create a small 8x16 tile
						
						it('it should allow us to create a small 16x8 tile', function () {
							var 
								t2 = new Tile2(0, 0, 16, 8),
								v2s = t2.getVector2s();
							expect(v2s.length).toEqual(4);
							expect(typeof v2s[0]).toEqual('object');
							expect(typeof v2s[1]).toEqual('object');
							expect(typeof v2s[2]).toEqual('object');
							expect(typeof v2s[3]).toEqual('object');
							
							expect(v2s[0].getSimpleCoords()).toEqual([0, 0]);
							expect(v2s[1].getSimpleCoords()).toEqual([16, 0]);
							expect(v2s[2].getSimpleCoords()).toEqual([16, 8]);
							expect(v2s[3].getSimpleCoords()).toEqual([0, 8]);
							
						});// it should allow us to create a small 8x8 tile
					});// desc getVector2s
					
					describe('getMidpoint', function () {
						it('it should find the centroid in a 16x16 tile', function () {
							var 
								t2 = new Tile2(0, 0, 16, 16),
								v2 = t2.getMidpoint();
							expect(v2.getSimpleCoords()).toEqual([8, 8]);
						});// it should find the centroid in a 16x16 tile
						
						it('it should find the centroid in a 32x16 tile', function () {
							var 
								t2 = new Tile2(0, 0, 32, 16),
								v2 = t2.getMidpoint();
							expect(v2.getSimpleCoords()).toEqual([16, 8]);
						});// it should find the centroid in a 32x16 tile
						
						it('it should find the centroid in a non zeroed 32x32 tile', function () {
							var 
								t2 = new Tile2(96, 0, 32, 32),
								v2 = t2.getMidpoint();
							expect(v2.getSimpleCoords()).toEqual([112, 16]);
						});// it should find the centroid in a non zeroed 32x32 tile
					});// desc getMidpoint
					
					describe('sharesEdge', function () {
						it('it should find which tiles share an edge', function () {
							var t1, t2, t3, t4, t5, t6, t7, t8, t9;

							t1 = new Tile2(0, 0, 8, 8);
							t2 = new Tile2(8, 0, 8, 8);
							t3 = new Tile2(16, 0, 8, 8);
							t4 = new Tile2(0, 8, 8, 8);
							t5 = new Tile2(8, 8, 8, 8);
							t6 = new Tile2(16, 8, 8, 8);
							t7 = new Tile2(0, 16, 8, 8);
							t8 = new Tile2(8, 16, 8, 8);
							t9 = new Tile2(16, 16, 8, 8);

							// Tile 1 vs
							expect(t1.sharesEdge(t2)).toBeTruthy();
							expect(t1.sharesEdge(t3)).toBeFalsy();
							expect(t1.sharesEdge(t4)).toBeTruthy();
							expect(t1.sharesEdge(t5)).toBeFalsy();
							expect(t1.sharesEdge(t6)).toBeFalsy();
							expect(t1.sharesEdge(t7)).toBeFalsy();
							expect(t1.sharesEdge(t8)).toBeFalsy();
							expect(t1.sharesEdge(t9)).toBeFalsy();

							// Tile 2 vs
							expect(t2.sharesEdge(t1)).toBeTruthy();
							expect(t2.sharesEdge(t3)).toBeTruthy();
							expect(t2.sharesEdge(t4)).toBeFalsy();
							expect(t2.sharesEdge(t5)).toBeTruthy();
							expect(t2.sharesEdge(t6)).toBeFalsy();
							expect(t2.sharesEdge(t7)).toBeFalsy();
							expect(t2.sharesEdge(t8)).toBeFalsy();
							expect(t2.sharesEdge(t9)).toBeFalsy();

							// Tile 3 vs
							expect(t3.sharesEdge(t1)).toBeFalsy();
							expect(t3.sharesEdge(t2)).toBeTruthy();
							expect(t3.sharesEdge(t4)).toBeFalsy();
							expect(t3.sharesEdge(t5)).toBeFalsy();
							expect(t3.sharesEdge(t6)).toBeTruthy();
							expect(t3.sharesEdge(t7)).toBeFalsy();
							expect(t3.sharesEdge(t8)).toBeFalsy();
							expect(t3.sharesEdge(t9)).toBeFalsy();

							// Tile 4 vs
							expect(t4.sharesEdge(t1)).toBeTruthy();
							expect(t4.sharesEdge(t2)).toBeFalsy();
							expect(t4.sharesEdge(t3)).toBeFalsy();
							expect(t4.sharesEdge(t5)).toBeTruthy();
							expect(t4.sharesEdge(t6)).toBeFalsy();
							expect(t4.sharesEdge(t7)).toBeTruthy();
							expect(t4.sharesEdge(t8)).toBeFalsy();
							expect(t4.sharesEdge(t9)).toBeFalsy();

							// Tile 5 vs
							expect(t5.sharesEdge(t1)).toBeFalsy();
							expect(t5.sharesEdge(t2)).toBeTruthy();
							expect(t5.sharesEdge(t3)).toBeFalsy();
							expect(t5.sharesEdge(t4)).toBeTruthy();
							expect(t5.sharesEdge(t6)).toBeTruthy();
							expect(t5.sharesEdge(t7)).toBeFalsy();
							expect(t5.sharesEdge(t8)).toBeTruthy();
							expect(t5.sharesEdge(t9)).toBeFalsy();

							// Tile 6 vs
							expect(t6.sharesEdge(t1)).toBeFalsy();
							expect(t6.sharesEdge(t2)).toBeFalsy();
							expect(t6.sharesEdge(t3)).toBeTruthy();
							expect(t6.sharesEdge(t4)).toBeFalsy();
							expect(t6.sharesEdge(t5)).toBeTruthy();
							expect(t6.sharesEdge(t7)).toBeFalsy();
							expect(t6.sharesEdge(t8)).toBeFalsy();
							expect(t6.sharesEdge(t9)).toBeTruthy();

							// Tile 7 vs
							expect(t7.sharesEdge(t1)).toBeFalsy();
							expect(t7.sharesEdge(t2)).toBeFalsy();
							expect(t7.sharesEdge(t3)).toBeFalsy();
							expect(t7.sharesEdge(t4)).toBeTruthy();
							expect(t7.sharesEdge(t5)).toBeFalsy();
							expect(t7.sharesEdge(t6)).toBeFalsy();
							expect(t7.sharesEdge(t8)).toBeTruthy();
							expect(t7.sharesEdge(t9)).toBeFalsy();

							// Tile 8 vs
							expect(t8.sharesEdge(t1)).toBeFalsy();
							expect(t8.sharesEdge(t2)).toBeFalsy();
							expect(t8.sharesEdge(t3)).toBeFalsy();
							expect(t8.sharesEdge(t4)).toBeFalsy();
							expect(t8.sharesEdge(t5)).toBeTruthy();
							expect(t8.sharesEdge(t6)).toBeFalsy();
							expect(t8.sharesEdge(t7)).toBeTruthy();
							expect(t8.sharesEdge(t9)).toBeTruthy();

							// Tile 9 vs
							expect(t9.sharesEdge(t1)).toBeFalsy();
							expect(t9.sharesEdge(t2)).toBeFalsy();
							expect(t9.sharesEdge(t3)).toBeFalsy();
							expect(t9.sharesEdge(t4)).toBeFalsy();
							expect(t9.sharesEdge(t5)).toBeFalsy();
							expect(t9.sharesEdge(t6)).toBeTruthy();
							expect(t9.sharesEdge(t7)).toBeFalsy();
							expect(t9.sharesEdge(t8)).toBeTruthy();
						});// it should find which tiles share an edge
						
						it('it should return an object identifying the shared edge', function () {
							var t1, t2, t3, t4, t5, t6, t7, t8, t9;

							t1 = new Tile2(0, 0, 8, 8);
							t2 = new Tile2(8, 0, 8, 8);
							t3 = new Tile2(16, 0, 8, 8);
							t4 = new Tile2(0, 8, 8, 8);
							t5 = new Tile2(8, 8, 8, 8);
							t6 = new Tile2(16, 8, 8, 8);
							t7 = new Tile2(0, 16, 8, 8);
							t8 = new Tile2(8, 16, 8, 8);
							t9 = new Tile2(16, 16, 8, 8);
							
							expect(t1.sharesEdge(t2)).toEqual({local: [0, 1], remote: [2, 3]});
							expect(t2.sharesEdge(t1)).toEqual({local: [2, 3], remote: [0, 1]});
							
							expect(t1.sharesEdge(t4)).toEqual({local: [1, 2], remote: [0, 3]});
							expect(t4.sharesEdge(t1)).toEqual({local: [0, 3], remote: [1, 2]});
							
							expect(t5.sharesEdge(t2)).toEqual({local: [0, 3], remote: [1, 2]});
							expect(t5.sharesEdge(t6)).toEqual({local: [0, 1], remote: [2, 3]});
							expect(t5.sharesEdge(t8)).toEqual({local: [1, 2], remote: [0, 3]});
							expect(t5.sharesEdge(t4)).toEqual({local: [2, 3], remote: [0, 1]});
						});// it should return an object identifying the shared edge
					});// desc sharesEdge
					
					describe('isVector2Internal', function () {
						it('it should detect internal vectors in a zeroed 8x8 Tile2', function () {
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(0, 0))).toBeTruthy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(0, 8))).toBeTruthy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(8, 8))).toBeTruthy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(8, 0))).toBeTruthy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(4, 4))).toBeTruthy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(5, 3))).toBeTruthy();
						});// it should detect internal vectors in a zeroed 8x8 Tile2
						
						it("it shouldn't detect internal vectors in a zeroed 8x8 Tile2", function () {
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(-1, 0))).toBeFalsy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(0, 9))).toBeFalsy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(8, 9))).toBeFalsy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(8, -1))).toBeFalsy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(14, 4))).toBeFalsy();
							expect(new Tile2(0, 0, 8, 8).isVector2Internal(new Vector2(5, 13))).toBeFalsy();
						});// it shouldn't detect internal vectors in a zeroed 8x8 Tile2
						
						it('it should detect internal vectors in a zeroed 32x32 Tile2', function () {
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(0, 0))).toBeTruthy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(0, 32))).toBeTruthy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(32, 32))).toBeTruthy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(32, 0))).toBeTruthy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(4, 4))).toBeTruthy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(23, 12))).toBeTruthy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(14, 19))).toBeTruthy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(29, 32))).toBeTruthy();
						});// it should detect internal vectors in a zeroed 8x8 Tile2
						
						it("it shouldn't detect internal vectors in a zeroed 32x32 Tile2", function () {
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(-1, 0))).toBeFalsy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(0, 33))).toBeFalsy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(32, 33))).toBeFalsy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(32, -1))).toBeFalsy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(4, 34))).toBeFalsy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(23, 212))).toBeFalsy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(154, 19))).toBeFalsy();
							expect(new Tile2(0, 0, 32, 32).isVector2Internal(new Vector2(129, 32))).toBeFalsy();
						});// it shouldn't detect internal vectors in a zeroed 8x8 Tile2
					});// desc isVector2Internal
				});// desc has the following function,
			});// desc once instantiated
		});// desc The tile2 object
	}
);