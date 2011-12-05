/*global define window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!level>level-segment',
		'thorny!model>main',
		'thorny!event',
		'thorny!math/vector2',
		'thorny!math/poly2',
		'thorny!math/tile2',
		'cjs!underscore'
	],
	function (
		Thorny,
		LevelSegment,
		Model,
		event,
		Vector2,
		Poly2,
		Tile2,
		underscore
	) {	
		describe('The Level-Segment Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					expect(typeof LevelSegment).toEqual('function');
					expect(typeof LevelSegment.instantiateUniqueVector2s).toEqual('function');
					expect(typeof LevelSegment.instantiateShapes).toEqual('function');
					expect(typeof LevelSegment.networkShapes).toEqual('function');
					expect(typeof LevelSegment.uniqueName).toEqual('function');
					expect(typeof LevelSegment.findRegion).toEqual('function');
					expect(typeof LevelSegment.vector2WithinLevelSegment).toEqual('function');
					expect(typeof LevelSegment.setupNetworkedNeighbours).toEqual('function');
					expect(typeof LevelSegment.instantiateEdges).toEqual('function');
					expect(typeof LevelSegment.instantiateEdgeLengths).toEqual('function');
					expect(typeof LevelSegment.edgePicker).toEqual('function');
				});// it should have the following functions
				
				describe('the instantiateUniqueVector2s function', function () {
					it('it should return a list of unique vector2s on a simple single poly2 segment', function () {
						var v2Hash = LevelSegment.instantiateUniqueVector2s(
							Poly2,
							[
								[
									{"x":   0, "y":   0},
									{"x": 100, "y":   0},
									{"x":   0, "y": 100}
								]
							]
						);
						
						expect(v2Hash instanceof Object).toBeTruthy();
						expect(v2Hash['0:0']   instanceof Vector2).toBeTruthy();
						expect(v2Hash['100:0'] instanceof Vector2).toBeTruthy();
						expect(v2Hash['0:100'] instanceof Vector2).toBeTruthy();
						
						expect(v2Hash['0:0'].getSimpleCoords()).toEqual([0, 0]);
						expect(v2Hash['100:0'].getSimpleCoords()).toEqual([100, 0]);
						expect(v2Hash['0:100'].getSimpleCoords()).toEqual([0, 100]);
					});// it should return a list of unique vector2s on a simple single poly2 segment
					
					it('it should return a list of unique vector2s on a simple multi poly2 segment', function () {
						var v2s = LevelSegment.instantiateUniqueVector2s(
							Poly2,
							[
								[
									{"x":   0, "y":   0},
									{"x": 100, "y":   0},
									{"x":   0, "y": 100}
								],
								[
									{"x": 100, "y":   0},// common in the first poly2
									{"x": 200, "y":   0},
									{"x": 100, "y": 100}
								],
								[
									{"x": 200, "y":   0},// common in the second poly2
									{"x": 300, "y":   0},
									{"x": 200, "y": 100}
								]
							]
						);
						
						expect(v2s instanceof Object).toBeTruthy();
						expect(v2s['0:0'] instanceof Vector2).toBeTruthy();
						expect(v2s['100:0'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:100'] instanceof Vector2).toBeTruthy();
						expect(v2s['200:0'] instanceof Vector2).toBeTruthy();
						expect(v2s['100:100'] instanceof Vector2).toBeTruthy();
						expect(v2s['300:0'] instanceof Vector2).toBeTruthy();
						expect(v2s['200:100'] instanceof Vector2).toBeTruthy();
						
						expect(v2s['0:0'].getSimpleCoords()).toEqual([0, 0]);
						expect(v2s['100:0'].getSimpleCoords()).toEqual([100, 0]);
						expect(v2s['0:100'].getSimpleCoords()).toEqual([0, 100]);
						expect(v2s['200:0'].getSimpleCoords()).toEqual([200, 0]);
						expect(v2s['100:100'].getSimpleCoords()).toEqual([100, 100]);
						expect(v2s['300:0'].getSimpleCoords()).toEqual([300, 0]);
						expect(v2s['200:100'].getSimpleCoords()).toEqual([200, 100]);
					});// it should return a list of unique vector2s on a simple multi poly2 segment
					
					it('it should return a list of unique vector2s on a complex single poly2 segment', function () {
						var v2s = LevelSegment.instantiateUniqueVector2s(
							Poly2,
							[
								[
									{"x": 0, "y": 0},
									{"x": 0, "y": 1},
									{"x": 0, "y": 2},
									{"x": 0, "y": 3},
									{"x": 0, "y": 4},
									{"x": 0, "y": 5},
									{"x": 0, "y": 6},
									{"x": 0, "y": 7},
									{"x": 0, "y": 8},
									{"x": 0, "y": 9}
								]
							]
						);
						
						expect(v2s instanceof Object).toBeTruthy();
						expect(v2s['0:0'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:1'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:2'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:3'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:4'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:5'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:6'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:7'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:8'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:9'] instanceof Vector2).toBeTruthy();
						
						expect(v2s['0:0'].getSimpleCoords()).toEqual([0, 0]);
						expect(v2s['0:1'].getSimpleCoords()).toEqual([0, 1]);
						expect(v2s['0:2'].getSimpleCoords()).toEqual([0, 2]);
						expect(v2s['0:3'].getSimpleCoords()).toEqual([0, 3]);
						expect(v2s['0:4'].getSimpleCoords()).toEqual([0, 4]);
						expect(v2s['0:5'].getSimpleCoords()).toEqual([0, 5]);
						expect(v2s['0:6'].getSimpleCoords()).toEqual([0, 6]);
						expect(v2s['0:7'].getSimpleCoords()).toEqual([0, 7]);
						expect(v2s['0:8'].getSimpleCoords()).toEqual([0, 8]);
						expect(v2s['0:9'].getSimpleCoords()).toEqual([0, 9]);
					});// it should return a list of unique vector2s on a complex single poly2 segment
					
					it('it should return a list of unique vector2s on a complex single poly2 segment that  contains duplicates', function () {
						var v2s = LevelSegment.instantiateUniqueVector2s(
							Poly2,
							[
								[
									{"x":   0, "y":   0},
									{"x": 100, "y":   0},
									{"x":   0, "y": 100},
									{"x":   0, "y":   0},
									{"x": 100, "y":   0},
									{"x":   0, "y": 100},
									{"x":   0, "y":   0},
									{"x": 100, "y":   0},
									{"x":   0, "y": 100},
									{"x":   0, "y":   0}
								]
							]
						);
						
						expect(v2s instanceof Object).toBeTruthy();
						expect(v2s['0:0'] instanceof Vector2).toBeTruthy();
						expect(v2s['100:0'] instanceof Vector2).toBeTruthy();
						expect(v2s['0:100'] instanceof Vector2).toBeTruthy();
						
						expect(v2s['0:0'].getSimpleCoords()).toEqual([0, 0]);
						expect(v2s['100:0'].getSimpleCoords()).toEqual([100, 0]);
						expect(v2s['0:100'].getSimpleCoords()).toEqual([0, 100]);
					});// it should return a list of unique vector2s on a complex single poly2 segment that  contains duplicates
					
					it("it should throw an exception if the parsed data isn't an array", function () {
						try {
							LevelSegment.instantiateUniqueVector2s(Poly2, false);
							expect(false).toBeTruthy();
							
						} catch (e) {
							expect(e.message).toEqual('LevelSegment.instantiateUniqueVector2s: Expected array.');
							expect(true).toBeTruthy();
						}
					});// it should throw an exception if the parsed data isn't an array
					
					it("it should throw an exception if the one of the raw poly2s isn't an array", function () {
						try {
							LevelSegment.instantiateUniqueVector2s(
								Poly2,
								[
									false
								]
							);
							expect(false).toBeTruthy();
							
						} catch (e) {
							expect(e.message).toEqual('LevelSegment.instantiateUniqueVector2s: Expected array.');
							expect(true).toBeTruthy();
						}
					});// it should throw an exception if the one of the raw poly2s isn't an array
					
					it("it should throw an exception if the one of the raw vector2s isn't a valid object", function () {
						try {
							LevelSegment.instantiateUniqueVector2s(
								Poly2,
								[
									[
										false
									]
								]
							);
							expect(false).toBeTruthy();
							
						} catch (e) {
							expect(e.message).toEqual('LevelSegment.instantiateUniqueVector2s: Expected object of type {x: 0, y: 0}.');
							expect(true).toBeTruthy();
						}
						
						try {
							LevelSegment.instantiateUniqueVector2s(
								Poly2,
								[
									[
										{a: 'b', c: 'd'}
									]
								]
							);
							expect(false).toBeTruthy();
							
						} catch (ee) {
							expect(ee.message).toEqual('LevelSegment.instantiateUniqueVector2s: Expected object of type {x: 0, y: 0}.');
							expect(true).toBeTruthy();
						}
					});// it should throw an exception if the one of the raw vector2s isn't a valid object
				});// desc the instantiateUniqueVector2s function
				
				describe('the instantiateShapes function', function () {
					it('it should return an array of poly2s based on a simple single poly2 segment', function () {
						var data, poly2s;
						
						data = [[
							{"x":   0, "y":   0},
							{"x": 100, "y":   0},
							{"x":   0, "y": 100}
						]];
						
						poly2s = LevelSegment.instantiateShapes(
							Poly2,
							data,
							LevelSegment.instantiateUniqueVector2s(Poly2, data)
							);
						
						expect(poly2s instanceof Array).toBeTruthy();
						expect(poly2s.length).toEqual(1);
						expect(poly2s[0] instanceof Poly2).toBeTruthy();
						expect(poly2s[0].getMidpoint().getIntegerCoords()).toEqual([33, 33]);
						
						expect(poly2s[0].getVector2s() instanceof Array).toBeTruthy();
						expect(poly2s[0].getVector2s().length).toEqual(3);
						expect(poly2s[0].getVector2s()[0].getSimpleCoords()).toEqual([0, 0]);
						expect(poly2s[0].getVector2s()[1].getSimpleCoords()).toEqual([100, 0]);
						expect(poly2s[0].getVector2s()[2].getSimpleCoords()).toEqual([0, 100]);
					});// it should return an array of poly2s based on a simple single poly2 segment
					
					it('it should return an array of poly2s based on a normal single poly2 segment', function () {
						var data, poly2s;
						
						data = [[
							{"x":   0, "y":   0},
							{"x": 100, "y":   0},
							{"x": 100, "y": 100},
							{"x":   0, "y": 100}
						]];
						
						poly2s = LevelSegment.instantiateShapes(
							Poly2,
							data,
							LevelSegment.instantiateUniqueVector2s(Poly2, data)
							);
						
						expect(poly2s instanceof Array).toBeTruthy();
						expect(poly2s.length).toEqual(1);
						expect(poly2s[0] instanceof Poly2).toBeTruthy();
						expect(poly2s[0].getMidpoint().getIntegerCoords()).toEqual([50, 50]);
						
						expect(poly2s[0].getVector2s() instanceof Array).toBeTruthy();
						expect(poly2s[0].getVector2s().length).toEqual(4);
						expect(poly2s[0].getVector2s()[0].getSimpleCoords()).toEqual([0, 0]);
						expect(poly2s[0].getVector2s()[1].getSimpleCoords()).toEqual([100, 0]);
						expect(poly2s[0].getVector2s()[2].getSimpleCoords()).toEqual([100, 100]);
						expect(poly2s[0].getVector2s()[3].getSimpleCoords()).toEqual([0, 100]);
					});// it should return an array of poly2s based on a normal single poly2 segment
					
					it('it should return an array of poly2s based on a normal multi poly2 segment', function () {
						var data, poly2s;
						
						data = [
							[
								{"x":   0, "y":   0},
								{"x": 100, "y":   0},
								{"x": 100, "y": 100},
								{"x":   0, "y": 100}
							],
							[
								{"x": 100, "y":   0},
								{"x": 200, "y":   0},
								{"x": 200, "y": 100},
								{"x": 100, "y": 100}
							]
						];
						
						poly2s = LevelSegment.instantiateShapes(
							Poly2,
							data,
							LevelSegment.instantiateUniqueVector2s(Poly2, data)
							);
						
						expect(poly2s instanceof Array).toBeTruthy();
						expect(poly2s.length).toEqual(2);
						
						expect(poly2s[0] instanceof Poly2).toBeTruthy();
						expect(poly2s[0].getMidpoint().getIntegerCoords()).toEqual([50, 50]);
						expect(poly2s[0].getVector2s() instanceof Array).toBeTruthy();
						expect(poly2s[0].getVector2s().length).toEqual(4);
						expect(poly2s[0].getVector2s()[0].getSimpleCoords()).toEqual([0, 0]);
						expect(poly2s[0].getVector2s()[1].getSimpleCoords()).toEqual([100, 0]);
						expect(poly2s[0].getVector2s()[2].getSimpleCoords()).toEqual([100, 100]);
						expect(poly2s[0].getVector2s()[3].getSimpleCoords()).toEqual([0, 100]);
						
						expect(poly2s[1] instanceof Poly2).toBeTruthy();
						expect(poly2s[1].getMidpoint().getIntegerCoords()).toEqual([150, 50]);
						expect(poly2s[1].getVector2s() instanceof Array).toBeTruthy();
						expect(poly2s[1].getVector2s().length).toEqual(4);
						expect(poly2s[1].getVector2s()[0].getSimpleCoords()).toEqual([100, 0]);
						expect(poly2s[1].getVector2s()[1].getSimpleCoords()).toEqual([200, 0]);
						expect(poly2s[1].getVector2s()[2].getSimpleCoords()).toEqual([200, 100]);
						expect(poly2s[1].getVector2s()[3].getSimpleCoords()).toEqual([100, 100]);
					});// it should return an array of poly2s based on a normal multi poly2 segment
					
					it('it should allow us to specify an offset', function () {
						var data, poly2s;
						
						data = [
							[
								{"x":   0, "y":   0},
								{"x": 100, "y":   0},
								{"x": 100, "y": 100},
								{"x":   0, "y": 100}
							],
							[
								{"x": 100, "y":   0},
								{"x": 200, "y":   0},
								{"x": 200, "y": 100},
								{"x": 100, "y": 100}
							]
						];
						
						poly2s = LevelSegment.instantiateShapes(
							Poly2,
							data,
							LevelSegment.instantiateUniqueVector2s(Poly2, data),
							100,
							50
							);
						
						expect(poly2s instanceof Array).toBeTruthy();
						expect(poly2s.length).toEqual(2);
						
						expect(poly2s[0] instanceof Poly2).toBeTruthy();
						expect(poly2s[0].getMidpoint().getIntegerCoords()).toEqual([150, 100]);
						expect(poly2s[0].getVector2s() instanceof Array).toBeTruthy();
						expect(poly2s[0].getVector2s().length).toEqual(4);
						expect(poly2s[0].getVector2s()[0].getSimpleCoords()).toEqual([100, 50]);
						expect(poly2s[0].getVector2s()[1].getSimpleCoords()).toEqual([200, 50]);
						expect(poly2s[0].getVector2s()[2].getSimpleCoords()).toEqual([200, 150]);
						expect(poly2s[0].getVector2s()[3].getSimpleCoords()).toEqual([100, 150]);
						
						expect(poly2s[1] instanceof Poly2).toBeTruthy();
						expect(poly2s[1].getMidpoint().getIntegerCoords()).toEqual([250, 100]);
						expect(poly2s[1].getVector2s() instanceof Array).toBeTruthy();
						expect(poly2s[1].getVector2s().length).toEqual(4);
						expect(poly2s[1].getVector2s()[0].getSimpleCoords()).toEqual([200, 50]);
						expect(poly2s[1].getVector2s()[1].getSimpleCoords()).toEqual([300, 50]);
						expect(poly2s[1].getVector2s()[2].getSimpleCoords()).toEqual([300, 150]);
						expect(poly2s[1].getVector2s()[3].getSimpleCoords()).toEqual([200, 150]);
					});// it should allow us to specify an offset
				});// desc the instantiateShapes function
				
				describe('the networkShapes function', function () {
					it('it should network two Poly2s together', function () {
						var ls, p1, p2, network, i = 0;
						
						ls = new LevelSegment();
						p1 = new Poly2(
							new Vector2(0, 0),
							new Vector2(100, 0),
							new Vector2(100, 100),
							new Vector2(0, 100)
							);
						p2 = new Poly2(
							new Vector2(100, 0),
							new Vector2(200, 0),
							new Vector2(200, 100),
							new Vector2(100, 100)
							);
						
						network = LevelSegment.networkShapes([p1, p2], ls);
						
						underscore.each(network, function (value, key) {
							i += 1;
						});
						expect(i).toEqual(2);
						expect(underscore.isObject(network[0])).toBeTruthy();
						expect(underscore.isObject(network[1])).toBeTruthy();
						expect(typeof network[0][1]).toEqual('number');
						expect(typeof network[1][0]).toEqual('number');
						
						expect(network[0][1]).toEqual(100);
						expect(network[1][0]).toEqual(100);
						
					});// it should network two Poly2s together
					
					it('it should network four Poly2s together', function () {
						var ls, p1, p2, p3, p4, network, i = 0;
						
						ls = new LevelSegment();
						p1 = new Poly2(
							new Vector2(0, 0),
							new Vector2(100, 0),
							new Vector2(100, 100),
							new Vector2(0, 100)
							);
						p2 = new Poly2(
							new Vector2(100, 0),
							new Vector2(200, 0),
							new Vector2(200, 100),
							new Vector2(100, 100)
							);
						p3 = new Poly2(
							new Vector2(0, 100),
							new Vector2(100, 100),
							new Vector2(100, 200),
							new Vector2(0, 200)
							);
						p4 = new Poly2(
							new Vector2(100, 100),
							new Vector2(200, 100),
							new Vector2(200, 200),
							new Vector2(100, 200)
							);
						
						network = LevelSegment.networkShapes([p1, p2, p3, p4], ls);
						
						underscore.each(network, function (value, key) {
							i += 1;
						});
						expect(i).toEqual(4);
						
						expect(underscore.isObject(network[0])).toBeTruthy();
						expect(underscore.isObject(network[1])).toBeTruthy();
						expect(underscore.isObject(network[2])).toBeTruthy();
						expect(underscore.isObject(network[3])).toBeTruthy();
						expect(typeof network[0][1]).toEqual('number');
						expect(typeof network[0][2]).toEqual('number');
						expect(typeof network[1][0]).toEqual('number');
						expect(typeof network[1][3]).toEqual('number');
						expect(typeof network[2][0]).toEqual('number');
						expect(typeof network[2][3]).toEqual('number');
						expect(typeof network[3][1]).toEqual('number');
						expect(typeof network[3][2]).toEqual('number');
						
						expect(network[0][1]).toEqual(100);
						expect(network[0][2]).toEqual(100);
						expect(network[1][0]).toEqual(100);
						expect(network[1][3]).toEqual(100);
						expect(network[2][0]).toEqual(100);
						expect(network[2][3]).toEqual(100);
						expect(network[3][1]).toEqual(100);
						expect(network[3][2]).toEqual(100);
					});// it should network four Poly2s together
					
					it('it should network four Tile2s together', function () {
						var ls, t1, t2, t3, t4, network, i = 0;
						
						ls = new LevelSegment();
						t1 = new Tile2(0, 0, 100, 100);
						t2 = new Tile2(100, 0, 100, 100);
						t3 = new Tile2(0, 100, 100, 100);
						t4 = new Tile2(100, 100, 100, 100);
						
						network = LevelSegment.networkShapes([t1, t2, t3, t4], ls);
						
						underscore.each(network, function (value, key) {
							i += 1;
						});
						expect(i).toEqual(4);
						
						expect(underscore.isObject(network[0])).toBeTruthy();
						expect(underscore.isObject(network[1])).toBeTruthy();
						expect(underscore.isObject(network[2])).toBeTruthy();
						expect(underscore.isObject(network[3])).toBeTruthy();
						
						expect(typeof network[0][1]).toEqual('number');
						expect(typeof network[0][2]).toEqual('number');
						expect(typeof network[1][0]).toEqual('number');
						expect(typeof network[1][3]).toEqual('number');
						expect(typeof network[2][0]).toEqual('number');
						expect(typeof network[2][3]).toEqual('number');
						expect(typeof network[3][1]).toEqual('number');
						expect(typeof network[3][2]).toEqual('number');
						
						expect(network[0][1]).toEqual(100);
						expect(network[0][2]).toEqual(100);
						expect(network[1][0]).toEqual(100);
						expect(network[1][3]).toEqual(100);
						expect(network[2][0]).toEqual(100);
						expect(network[2][3]).toEqual(100);
						expect(network[3][1]).toEqual(100);
						expect(network[3][2]).toEqual(100);
					});// it should network four Tile2s together
					
					describe('has an effect on the instantiation process', function () {
						it('it should automatically update the edges during networking, this Poly2 triangle chain', function () {
							var ls = new LevelSegment(
								Poly2,
								{
									data: [
										[
											{x: 0, y: 0},
											{x: 100, y: 0},
											{x: 0, y: 100}
										],
										[
											{x: 100, y: 0},
											{x: 100, y: 100},
											{x: 0, y: 100}
										],
										[
											{x: 100, y: 0},
											{x: 200, y: 0},
											{x: 100, y: 100}
										],
										[
											{x: 200, y: 0},
											{x: 200, y: 100},
											{x: 100, y: 100}
										]
									]
								}
							);
							
							expect(ls.isOpenEdge(0, 0)).toBeFalsy();
							expect(ls.isOpenEdge(0, 1)).toEqual([ls.getName(), 1, 2]);
							expect(ls.isOpenEdge(0, 2)).toBeFalsy();
							
							expect(ls.isOpenEdge(1, 0)).toEqual([ls.getName(), 2, 2]);
							expect(ls.isOpenEdge(1, 1)).toBeFalsy();
							expect(ls.isOpenEdge(1, 2)).toEqual([ls.getName(), 0, 1]);
							
							expect(ls.isOpenEdge(2, 0)).toBeFalsy();
							expect(ls.isOpenEdge(2, 1)).toEqual([ls.getName(), 3, 2]);
							expect(ls.isOpenEdge(2, 2)).toEqual([ls.getName(), 1, 0]);
							
							expect(ls.isOpenEdge(3, 0)).toBeFalsy();
							expect(ls.isOpenEdge(3, 1)).toBeFalsy();
							expect(ls.isOpenEdge(3, 2)).toEqual([ls.getName(), 2, 1]);
						});// it should automatically update the edges during networking, this Poly2 triangle chain
						
						it('it should automatically update the edges during networking, this Poly2 square square', function () {
							var ls = new LevelSegment(
								Poly2,
								{
									data: [
										[
											{x:   0, y: 0},
											{x: 100, y: 0},
											{x: 100, y: 100},
											{x:   0, y: 100}
										],
										[
											{x: 100, y: 0},
											{x: 200, y: 0},
											{x: 200, y: 100},
											{x: 100, y: 100}
										],
										[
											{x:   0, y: 100},
											{x: 100, y: 100},
											{x: 100, y: 200},
											{x:   0, y: 200}
										],
										[
											{x: 100, y: 100},
											{x: 200, y: 100},
											{x: 200, y: 200},
											{x: 100, y: 200}
										]
									]
								}
							);
							
							expect(ls.isOpenEdge(0, 0)).toBeFalsy();
							expect(ls.isOpenEdge(0, 1)).toEqual([ls.getName(), 1, 3]);
							expect(ls.isOpenEdge(0, 2)).toEqual([ls.getName(), 2, 0]);
							expect(ls.isOpenEdge(0, 3)).toBeFalsy();
							
							expect(ls.isOpenEdge(1, 0)).toBeFalsy();
							expect(ls.isOpenEdge(1, 1)).toBeFalsy();
							expect(ls.isOpenEdge(1, 2)).toEqual([ls.getName(), 3, 0]);
							expect(ls.isOpenEdge(1, 3)).toEqual([ls.getName(), 0, 1]);
							
							expect(ls.isOpenEdge(2, 0)).toEqual([ls.getName(), 0, 2]);
							expect(ls.isOpenEdge(2, 1)).toEqual([ls.getName(), 3, 3]);
							expect(ls.isOpenEdge(2, 2)).toBeFalsy();
							expect(ls.isOpenEdge(2, 3)).toBeFalsy();
							
							expect(ls.isOpenEdge(3, 0)).toEqual([ls.getName(), 1, 2]);
							expect(ls.isOpenEdge(3, 1)).toBeFalsy();
							expect(ls.isOpenEdge(3, 2)).toBeFalsy();
							expect(ls.isOpenEdge(3, 3)).toEqual([ls.getName(), 2, 1]);
						});// it should automatically update the edges during networking, this Poly2 square square
						
						it('it should automatically update the edges during network, this Tile2 based segment', function () {
							var ls = new LevelSegment(
								Tile2,
								{
									data: [
										{x: 0, y: 0},
										{x: 1, y: 0},
										{x: 0, y: 1},
										{x: 1, y: 1}
									]
								}
							);
							
							expect(ls.isOpenEdge(0, 0)).toEqual([ls.getName(), 1, 2]);
							expect(ls.isOpenEdge(0, 1)).toEqual([ls.getName(), 2, 3]);
							expect(ls.isOpenEdge(0, 2)).toBeFalsy();
							expect(ls.isOpenEdge(0, 3)).toBeFalsy();
							
							expect(ls.isOpenEdge(1, 0)).toBeFalsy();
							expect(ls.isOpenEdge(1, 1)).toEqual([ls.getName(), 3, 3]);
							expect(ls.isOpenEdge(1, 2)).toEqual([ls.getName(), 0, 0]);
							expect(ls.isOpenEdge(1, 3)).toBeFalsy();
							
							expect(ls.isOpenEdge(2, 0)).toEqual([ls.getName(), 3, 2]);
							expect(ls.isOpenEdge(2, 1)).toBeFalsy();
							expect(ls.isOpenEdge(2, 2)).toBeFalsy();
							expect(ls.isOpenEdge(2, 3)).toEqual([ls.getName(), 0, 1]);
							
							expect(ls.isOpenEdge(3, 0)).toBeFalsy();
							expect(ls.isOpenEdge(3, 1)).toBeFalsy();
							expect(ls.isOpenEdge(3, 2)).toEqual([ls.getName(), 2, 0]);
							expect(ls.isOpenEdge(3, 3)).toEqual([ls.getName(), 1, 1]);
						});// it should automatically update the edges during network, this Tile2 based segment
					});// desc has an effect on the instantiation process
				});// desc the networkShapes function
				
				describe('the uniqueName function', function () {
					it('it should return the name from parsed segment data', function () {
						// Workout what the first LevelSegment's automatic 
						// name should be, then we can work out what the
						// subsequent values should be.
						var n0 = parseInt(
							LevelSegment.uniqueName()
								.replace('LevelSegment:', ''),
							10// decimal
							);
						
						expect(LevelSegment.uniqueName()).toEqual('LevelSegment:' + (n0 + 1));
						expect(LevelSegment.uniqueName()).toEqual('LevelSegment:' + (n0 + 2));
						expect(LevelSegment.uniqueName()).toEqual('LevelSegment:' + (n0 + 3));
						expect(LevelSegment.uniqueName()).toEqual('LevelSegment:' + (n0 + 4));
						expect(LevelSegment.uniqueName()).toEqual('LevelSegment:' + (n0 + 5));
					});// it should return the name from parsed segment data
				});// desc the uniqueName function
				
				describe('the findRegion function', function () {
					it('it should find the min/max values in a simple triangle poly2', function () {
						var region = LevelSegment.findRegion(
							[
								new Vector2(50, 7),
								new Vector2(7, 27),
								new Vector2(17, 88)
							]
						);

						expect(region.minx).toEqual(7);
						expect(region.miny).toEqual(7);
						expect(region.maxx).toEqual(50);
						expect(region.maxy).toEqual(88);
					});// it should find the min/max values in a simple triangle poly2
					
					it('it should find the min/max values in a simple square poly2', function () {
						var region = LevelSegment.findRegion(
							[
								new Vector2(0, 0),
								new Vector2(100, 0),
								new Vector2(100, 100),
								new Vector2(0, 100)
							]
						);

						expect(region.minx).toEqual(0);
						expect(region.miny).toEqual(0);
						expect(region.maxx).toEqual(100);
						expect(region.maxy).toEqual(100);
					});// it should find the min/max values in a simple square poly2
					
					it('it should find the min/max values in a simple triangle poly2, thats been offset', function () {
						var region = LevelSegment.findRegion(
							[
								new Vector2(50, 7),
								new Vector2(7, 27),
								new Vector2(17, 88)
							],
							10,
							10
						);

						expect(region.minx).toEqual(17);
						expect(region.miny).toEqual(17);
						expect(region.maxx).toEqual(60);
						expect(region.maxy).toEqual(98);
					});// it should find the min/max values in a simple triangle poly2, thats been offset
				});// desc the findArea function
				
				describe('the vector2WithinLevelSegment function', function () {
					it('it should find points within a simple square poly2', function () {
						var segment = new LevelSegment(
							Poly2,
							{
								data: [
									[
										{x: 0, y: 0},
										{x: 100, y: 0},
										{x: 100, y: 100},
										{x: 0, y: 100}
									],
								]
							}
						);
						
						// Within's
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(50, 50)
								)
							).toBeTruthy();
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(0, 50)
								)
							).toBeTruthy();
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(50, 100)
								)
							).toBeTruthy();
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(0, 0)
								)
							).toBeTruthy();
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(100, 100)
								)
							).toBeTruthy();
						
						// Not Within's
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(-1, 50)
								)
							).toBeFalsy();
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(50, 101)
								)
							).toBeFalsy();
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(-1, 0)
								)
							).toBeFalsy();
						expect(
							LevelSegment.vector2WithinLevelSegment(
								segment,
								new Vector2(101, 100)
								)
							).toBeFalsy();
						
					});// it should find points within a simple square poly2
				});// desc the vector2WithinLevelSegment function
				
				describe('the setupNetworkedNeighbours function', function () {
					it('it should expose the default structure of a network entry', function () {
						var network = LevelSegment.setupNetworkedNeighbours([
							{
								something: 'random'
							}
						]);
						
						expect(underscore.isArray(network)).toBeTruthy();
						expect(network.length).toEqual(1);
						expect(underscore.isObject(network[0])).toBeTruthy();
						
						expect(network[0].target           !== undefined).toBeTruthy();
						expect(network[0].targetShapeId    !== undefined).toBeTruthy();
						expect(network[0].targetVector2Id1 !== undefined).toBeTruthy();
						expect(network[0].targetVector2Id2 !== undefined).toBeTruthy();
						expect(network[0].localShapeId     !== undefined).toBeTruthy();
						expect(network[0].localVector2Id1  !== undefined).toBeTruthy();
						expect(network[0].localVector2Id2  !== undefined).toBeTruthy();
						
						expect(network[0].target).toEqual(false);
						expect(network[0].targetShapeId).toEqual(false);
						expect(network[0].targetVector2Id1).toEqual(false);
						expect(network[0].targetVector2Id2).toEqual(false);
						expect(network[0].localShapeId).toEqual(false);
						expect(network[0].localVector2Id1).toEqual(false);
						expect(network[0].localVector2Id2).toEqual(false);
						expect(network[0].something).toEqual('random');
					});// it should expose the default structure of a network entry
					
					it('it should return a correctly formated network entry', function () {
						var network = LevelSegment.setupNetworkedNeighbours([
							{
								target: 'LevelSegment: 1234567890',
								targetShapeId: 1,
								targetVector2Id1: 2,
								targetVector2Id2: 3,
								localShapeId: 4,
								localVector2Id1: 5,
								localVector2Id2: 6
							}
						]);
						
						expect(underscore.isArray(network)).toBeTruthy();
						expect(network.length).toEqual(1);
						expect(underscore.isObject(network[0])).toBeTruthy();
						
						expect(network[0].target           !== undefined).toBeTruthy();
						expect(network[0].targetShapeId    !== undefined).toBeTruthy();
						expect(network[0].targetVector2Id1 !== undefined).toBeTruthy();
						expect(network[0].targetVector2Id2 !== undefined).toBeTruthy();
						expect(network[0].localShapeId     !== undefined).toBeTruthy();
						expect(network[0].localVector2Id1  !== undefined).toBeTruthy();
						expect(network[0].localVector2Id2  !== undefined).toBeTruthy();
						
						expect(network[0].target).toEqual('LevelSegment: 1234567890');
						expect(network[0].targetShapeId).toEqual(1);
						expect(network[0].targetVector2Id1).toEqual(2);
						expect(network[0].targetVector2Id2).toEqual(3);
						expect(network[0].localShapeId).toEqual(4);
						expect(network[0].localVector2Id1).toEqual(5);
						expect(network[0].localVector2Id2).toEqual(6);
						
					});// it should return a correctly formated network entry
					
					it('it should return a correctly formated network entry, with multiple enteries', function () {
						var network = LevelSegment.setupNetworkedNeighbours([
							{
								target: 'LevelSegment: 13579',
								targetShapeId: 1,
								targetVector2Id1: 2,
								targetVector2Id2: 3,
								localShapeId: 4,
								localVector2Id1: 5,
								localVector2Id2: 6
							},
							{
								target: 'LevelSegment: 24680',
								targetShapeId: 6,
								targetVector2Id1: 7,
								targetVector2Id2: 8,
								localShapeId: 9,
								localVector2Id1: 10,
								localVector2Id2: 11
							}
						]);
						
						expect(underscore.isArray(network)).toBeTruthy();
						expect(network.length).toEqual(2);
						expect(underscore.isObject(network[0])).toBeTruthy();
						expect(underscore.isObject(network[1])).toBeTruthy();
						
						expect(network[0].target           !== undefined).toBeTruthy();
						expect(network[0].targetShapeId    !== undefined).toBeTruthy();
						expect(network[0].targetVector2Id1 !== undefined).toBeTruthy();
						expect(network[0].targetVector2Id2 !== undefined).toBeTruthy();
						expect(network[0].localShapeId     !== undefined).toBeTruthy();
						expect(network[0].localVector2Id1  !== undefined).toBeTruthy();
						expect(network[0].localVector2Id2  !== undefined).toBeTruthy();
						
						expect(network[0].target).toEqual('LevelSegment: 13579');
						expect(network[0].targetShapeId).toEqual(1);
						expect(network[0].targetVector2Id1).toEqual(2);
						expect(network[0].targetVector2Id2).toEqual(3);
						expect(network[0].localShapeId).toEqual(4);
						expect(network[0].localVector2Id1).toEqual(5);
						expect(network[0].localVector2Id2).toEqual(6);
						
						expect(network[1].target           !== undefined).toBeTruthy();
						expect(network[1].targetShapeId    !== undefined).toBeTruthy();
						expect(network[1].targetVector2Id1 !== undefined).toBeTruthy();
						expect(network[1].targetVector2Id2 !== undefined).toBeTruthy();
						expect(network[1].localShapeId     !== undefined).toBeTruthy();
						expect(network[1].localVector2Id1  !== undefined).toBeTruthy();
						expect(network[1].localVector2Id2  !== undefined).toBeTruthy();
						
						expect(network[1].target).toEqual('LevelSegment: 24680');
						expect(network[1].targetShapeId).toEqual(6);
						expect(network[1].targetVector2Id1).toEqual(7);
						expect(network[1].targetVector2Id2).toEqual(8);
						expect(network[1].localShapeId).toEqual(9);
						expect(network[1].localVector2Id1).toEqual(10);
						expect(network[1].localVector2Id2).toEqual(11);
					});// it should return a correctly formated network entry, with multiple enteries
				});// desc the setupNetworkedNeighbours function
				
				describe('the instantiateEdges function', function () {
					it('it should setup the edges for a Poly2 based LevelSegment', function () {
						var edges = LevelSegment.instantiateEdges(
							Poly2,
							[
								new Poly2(
									new Vector2(0, 0),
									new Vector2(1, 0),
									new Vector2(1, 1)
									),
								new Poly2(
									new Vector2(0, 0),
									new Vector2(1, 0),
									new Vector2(1, 1),
									new Vector2(0, 1)
									),
								new Poly2(
									new Vector2(0, 0),
									new Vector2(1, 0),
									new Vector2(1, 1),
									new Vector2(1, 0.5),
									new Vector2(0, 1)
									)
							]
							);
						
						expect(underscore.isArray(edges)).toBeTruthy();
						expect(edges.length).toEqual(3);
						
						expect(underscore.isArray(edges[0])).toBeTruthy();
						expect(edges[0].length).toEqual(3);
						expect(edges[0][0]).toBeFalsy();
						expect(edges[0][1]).toBeFalsy();
						expect(edges[0][2]).toBeFalsy();
						
						expect(underscore.isArray(edges[1])).toBeTruthy();
						expect(edges[1].length).toEqual(4);
						expect(edges[1][0]).toBeFalsy();
						expect(edges[1][1]).toBeFalsy();
						expect(edges[1][2]).toBeFalsy();
						expect(edges[1][2]).toBeFalsy();
						
						expect(underscore.isArray(edges[2])).toBeTruthy();
						expect(edges[2].length).toEqual(5);
						expect(edges[2][0]).toBeFalsy();
						expect(edges[2][1]).toBeFalsy();
						expect(edges[2][2]).toBeFalsy();
						expect(edges[2][2]).toBeFalsy();
						expect(edges[2][2]).toBeFalsy();
					});// it should setup the edges for a Poly2 based LevelSegment
					
					it('it should setup the edges for a Tile2 based LevelSegment', function () {
						var edges = LevelSegment.instantiateEdges(
							Tile2,
							[
								new Tile2(),
								new Tile2(),
								new Tile2()
							]
							);
						
						expect(underscore.isArray(edges)).toBeTruthy();
						expect(edges.length).toEqual(3);

						expect(underscore.isArray(edges[0])).toBeTruthy();
						expect(edges[0].length).toEqual(4);
						expect(edges[0][0]).toBeFalsy();
						expect(edges[0][1]).toBeFalsy();
						expect(edges[0][2]).toBeFalsy();
						expect(edges[0][3]).toBeFalsy();
						
						expect(underscore.isArray(edges[1])).toBeTruthy();
						expect(edges[1].length).toEqual(4);
						expect(edges[1][0]).toBeFalsy();
						expect(edges[1][1]).toBeFalsy();
						expect(edges[1][2]).toBeFalsy();
						expect(edges[1][3]).toBeFalsy();
						
						expect(underscore.isArray(edges[2])).toBeTruthy();
						expect(edges[2].length).toEqual(4);
						expect(edges[2][0]).toBeFalsy();
						expect(edges[2][1]).toBeFalsy();
						expect(edges[2][2]).toBeFalsy();
						expect(edges[2][3]).toBeFalsy();
					});// it it should setup the edges for a Tile2 based LevelSegment
				});// desc the instantiateEdges function
				
				describe('the instantiateEdgeLengths function', function () {
					it('it should determine the length of all the edges within this LevelSegment', function () {
						var edges = LevelSegment.instantiateEdgeLengths(
							Poly2,
							[
								new Poly2(
									new Vector2(0, 0),
									new Vector2(100, 0),
									new Vector2(100, 100)
									),
								new Poly2(
									new Vector2(0, 0),
									new Vector2(100, 0),
									new Vector2(100, 100),
									new Vector2(0, 100)
									),
								new Poly2(
									new Vector2(0, 0),
									new Vector2(100, 0),
									new Vector2(100, 100),
									new Vector2(100, 50),
									new Vector2(0, 100)
									)
							]
						);
						
						expect(underscore.isArray(edges)).toBeTruthy();
						expect(edges.length).toEqual(3);
						expect(edges).toEqual([
							[ 100, 100, 141.4213562373095 ],
							[ 100, 100, 100, 100 ],
							[ 100, 100, 50, 111.80339887498948, 100 ]
						]);
					});// it should determine the length of all the edges within this LevelSegment
				});// desc the instantiateEdgeLengths function
				
				describe('the edgePicker function', function () {
					it('it should return the correct edge', function () {
						expect(LevelSegment.edgePicker(0, 1)).toEqual(0);
						expect(LevelSegment.edgePicker(1, 2)).toEqual(1);
						expect(LevelSegment.edgePicker(2, 3)).toEqual(2);
						expect(LevelSegment.edgePicker(3, 4)).toEqual(3);
						expect(LevelSegment.edgePicker(4, 5)).toEqual(4);
						expect(LevelSegment.edgePicker(5, 0)).toEqual(5);
					});// it should return the correct edge
				});// desc the edgePicker function
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should have the following functions', function () {
					var ls = new LevelSegment();
					
					// Structure
					expect(typeof ls).toEqual('object');
					expect(ls instanceof LevelSegment).toBeTruthy();
					expect(typeof ls.data).toEqual('function');
					
					// Functions
					expect(typeof ls.getName).toEqual('function');
					expect(typeof ls.getNetworkedNeighbours).toEqual('function');
					expect(typeof ls.getShapeById).toEqual('function');
					expect(typeof ls.setEdge).toEqual('function');
					expect(typeof ls.isOpenEdge).toEqual('function');
					expect(typeof ls.edgeLength).toEqual('function');
					expect(typeof ls.search).toEqual('function');
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('the getName function', function () {
						it('it should return a unique name generated when no name is specificed', function () {
							// Workout what the first LevelSegment's automatic 
							// name should be, then we can work out what the
							// subsequent values should be.
							var n0 = parseInt(
								new LevelSegment()
									.getName()
									.replace('LevelSegment:', ''),
								10// decimal
								);
							
							expect(new LevelSegment().getName()).toEqual('LevelSegment:' + (n0 + 1));
							expect(new LevelSegment().getName()).toEqual('LevelSegment:' + (n0 + 2));
							expect(new LevelSegment().getName()).toEqual('LevelSegment:' + (n0 + 3));
							expect(new LevelSegment().getName()).toEqual('LevelSegment:' + (n0 + 4));
							expect(new LevelSegment().getName()).toEqual('LevelSegment:' + (n0 + 5));
						});// it should return a unique name generated when no name is specificed
						
						it('it should return the name from parsed segment data', function () {
							var ls = new LevelSegment(
								Poly2,
								{
									name: 'some awesome level segment'
								}
							);
							
							expect(ls.getName()).toEqual('some awesome level segment');
						});// it should return the name from parsed segment data
						
						it("it should override the segment data's name value with one from the options", function () {
							var ls = new LevelSegment(
								Poly2,
								{
									name: 'some awesome level segment'
								}, {
									name: 'some slightly more awesome level segment'
								}
							);
							
							expect(ls.getName()).toEqual('some slightly more awesome level segment');
						});// it should override the segment data's name value with one from the options
					});// desc the getName function
					
					describe('the getNetworkedNeighbours function', function () {
						it('it should expose the default structure of a network entry', function () {
							var ls, network;
							
							ls = new LevelSegment(
								Poly2,
								{
									network: [
										{
											something: 'random'
										}
									]
								}
							);
							network = ls.getNetworkedNeighbours();

							expect(underscore.isArray(network)).toBeTruthy();
							expect(network.length).toEqual(1);
							expect(underscore.isObject(network[0])).toBeTruthy();

							expect(network[0].target           !== undefined).toBeTruthy();
							expect(network[0].targetShapeId    !== undefined).toBeTruthy();
							expect(network[0].targetVector2Id1 !== undefined).toBeTruthy();
							expect(network[0].targetVector2Id2 !== undefined).toBeTruthy();
							expect(network[0].localShapeId     !== undefined).toBeTruthy();
							expect(network[0].localVector2Id1  !== undefined).toBeTruthy();
							expect(network[0].localVector2Id2  !== undefined).toBeTruthy();

							expect(network[0].target).toEqual(false);
							expect(network[0].targetShapeId).toEqual(false);
							expect(network[0].targetVector2Id1).toEqual(false);
							expect(network[0].targetVector2Id2).toEqual(false);
							expect(network[0].localShapeId).toEqual(false);
							expect(network[0].localVector2Id1).toEqual(false);
							expect(network[0].localVector2Id2).toEqual(false);
							expect(network[0].something).toEqual('random');
						});// it should expose the default structure of a network entry
						
						it('it should return a correctly formated network entry', function () {
							var ls, network;
							
							
							ls = new LevelSegment(
								Poly2,
								{
									network: [
										{
											target: 'LevelSegment: 1234567890',
											targetShapeId: 1,
											targetVector2Id1: 2,
											targetVector2Id2: 3,
											localShapeId: 4,
											localVector2Id1: 5,
											localVector2Id2: 6
										}
									]
								}
							);
							network = ls.getNetworkedNeighbours();

							expect(underscore.isArray(network)).toBeTruthy();
							expect(network.length).toEqual(1);
							expect(underscore.isObject(network[0])).toBeTruthy();

							expect(network[0].target           !== undefined).toBeTruthy();
							expect(network[0].targetShapeId    !== undefined).toBeTruthy();
							expect(network[0].targetVector2Id1 !== undefined).toBeTruthy();
							expect(network[0].targetVector2Id2 !== undefined).toBeTruthy();
							expect(network[0].localShapeId     !== undefined).toBeTruthy();
							expect(network[0].localVector2Id1  !== undefined).toBeTruthy();
							expect(network[0].localVector2Id2  !== undefined).toBeTruthy();

							expect(network[0].target).toEqual('LevelSegment: 1234567890');
							expect(network[0].targetShapeId).toEqual(1);
							expect(network[0].targetVector2Id1).toEqual(2);
							expect(network[0].targetVector2Id2).toEqual(3);
							expect(network[0].localShapeId).toEqual(4);
							expect(network[0].localVector2Id1).toEqual(5);
							expect(network[0].localVector2Id2).toEqual(6);
						});// it should return a correctly formated network entry
						
						it('it should return a correctly formated network entry, with multiple enteries', function () {
							var ls, network;
							
							ls = new LevelSegment(
								Poly2,
								{
									network: [
										{
											target: 'LevelSegment: 13579',
											targetShapeId: 1,
											targetVector2Id1: 2,
											targetVector2Id2: 3,
											localShapeId: 4,
											localVector2Id1: 5,
											localVector2Id2: 6
										},
										{
											target: 'LevelSegment: 24680',
											targetShapeId: 6,
											targetVector2Id1: 7,
											targetVector2Id2: 8,
											localShapeId: 9,
											localVector2Id1: 10,
											localVector2Id2: 11
										}
									]
								}
							);
							network = ls.getNetworkedNeighbours();
							
							expect(underscore.isArray(network)).toBeTruthy();
							expect(network.length).toEqual(2);
							expect(underscore.isObject(network[0])).toBeTruthy();
							expect(underscore.isObject(network[1])).toBeTruthy();
							
							expect(network[0].target           !== undefined).toBeTruthy();
							expect(network[0].targetShapeId    !== undefined).toBeTruthy();
							expect(network[0].targetVector2Id1 !== undefined).toBeTruthy();
							expect(network[0].targetVector2Id2 !== undefined).toBeTruthy();
							expect(network[0].localShapeId     !== undefined).toBeTruthy();
							expect(network[0].localVector2Id1  !== undefined).toBeTruthy();
							expect(network[0].localVector2Id2  !== undefined).toBeTruthy();

							expect(network[0].target).toEqual('LevelSegment: 13579');
							expect(network[0].targetShapeId).toEqual(1);
							expect(network[0].targetVector2Id1).toEqual(2);
							expect(network[0].targetVector2Id2).toEqual(3);
							expect(network[0].localShapeId).toEqual(4);
							expect(network[0].localVector2Id1).toEqual(5);
							expect(network[0].localVector2Id2).toEqual(6);

							expect(network[1].target           !== undefined).toBeTruthy();
							expect(network[1].targetShapeId    !== undefined).toBeTruthy();
							expect(network[1].targetVector2Id1 !== undefined).toBeTruthy();
							expect(network[1].targetVector2Id2 !== undefined).toBeTruthy();
							expect(network[1].localShapeId     !== undefined).toBeTruthy();
							expect(network[1].localVector2Id1  !== undefined).toBeTruthy();
							expect(network[1].localVector2Id2  !== undefined).toBeTruthy();

							expect(network[1].target).toEqual('LevelSegment: 24680');
							expect(network[1].targetShapeId).toEqual(6);
							expect(network[1].targetVector2Id1).toEqual(7);
							expect(network[1].targetVector2Id2).toEqual(8);
							expect(network[1].localShapeId).toEqual(9);
							expect(network[1].localVector2Id1).toEqual(10);
							expect(network[1].localVector2Id2).toEqual(11);
						});// it should return a correctly formated network entry, with multiple enteries
					});// desc the getNetworkedNeighbours function
					
					describe('the getShapeById function', function () {
						it('it should return a Poly2 from within the LevelSegment', function () {
							var segment = new LevelSegment(
								Poly2,
								{
									data: [
										[
											{x: 0, y: 0},
											{x: 100, y: 0},
											{x: 100, y: 100}
										],
										[
											{x: 0, y: 0},
											{x: 100, y: 0},
											{x: 100, y: 100},
											{x: 0, y: 100}
										]
									]
								}
							);
							
							expect(Poly2.getLength(segment.getShapeById(0))).toEqual(3);
							expect(Poly2.getLength(segment.getShapeById(1))).toEqual(4);
						});// it should return a Poly2 from within the LevelSegment
						
						it('it should return a Tile2 from within the LevelSegment', function () {
							Tile2.setDefaults({
								height: 32,
								width: 32
							});
							
							var segment = new LevelSegment(
								Tile2,
								{
									data: [
										{x: 0, y: 0},
										{x: 1, y: 0},
										{x: 0, y: 1},
										{x: 1, y: 1}
									]
								}
							);
							
							expect(Tile2.getLength(segment.getShapeById(0))).toEqual(4);
							expect(Tile2.getLength(segment.getShapeById(1))).toEqual(4);
							expect(Tile2.getLength(segment.getShapeById(2))).toEqual(4);
							expect(Tile2.getLength(segment.getShapeById(3))).toEqual(4);
							
							expect(segment.getShapeById(0).getSimpleCoords()).toEqual([16, 16]);
							expect(segment.getShapeById(1).getSimpleCoords()).toEqual([48, 16]);
							expect(segment.getShapeById(2).getSimpleCoords()).toEqual([16, 48]);
							expect(segment.getShapeById(3).getSimpleCoords()).toEqual([48, 48]);
						});// it should return a Tile2 from within the LevelSegment
					});// desc the getShapeById function
					
					describe('the setEdge function', function () {
						it('it should alter the flag state within a LevelSegment', function () {
							var data, segment = new LevelSegment(
								Tile2,
								{
									data: [
										{x: 0, y: 0},
										{x: 1, y: 0},
										{x: 0, y: 1},
										{x: 1, y: 1}
									]
								}
							);
							
							// Because the network functions within the 
							// LevelSegments constructor alter the internal
							// flag state, we need to manually reset it.
							segment.data(
								'edges',
								LevelSegment.instantiateEdges(Tile2, segment.data('shapes'))
								);
							
							// Flag some edges
							segment
								.setEdge(0, 0, true)
								.setEdge(1, 0, true)
								.setEdge(1, 1, true)
								.setEdge(2, 0, true)
								.setEdge(2, 1, true)
								.setEdge(2, 2, true)
								.setEdge(3, 0, true)
								.setEdge(3, 1, true)
								.setEdge(3, 2, true)
								.setEdge(3, 3, true);
							
							data = segment.data('edges');
							
							expect(data[0][0]).toBeTruthy();
							expect(data[0][1]).toBeFalsy();
							expect(data[0][2]).toBeFalsy();
							expect(data[0][3]).toBeFalsy();
							
							expect(data[1][0]).toBeTruthy();
							expect(data[1][1]).toBeTruthy();
							expect(data[1][2]).toBeFalsy();
							expect(data[1][3]).toBeFalsy();
							
							expect(data[2][0]).toBeTruthy();
							expect(data[2][1]).toBeTruthy();
							expect(data[2][2]).toBeTruthy();
							expect(data[2][3]).toBeFalsy();
							
							expect(data[3][0]).toBeTruthy();
							expect(data[3][1]).toBeTruthy();
							expect(data[3][2]).toBeTruthy();
							expect(data[3][3]).toBeTruthy();
						});// it should alter the flag state within a LevelSegment
						
						it("it shouldn't error if trying to get an unknown value", function () {
							var segment = new LevelSegment(
								Tile2,
								{
									data: [
										{x: 0, y: 0},
										{x: 1, y: 0},
										{x: 0, y: 1},
										{x: 1, y: 1}
									]
								}
							);
							
							segment.setEdge(99, 99, false);
							
							expect(true).toBeTruthy();
						});// it shouldn't error if trying to get an unknown value
					});// desc the setEdge function
					
					describe('the isOpenEdge function', function () {
						it('it should return the correct value', function () {
							var segment = new LevelSegment(
								Tile2,
								{
									data: [
										{x: 0, y: 0},
										{x: 1, y: 0},
										{x: 0, y: 1},
										{x: 1, y: 1}
									]
								}
							);
							
							// Because the network functions within the 
							// LevelSegments constructor alter the internal
							// flag state, we need to manually reset it.
							segment.data(
								'edges',
								LevelSegment.instantiateEdges(Tile2, segment.data('shapes'))
								);
							
							// Flag some edges
							segment
								.setEdge(0, 0, true)
								.setEdge(1, 0, true)
								.setEdge(1, 1, true)
								.setEdge(2, 0, true)
								.setEdge(2, 1, true)
								.setEdge(2, 2, true)
								.setEdge(3, 0, true)
								.setEdge(3, 1, true)
								.setEdge(3, 2, true)
								.setEdge(3, 3, true);
							
							expect(segment.isOpenEdge(0, 0)).toBeTruthy();
							expect(segment.isOpenEdge(0, 1)).toBeFalsy();
							expect(segment.isOpenEdge(0, 2)).toBeFalsy();
							expect(segment.isOpenEdge(0, 3)).toBeFalsy();
							
							expect(segment.isOpenEdge(1, 0)).toBeTruthy();
							expect(segment.isOpenEdge(1, 1)).toBeTruthy();
							expect(segment.isOpenEdge(1, 2)).toBeFalsy();
							expect(segment.isOpenEdge(1, 3)).toBeFalsy();
							
							expect(segment.isOpenEdge(2, 0)).toBeTruthy();
							expect(segment.isOpenEdge(2, 1)).toBeTruthy();
							expect(segment.isOpenEdge(2, 2)).toBeTruthy();
							expect(segment.isOpenEdge(2, 3)).toBeFalsy();
							
							expect(segment.isOpenEdge(3, 0)).toBeTruthy();
							expect(segment.isOpenEdge(3, 1)).toBeTruthy();
							expect(segment.isOpenEdge(3, 2)).toBeTruthy();
							expect(segment.isOpenEdge(3, 3)).toBeTruthy();
						});// it should return the correct value
						
						it('it should return false if trying to access an unknown shape/point', function () {
							var segment = new LevelSegment(
								Tile2,
								{
									data: [
										{x: 0, y: 0},
										{x: 1, y: 0},
										{x: 0, y: 1},
										{x: 1, y: 1}
									]
								}
							);
							
							expect(segment.isOpenEdge(99, 99)).toBeFalsy();
						});// it should return false if trying to access an unknown shape/point
					});// desc the isOpenEdge function
					
					describe('the edgeLength function', function () {
						it('it should fetch the length of an edge', function () {
							var segment = new LevelSegment(
								Poly2,
								{
									data: [
										[
											{x: 0, y: 0},
											{x: 10, y: 0},
											{x: 10, y: 10},
											{x: 0, y: 10}
										],
										[
											{x: 10, y: 0},
											{x: 30, y: 0},
											{x: 30, y: 10},
											{x: 10, y: 10}
										]
									]
								}
							);
							
							expect(segment.edgeLength(0, 0)).toEqual(10);
							expect(segment.edgeLength(0, 1)).toEqual(10);
							expect(segment.edgeLength(0, 2)).toEqual(10);
							expect(segment.edgeLength(0, 3)).toEqual(10);
							expect(segment.edgeLength(1, 0)).toEqual(20);
							expect(segment.edgeLength(1, 1)).toEqual(10);
							expect(segment.edgeLength(1, 2)).toEqual(20);
							expect(segment.edgeLength(1, 3)).toEqual(10);
						});// it should fetch the length of an edge
					});// desc the edgeLength function
					
					describe('the search function', function () {
						it('it should allow a LevelSegment to be searched', function () {
							var world, ran = false;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json']
									)
								.triggers('the segment search function - loaded');
							
							event.bind('the segment search function - loaded', function () {
								// Localise the LevelSegment
								var segment = world
									.getComponent('level')
									.getSegment('001');
								
								expect(segment.search(10, 10)).toEqual(0);
								expect(segment.search(90, 10)).toEqual(0);
								expect(segment.search(10, 90)).toEqual(0);
								expect(segment.search(90, 90)).toEqual(0);
								expect(segment.search(110, 10)).toEqual(1);
								expect(segment.search(190, 10)).toEqual(1);
								expect(segment.search(110, 90)).toEqual(1);
								expect(segment.search(190, 90)).toEqual(1);
								expect(segment.search(10, 110)).toEqual(2);
								expect(segment.search(90, 110)).toEqual(2);
								expect(segment.search(10, 190)).toEqual(2);
								expect(segment.search(90, 190)).toEqual(2);
								expect(segment.search(110, 110)).toEqual(3);
								expect(segment.search(190, 110)).toEqual(3);
								expect(segment.search(110, 190)).toEqual(3);
								expect(segment.search(190, 190)).toEqual(3);
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should allow a LevelSegment to be searched
					});// the search function
				});// desc has the following function
			});// desc once instantiated
		});// desc The Level-Segment Object
	}
);