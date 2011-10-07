/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny!math/poly2',
		'thorny!math/vector2'
	],
	function (
		Poly2,
		Vector2
	) {	
		describe('The Poly2 Object', function () {
			it('should have a number of helper functions, and Compose.js helpers', function () {
				expect(typeof Poly2).toEqual('function');// Because it has a constructer
				expect(typeof Poly2.extend).toEqual('function');
				expect(typeof Poly2.findAngles).toEqual('function');
				expect(typeof Poly2.findDistanceFromLineSegment).toEqual('function');
			});// it should have a number of helper functions, and Compose.js helpers
			
			describe('once instantiated', function () {
				describe('will find its centroid', function () {
					it('it should find the centroid in a 3 sided polygone', function () {
						expect(
							new Poly2(
								new Vector2(0, 0),
								new Vector2(10, 0),
								new Vector2(10, 10)
								).getIntegerCoords()
							).toEqual([7, 3]);
					});// it should find the centroid in a 3 sided polygone
					
					it('it should find the centroid in a 4 sided polygon', function () {
						expect(
							new Poly2(
								new Vector2(0, 0),
								new Vector2(10, 0),
								new Vector2(10, 10),
								new Vector2(0, 10)
								).getIntegerCoords()
						).toEqual([5, 5]);
					});// should find the centroid in a 4 sided polygon
					
					it('it should find the centroid in a 5 sided polygon', function () {
						expect(
							new Poly2(
								new Vector2(3, 0),
								new Vector2(7, 0),
								new Vector2(10, 5),
								new Vector2(5, 10),
								new Vector2(0, 5)
								).getIntegerCoords()
						).toEqual([5, 3]);
					});// should find the centroid in a 5 sided polygon
					
					it('it should find the centroid in a 6 sided polygon', function () {
						expect(
							new Poly2(
								new Vector2(3, 0),
								new Vector2(7, 0),
								new Vector2(10, 5),
								new Vector2(7, 10),
								new Vector2(3, 10),
								new Vector2(0, 5)
								).getIntegerCoords()
						).toEqual([5, 5]);
					});// should find the centroid in a 6 sided polygon
				});// desc 
				
				it('should expose the following functions', function () {
					var p2 = new Poly2(
						new Vector2(0, 0),
						new Vector2(10, 0),
						new Vector2(10, 10)
						);
					
					expect(typeof p2.getX).toEqual('function');
					expect(typeof p2.getY).toEqual('function');
					expect(typeof p2.getSimpleCoords).toEqual('function');
					expect(typeof p2.getIntegerCoords).toEqual('function');
					expect(typeof p2.normalize).toEqual('function');
					expect(typeof p2.add).toEqual('function');
					expect(typeof p2.sub).toEqual('function');
					expect(typeof p2.translate).toEqual('function');
					expect(typeof p2.cross).toEqual('function');
					expect(typeof p2.dot).toEqual('function');
					expect(typeof p2.magnitude).toEqual('function');
					expect(typeof p2.distance).toEqual('function');
					expect(typeof p2.sameAs).toEqual('function');
					expect(typeof p2.rotate).toEqual('function');
					expect(typeof p2.angle).toEqual('function');
					expect(typeof p2.rotateToFace).toEqual('function');
					expect(typeof p2.toRadians).toEqual('function');
					expect(typeof p2.clone).toEqual('function');
				});// it should expose the following functions
				
				
				
				describe('its instance function,', function () {
					describe('getVector2s', function () {
						it('should return the vector2s within a 3 pointed poly2', function () {
							var vector2s = new Poly2(
								new Vector2(0, 0),
								new Vector2(0, 100),
								new Vector2(100, 0)
								)
								.getVector2s();
							
							// Makesure the look right
							expect(vector2s[0].getIntegerCoords())
								.toEqual([0, 0]);
							expect(vector2s[1].getIntegerCoords())
								.toEqual([0, 100]);
							expect(vector2s[2].getIntegerCoords())
								.toEqual([100, 0]);
						});// it should return the vector2s within a 3 pointed poly2
						
						it('should return the vector2s within a 4 pointed poly2', function () {
							var vector2s = new Poly2(
								new Vector2(0, 0),
								new Vector2(50, 0),
								new Vector2(50, 50),
								new Vector2(0, 50)
								)
								.getVector2s();
							
							// Makesure they are still different
							expect(vector2s[0].getIntegerCoords())
								.toEqual([0, 0]);
							expect(vector2s[1].getIntegerCoords())
								.toEqual([50, 0]);
							expect(vector2s[2].getIntegerCoords())
								.toEqual([50, 50]);
							expect(vector2s[3].getIntegerCoords())
								.toEqual([0, 50]);
						});// it should return the vector2s within a 4 pointed poly2
						
						it('should return the vector2s in the correct lication within a translated poly2', function () {
							var poly2, vector2s;
							
							poly2 = new Poly2(
								new Vector2(0, 0),
								new Vector2(0, 50),
								new Vector2(50, 0)
								);
							
							// Move the poly2
							poly2
								.translate(new Vector2(1, 0), 50)
								.translate(new Vector2(0, 1), 50);
							
							vector2s = poly2.getVector2s();
							
							// Makesure they are still different
							expect(vector2s[0].getIntegerCoords())
								.toEqual([50, 50]);
							expect(vector2s[1].getIntegerCoords())
								.toEqual([50, 100]);
							expect(vector2s[2].getIntegerCoords())
								.toEqual([100, 50]);
						});// it should return the vector2s in the correct lication within a translated poly2
					});//getVector2s
					
					describe('getMidpoint', function () {
						it('should return the midpoint of a poly', function () {
							var 
								v1 = new Vector2(0, 0),
								v2 = new Vector2(0, 100),
								v3 = new Vector2(100, 0),
								poly = new Poly2(v1, v2, v3);

							expect(poly.getMidpoint().getIntegerCoords()).toEqual([33, 33]);
						});
					});//getMidpoint
					
					describe('sharesEdge', function () {
						it('should detect a sharded edge', function () {
							var 
								v1 = new Vector2(0, 0),
								v2 = new Vector2(0, 100),
								v3 = new Vector2(100, 0),
								v4 = new Vector2(100, 100),
								v5 = new Vector2(150, 100),
								
								p1 = new Poly2(
									v1.clone(), 
									v2.clone(), 
									v3.clone()
									),
								p2 = new Poly2(
									v2.clone(), 
									v3.clone(), 
									v4.clone()
									),
								p3 = new Poly2(
									v3.clone(), 
									v4.clone(), 
									v5.clone()
									);

							expect(p1.sharesEdge(p2)).toBeTruthy();
							expect(p2.sharesEdge(p1)).toBeTruthy();
							expect(p2.sharesEdge(p3)).toBeTruthy();
							expect(p3.sharesEdge(p2)).toBeTruthy();
						});// it should detect a sharded edge

						it("shouldn't detect a shared edge", function () {
							var 
								v1 = new Vector2(0, 0),
								v2 = new Vector2(0, 100),
								v3 = new Vector2(100, 0),
								v4 = new Vector2(100, 100),
								v5 = new Vector2(150, 100),
								p1 = new Poly2(
									v1.clone(), 
									v2.clone(),   
									v3.clone()
									),
								p2 = new Poly2(
									v2.clone(), 
									v3.clone(), 
									v4.clone()
									),
								p3 = new Poly2(
									v3.clone(), 
									v4.clone(), 
									v5.clone()
									);

							expect(p1.sharesEdge(p3)).toBeFalsy();
						});// it shouldn't detect a shared edge
					});//sharesEdge
					
					describe('isVector2Internal', function () {
						it('should detect is a vector2 is within a 3 point poly', function () {
							var 
								v1 = new Vector2(0, 0),
								v2 = new Vector2(0, 100),
								v3 = new Vector2(100, 0),
								ps = [
									new Poly2(v1.clone(), v2.clone(), v3.clone()),
									new Poly2(v2.clone(), v3.clone(), v1.clone()),
									new Poly2(v3.clone(), v1.clone(), v2.clone()),
									new Poly2(v3.clone(), v2.clone(), v1.clone()),
									new Poly2(v2.clone(), v1.clone(), v3.clone()),
									new Poly2(v1.clone(), v3.clone(), v2.clone())
								],
								counter = 0,
								i,	// Used for loop control
								ii;	// Used for loop delimiting

							for (i = 0, ii = ps.length; i < ii; i += 1) {
								expect(ps[i].isVector2Internal(new Vector2(0, 0))).toBeTruthy();

								expect(ps[i].isVector2Internal(new Vector2(0, 100))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(100, 0))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(40, 40))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(50, 0))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(0, 50))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(50, 50))).toBeTruthy();

								expect(ps[i].isVector2Internal(new Vector2(50.00001, 50.00001))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(101, 0))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(0, 101))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(-1, -1))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(-1, 0))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(0, -1))).toBeFalsy();

								counter += 1;
							}
						});// it should detect is a vector2 is within a 3 point poly
						
						it('should detect is a vector2 is within a 4 point poly', function () {
							var 
								v1 = new Vector2(0, 0),
								v2 = new Vector2(0, 100),
								v3 = new Vector2(100, 100),
								v4 = new Vector2(100, 0),
								ps = [
									new Poly2(v1.clone(), v2.clone(), v3.clone(), v4.clone()),
									new Poly2(v4.clone(), v1.clone(), v2.clone(), v3.clone()),
									new Poly2(v3.clone(), v4.clone(), v1.clone(), v2.clone()),
									new Poly2(v2.clone(), v3.clone(), v4.clone(), v1.clone())
								],
								counter = 0,
								i,	// Used for loop control
								ii;	// Used for loop delimiting

							for (i = 0, ii = ps.length; i < ii; i += 1) {
								expect(ps[i].isVector2Internal(new Vector2(0, 0))).toBeTruthy();

								expect(ps[i].isVector2Internal(new Vector2(0, 100))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(100, 0))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(40, 40))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(50, 0))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(0, 50))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(50, 50))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(88, 77))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(46, 54))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(50, 29))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(45, 94))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(34, 29))).toBeTruthy();
								expect(ps[i].isVector2Internal(new Vector2(100, 100))).toBeTruthy();

								expect(ps[i].isVector2Internal(new Vector2(101, 0))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(0, 101))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(-1, -1))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(-1, 0))).toBeFalsy();
								expect(ps[i].isVector2Internal(new Vector2(0, -1))).toBeFalsy();

								counter += 1;
							}
						});// it should detect is a vector2 is within a 4 point poly
					});//isVector2Internal
					
					describe('uncommonVector2', function () {
						it('should find the uncommon point in a poly', function () {
							var 
								v1 = new Vector2(0, 0),
								v2 = new Vector2(0, 100),
								v3 = new Vector2(100, 0),
								ps = [
									new Poly2(v1.clone(), v2.clone(), v3.clone()),
									new Poly2(v2.clone(), v3.clone(), v1.clone()),
									new Poly2(v3.clone(), v1.clone(), v2.clone()),
									new Poly2(v3.clone(), v2.clone(), v1.clone()),
									new Poly2(v2.clone(), v1.clone(), v3.clone()),
									new Poly2(v1.clone(), v3.clone(), v2.clone())
								],
								i,	// Used for loop control
								ii;	// Used for loop delimiting

							// Loop over the permutations of possible poly2s
							for (i = 0, ii = ps.length; i < ii; i += 1) {
								expect(
									ps[i].uncommonVector2([v2, v3]).sameAs(v1)
									)
									.toBeTruthy();
							}
							for (i = 0, ii = ps.length; i < ii; i += 1) {
								expect(
									ps[i].uncommonVector2([v1, v3]).sameAs(v2)
									)
									.toBeTruthy();
							}
							for (i = 0, ii = ps.length; i < ii; i += 1) {
								expect(
									ps[i].uncommonVector2([v1, v2]).sameAs(v3)
									)
									.toBeTruthy();
							}
						});// it should find the uncommon point in a poly
					});//uncommonVector2
				});// desc its instance functions,
				
				describe('its utility function,', function () {
					/*
						TODO write unit tests for the Poly2's utility functions.
					*/
				});// desc its utility function,
			});// desc once instantiated
		});// desc The Poly2 Object
	}
);