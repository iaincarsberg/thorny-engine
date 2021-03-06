/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny!math/vector2'
	],
	function (
		Vector2
	) {	
		describe('The vector2 object', function () {
			it('it should have a number of helper functions, and Compose.js helpers', function () {
				var 
					ran = false;
				
				expect(typeof Vector2).toEqual('function');// Because it has a constructer
				expect(typeof Vector2.extend).toEqual('function');
				expect(typeof Vector2.lineIntersection).toEqual('function');
				expect(typeof Vector2.centroid).toEqual('function');
				expect(typeof Vector2.isLeftOfEdge).toEqual('function');
				
				ran = true;
				waitsFor(function () {
					return ran;
				}, 'thorny!math/vector2 failed to load');
			});// it should have a number of helper functions, and Compose.js helpers
			
			describe('once instantiated', function () {
				it('it should expose the following functions', function () {
					var 
						ran = false,
						v2 = new Vector2(0, 0);
					
					expect(typeof v2.getX).toEqual('function');
					expect(typeof v2.getY).toEqual('function');
					expect(typeof v2.getSimpleCoords).toEqual('function');
					expect(typeof v2.getIntegerCoords).toEqual('function');
					expect(typeof v2.normalize).toEqual('function');
					expect(typeof v2.add).toEqual('function');
					expect(typeof v2.sub).toEqual('function');
					expect(typeof v2.translate).toEqual('function');
					expect(typeof v2.cross).toEqual('function');
					expect(typeof v2.dot).toEqual('function');
					expect(typeof v2.magnitude).toEqual('function');
					expect(typeof v2.distance).toEqual('function');
					expect(typeof v2.sameAs).toEqual('function');
					expect(typeof v2.rotate).toEqual('function');
					expect(typeof v2.angle).toEqual('function');
					expect(typeof v2.rotateToFace).toEqual('function');
					expect(typeof v2.toRadians).toEqual('function');
					expect(typeof v2.clone).toEqual('function');
					expect(typeof v2.copy).toEqual('function');
					
					ran = true;
					waitsFor(function () {
						return ran;
					}, 'thorny!math/vector2 failed to load');
				});// it should expose the following functions
				
				describe('should have a function called', function () {
					describe('getX', function () {
						it('it should correctly expose the x value', function () {
							var 
								ran = false,
								v1 = new Vector2(10, 0),
								v2 = new Vector2(-99, 0),
								v3 = new Vector2(1234567890, 0),
								v4 = new Vector2(-1234567890, 0),
								v5 = new Vector2(0, 0);

							expect(v1.getX()).toEqual(10);
							expect(v2.getX()).toEqual(-99);
							expect(v3.getX()).toEqual(1234567890);
							expect(v4.getX()).toEqual(-1234567890);
							expect(v5.getX()).toEqual(0);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: getX failed');
						});// it should correctly expose the x value
					});// desc getX
					
					describe('getY', function () {
						it('it should correctly expose the y value', function () {
							var 
								ran = false,
								v1 = new Vector2(0, 10),
								v2 = new Vector2(0, -99),
								v3 = new Vector2(0, 1234567890),
								v4 = new Vector2(0, -1234567890),
								v5 = new Vector2(0, 0);

							expect(v1.getY()).toEqual(10);
							expect(v2.getY()).toEqual(-99);
							expect(v3.getY()).toEqual(1234567890);
							expect(v4.getY()).toEqual(-1234567890);
							expect(v5.getY()).toEqual(0);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: getY failed');
						});// it should correctly expose the y value
					});// desc getY
					
					describe('getSimpleCoords', function () {
						it('it should expose an array containing the x/y values stored within the vector2', function () {
							var 
								ran = false,
								v1 = new Vector2(0, 0),
								v2 = new Vector2(1234567890, -1234567890),
								v3 = new Vector2(0.00000001, 10.99999999),
								v4 = new Vector2(123.45, 678.90),
								v5 = new Vector2(-1, -1),
								v6 = new Vector2(100, 0);
							
							expect(v1.getSimpleCoords()).toEqual([0, 0]);
							expect(v2.getSimpleCoords()).toEqual([1234567890, -1234567890]);
							expect(v3.getSimpleCoords()).toEqual([0.00000001, 10.99999999]);
							expect(v4.getSimpleCoords()).toEqual([123.45, 678.90]);
							expect(v5.getSimpleCoords()).toEqual([-1, -1]);
							expect(v6.getSimpleCoords()).toEqual([100, 0]);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: getSimpleCoords failed');
						});// it should expose an array containing the x/y values stored within the vector2
					});// desc getSimpleCoords

					describe('getIntegerCoords', function () {
						it('it should convert the decimal point accurate vector into integers', function () {
							var ran = false;
							
							expect(new Vector2(10, 10).getIntegerCoords()).toEqual([10, 10]);
							expect(new Vector2(0.930493, 0.12534553).getIntegerCoords()).toEqual([1, 0]);
							expect(new Vector2(100.34344, 9.9999999).getIntegerCoords()).toEqual([100, 10]);
							expect(new Vector2(5.0000001, 45.43553).getIntegerCoords()).toEqual([5, 45]);
							expect(new Vector2(3857.343, 74746.1).getIntegerCoords()).toEqual([3857, 74746]);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: getIntegerCoords failed');
						});// it should convert the decimal point accurate vector into integers
					});// desc getIntegerCoords

					describe('normalize', function () {
						it('it should normalise a vector', function () {
							var ran = false;
							
							expect(new Vector2(10, 0).normalize().getSimpleCoords()).toEqual([1, 0]);
							expect(new Vector2(0, 10).normalize().getSimpleCoords()).toEqual([0, 1]);
							expect(new Vector2(-10, 0).normalize().getSimpleCoords()).toEqual([-1, 0]);
							expect(new Vector2(0, -10).normalize().getSimpleCoords()).toEqual([0, -1]);

							expect(new Vector2(10, 10).normalize().getSimpleCoords()).toEqual([0.7071067811865475, 0.7071067811865475]);
							expect(new Vector2(10, -10).normalize().getSimpleCoords()).toEqual([0.7071067811865475, -0.7071067811865475]);
							expect(new Vector2(-10, 10).normalize().getSimpleCoords()).toEqual([-0.7071067811865475, 0.7071067811865475]);
							expect(new Vector2(-10, -10).normalize().getSimpleCoords()).toEqual([-0.7071067811865475, -0.7071067811865475]);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: getY normalize');
						});// it should normalise a vector
					});// desc normalize

					describe('add', function () {
						it('it should add two vectors together resulting in a 3rd', function () {
							var ran = false;
							
							expect(
								new Vector2(0, 0)
									.add(
										new Vector2(10, 10)
										)
									.getSimpleCoords()
								).toEqual([10, 10]);

							expect(
								new Vector2(-13, 13)
									.add(
										new Vector2(13, -13)
										)
									.getSimpleCoords()
								).toEqual([0, 0]);

							expect(
								new Vector2(99, 43)
									.add(
										new Vector2(101, -13)
										)
									.getSimpleCoords()
								).toEqual([200, 30]);

							expect(
								new Vector2(17, 9)
									.add(
										new Vector2(-83, -13)
										)
									.getSimpleCoords()
								).toEqual([-66, -4]);

							expect(
								new Vector2(17, 9)
									.add(
										new Vector2(45, 2)
										)
									.getSimpleCoords()
								).toEqual([62, 11]);
								
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: add failed');
						});// it should add two vectors together resulting in a 3rd
					});// desc add

					describe('sub', function () {
						it('it should subtract two vectors from one another and return a third', function () {
							var ran = false;
							
							expect(
								new Vector2(0, 0)
									.sub(
										new Vector2(10, 10)
										)
									.getSimpleCoords()
								).toEqual([-10, -10]);

							expect(
								new Vector2(20, 10)
									.sub(
										new Vector2(10, 10)
										)
									.getSimpleCoords()
								).toEqual([10, 0]);

							expect(
								new Vector2(-99, 50)
									.sub(
										new Vector2(45, 10)
										)
									.getSimpleCoords()
								).toEqual([-144, 40]);

							expect(
								new Vector2(56, -1)
									.sub(
										new Vector2(-57, 1)
										)
									.getSimpleCoords()
								).toEqual([113, -2]);

							expect(
								new Vector2(0, 0)
									.sub(
										new Vector2(0, 0)
										)
									.getSimpleCoords()
								).toEqual([0, 0]);
								
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: sub failed');
						});// it should subtract two vectors from one another and return a third
					});// desc sub

					describe('translate', function () {
						it('it should move a vector by a set amount', function () {
							var ran = false;
							
							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(1, 0),
										10
										)
									.getSimpleCoords()
								).toEqual([10, 0]);

							expect(
								new Vector2(60, 0)
									.translate(
										new Vector2(1, 1),
										10
										)
									.getSimpleCoords()
								).toEqual([67.07106781186548, 7.071067811865475]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(-1, 1),
										10
										)
									.getSimpleCoords()
								).toEqual([-7.071067811865475, 7.071067811865475]);
							ran = true;
							
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: translate failed');
						});// it should move a vector by a set amount
					});// desc translate

					describe('cross', function () {
						it('it should return the crossed value of a vector', function () {
							var ran = false;
							
							expect(
								new Vector2(10, 10)
									.cross(
										new Vector2(10, 10)
										)
								).toEqual(0);

							expect(
								new Vector2(10, 10)
									.cross(
										new Vector2(0, 10)
										)
								).toEqual(100);

							expect(
								new Vector2(0, 10)
									.cross(
										new Vector2(10, 0)
										)
								).toEqual(-100);

							expect(
								new Vector2(-10, 10)
									.cross(
										new Vector2(10, 10)
										)
								).toEqual(-200);

							expect(
								new Vector2(0, 0)
									.cross(
										new Vector2(10, 10)
										)
								).toEqual(0);
							ran = true;
							
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: cross failed');
						});// it should return the crossed value of a vector
					});// desc cross

					describe('dot', function () {
						it('it should find the dot product of two vectors', function () {
							var ran = false;
							
							expect(
								new Vector2(0, 0)
									.dot(
										new Vector2(0, 0)
										)
								).toEqual(0);

							expect(
								new Vector2(10, 10)
									.dot(
										new Vector2(10, 10)
										)
								).toEqual(200);

							expect(
								new Vector2(10, 10)
									.dot(
										new Vector2(0, 10)
										)
								).toEqual(100);

							expect(
								new Vector2(7, 8)
									.dot(
										new Vector2(3, -3)
										)
								).toEqual(-3);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: dot failed');
						});// it should find the dot product of two vectors
					});// desc dot

					describe('magnitude', function () {
						it('it should return the magnitude of a vector', function () {
							var ran = false;
						
							expect(
								new Vector2(10, 10)
									.magnitude()
								).toEqual(Math.sqrt(200));

							expect(
								new Vector2(30, 5)
									.magnitude()
								).toEqual(Math.sqrt(925));
								
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: magnitude failed');
						});// it should return the magnitude of a vector
					});// desc magnitude

					describe('distance', function () {
						it('it should find the distance between two points', function () {
							var ran = false;
							
							expect(
								new Vector2(0, 0)
									.distance(
										new Vector2(10, 0)
										)
								).toEqual(10);

							expect(
								new Vector2(0, 0)
									.distance(
										new Vector2(10, 10)
										)
								).toEqual(14.142135623730951);

							expect(
								new Vector2(0, 0)
									.distance(
										new Vector2(10, -10)
										)
								).toEqual(14.142135623730951);
								
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: distance failed');
						});// it should find the distance between two points
					});// desc distance

					describe('sameAs', function () {
						it('it should match the internal values within the vector', function () {
							var ran = false;
							
							expect(
								new Vector2(0, 0)
									.sameAs(
										new Vector2(0, 0)
										)
								).toBeTruthy();

							expect(
								new Vector2(10, 58)
									.sameAs(
										new Vector2(10, 58)
										)
								).toBeTruthy();

							expect(
								new Vector2(0.324567865432345, 45.234565432)
									.sameAs(
										new Vector2(0.324567865432345, 45.234565432)
										)
								).toBeTruthy();

							expect(
								new Vector2(1234678432, 567876543)
									.sameAs(
										new Vector2(1234678432, 567876543)
										)
								).toBeTruthy();
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: sameAs failed');
						});// it should match the internal values within the vector

						it('it shouldnt match the following', function () {
							var ran = false;
							
							expect(
								new Vector2(1234678432, 567876543)
									.sameAs(
										new Vector2(765434567, 435363636)
										)
								).toBeFalsy();

							expect(
								new Vector2(0.3435263463, 1)
									.sameAs(
										new Vector2(99, 8)
										)
								).toBeFalsy();

							expect(
								new Vector2(87628, 7654367.346743)
									.sameAs(
										new Vector2(0.234567876543212, 34)
										)
								).toBeFalsy();

							expect(
								new Vector2(45678543, 435.34565432)
									.sameAs(
										new Vector2(3456.3265, 4567)
										)
								).toBeFalsy();
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: ! sameAs failed');
						});// it shouldnt match the following
					});// desc sameAs

					describe('rotate', function () {
						it('it should allow you to rotate a vector', function () {
							var ran = false;
							
							/**
							 * We use translate to give us real world testable
							 * values, then the getIntegerCoords to avoid any
							 * rounding issues.
							 */

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(10, 0).rotate(0 * 0.0174532925),
										10
										)
									.getIntegerCoords()
								).toEqual([10, 0]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(10, 0).rotate(90 * 0.0174532925),
										10
										)
									.getIntegerCoords()
								).toEqual([0, 10]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(10, 0).rotate(180 * 0.0174532925),
										10
										)
									.getIntegerCoords()
								).toEqual([-10, 0]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(10, 0).rotate(270 * 0.0174532925),
										10
										)
									.getIntegerCoords()
								).toEqual([0, -10]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(10, 0).rotate(45 * 0.0174532925),
										10
										)
									.getIntegerCoords()
								).toEqual([7, 7]);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: translate failed');
						});// it should allow you to rotate a vector
					});// desc rotate

					describe('angle', function () {
						it('it should return the angle between two vectors', function () {
							var 
								ran = false,
								degRad = Math.PI / 180;

							expect(
								new Vector2(0, 0)
									.angle(
										new Vector2(10, 0)
										)
								).toEqual(0 * degRad);

							expect(
								new Vector2(0, 0)
									.angle(
										new Vector2(0, 10)
										)
								).toEqual(90 * degRad);

							expect(
								new Vector2(0, 0)
									.angle(
										new Vector2(-10, 0)
										)
								).toEqual(180 * degRad);

							// For 270degrees I need to use -90 as the angle
							// function retuns +-0/180
							expect(
								new Vector2(0, 0)
									.angle(
										new Vector2(0, -10)
										)
								).toEqual(-90 * degRad);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: getY failed');
						});// it should return the angle between two vectors
					});// desc angle

					describe('rotateToFace', function () {
						it('it should rotate a vector so that it faces a specific location', function () {
							var ran = false;
							
							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(0, 0).rotateToFace(new Vector2(1, 0)),
										10
										)
									.getIntegerCoords()
								).toEqual([10, 0]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(0, 0).rotateToFace(new Vector2(0, 1)),
										10
										)
									.getIntegerCoords()
								).toEqual([0, 10]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(0, 0).rotateToFace(new Vector2(-1, 0)),
										10
										)
									.getIntegerCoords()
								).toEqual([-10, 0]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(0, 0).rotateToFace(new Vector2(0, -1)),
										10
										)
									.getIntegerCoords()
								).toEqual([0, -10]);

							expect(
								new Vector2(0, 0)
									.translate(
										new Vector2(0, 0).rotateToFace(new Vector2(1, 1)),
										10
										)
									.getIntegerCoords()
								).toEqual([7, 7]);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: translate failed');
						});// it should rotate a vector so that it faces a specific location
					});// desc rotateToFace

					describe('toRadians', function () {
						it('it should convert degrees to radians', function () {
							var 
								ran = false,
								degRad = Math.PI / 180;

							expect(new Vector2(0, 0).toRadians()).toEqual(0 * degRad);	
							expect(new Vector2(0, 1).toRadians()).toEqual(90 * degRad);
							expect(new Vector2(-1, 0).toRadians()).toEqual(180 * degRad);
							expect(new Vector2(0, -1).toRadians()).toEqual(-90 * degRad);
							
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: toRadians failed');
						});// it should convert degrees to radians
					});// desc toRadians

					describe('clone', function () {
						it('it should duplicate a vector2 into a new vector2', function () {
							var ran = false,
								v1 = new Vector2(34, 66);

							// v1 will === v1, which is true
							expect(v1).toBe(v1);

							// but a clone of v1 is not === v1
							expect(v1.clone()).toNotBe(v1);

							// Check that the values are the same
							expect(
								v1
									.clone()
									.sameAs(new Vector2(34, 66))
								).toBeTruthy();
								
							ran = true;
							waitsFor(function () {
								return ran;
							}, 'thorny!math/vector2: clone failed');
						});// it should duplicate a vector2 into a new vector2
					});// desc clone
					
					describe('the copy function', function () {
						it('it should copy the coordinates from an existing Vector2', function () {
							var v1, v2;
							
							v1 = new Vector2(0, 0);
							v2 = new Vector2(10, 20);
							
							v1.copy(v2);
							
							expect(v1.getX()).toEqual(10);
							expect(v1.getY()).toEqual(20);
							
						});// it should copy the coordinates from an existing Vector2
					});// desc the copy function
				});// desc should have a function called
			});// desc once instantiated
			
			describe('its utility function,', function () {
				describe('lineIntersection', function () {
					it('it should detect a valid intersection between two lines in a cross', function () {
						var
							v1 = new Vector2(0, 0),
							v2 = new Vector2(10, 10),
							v3 = new Vector2(10, 0),
							v4 = new Vector2(0, 10);

						expect(
							Vector2.lineIntersection(v1, v2, v3, v4)
								.getSimpleCoords()
							).toEqual([5, 5]);
					});// it should detect a valid intersection between two lines in a cross

					it('it should detect a valid intersection between two lines in a cross', function () {
						var
							v1 = new Vector2(5, 0),
							v2 = new Vector2(5, 10),
							v3 = new Vector2(0, 5),
							v4 = new Vector2(10, 5);

						expect(
							Vector2.lineIntersection(v1, v2, v3, v4)
								.getSimpleCoords()
							).toEqual([5, 5]);
					});// it should detect a valid intersection between two lines in a cross

					it("should't detect any intersection", function () {
						var
							v1 = new Vector2(0, 0),
							v2 = new Vector2(0, 10),
							v3 = new Vector2(10, 0),
							v4 = new Vector2(10, 10);

						expect(
							Vector2.lineIntersection(v1, v2, v3, v4)
							).toBeFalsy();
					});// it should't detect any intersection

					it("should't detect any intersection", function () {
						var
							v1 = new Vector2(0, 0),
							v2 = new Vector2(10, 10),
							v3 = new Vector2(10, 0),
							v4 = new Vector2(5.1, 4.9);

						expect(
							Vector2.lineIntersection(v1, v2, v3, v4)
							).toBeFalsy();
					});// it should't detect any intersection
					
					it('it should detect a projected intersection', function () {
						var
							v1 = new Vector2(0, 10),
							v2 = new Vector2(5, 10),
							v3 = new Vector2(10, 0),
							v4 = new Vector2(10, 5);
						
						expect(
							Vector2.lineIntersection(v1, v2, v3, v4, false)
								.getSimpleCoords()
							).toEqual([10, 10]);
					});
				});// endof lineIntersection
				
				describe('centroid', function () {
					it('it should find the centroid in a 3 sided polygone', function () {
						var
							v1 = new Vector2(0, 0),
							v2 = new Vector2(10, 0),
							v3 = new Vector2(10, 10);

						expect(
							Vector2.centroid(v1, v2, v3)
								.getIntegerCoords()
							).toEqual([7, 3]);
					});// it should find the centroid in a 3 sided polygone
					
					it('it should find the centroid in a 4 sided polygon', function () {
						expect(
							Vector2.centroid(
								new Vector2(0, 0),
								new Vector2(10, 0),
								new Vector2(10, 10),
								new Vector2(0, 10)
								).getIntegerCoords()
						).toEqual([5, 5]);
					});// should find the centroid in a 4 sided polygon
					
					it('it should find the centroid in a 5 sided polygon', function () {
						expect(
							Vector2.centroid(
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
							Vector2.centroid(
								new Vector2(3, 0),
								new Vector2(7, 0),
								new Vector2(10, 5),
								new Vector2(7, 10),
								new Vector2(3, 10),
								new Vector2(0, 5)
								).getIntegerCoords()
						).toEqual([5, 5]);
					});// should find the centroid in a 6 sided polygon
				});// endof centroid
				
				describe('isLeftOfEdge', function () {
					it('it should determine which side of a line a point is', function () {
						expect(
							Vector2
								.isLeftOfEdge(
									new Vector2(10, 1), 
									new Vector2(20, 0), 
									new Vector2(0, 0)
									)
							).toBeTruthy();
						
						expect(
							Vector2
								.isLeftOfEdge(
									new Vector2(10, -1), 
									new Vector2(20, 0), 
									new Vector2(0, 0)
									)
							).toBeFalsy();

						expect(
							Vector2
								.isLeftOfEdge(
									new Vector2(11, 10), 
									new Vector2(10, 20), 
									new Vector2(10, 0)
									)
							).toBeFalsy();
							
						expect(
							Vector2
								.isLeftOfEdge(
									new Vector2(9, 10), 
									new Vector2(10, 20), 
									new Vector2(10, 0)
									)
							).toBeTruthy();
					});// it should determine which side of a line a point is
				});// endof isLeftOfEdge
			});// desc its utility function,
		});// desc The vector2 object
	}
);