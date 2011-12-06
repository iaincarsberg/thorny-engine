/*global define window describe it xit waits expect runs waitsFor*/
define(
	[
		'thorny!pathfinder>astar/main',
		'thorny!pathfinder>funnel/main',
		'thorny!model>main',
		'thorny!event',
		'thorny!math/vector2',
		'cjs!underscore'
	],
	function (
		AStar,
		Funnel,
		Model,
		event,
		Vector2,
		underscore
	) {	
		describe('The Funnel Pathfinder Base Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					expect(underscore.isObject(Funnel)).toBeTruthy();
					expect(underscore.isFunction(Funnel.edgeify)).toBeTruthy();
					expect(underscore.isFunction(Funnel.pointify)).toBeTruthy();
					expect(underscore.isFunction(Funnel.process)).toBeTruthy();
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('has a edgeify function', function () {
						it('it should process a simple a* result set into a list of edges, on a simple Poly2 level', function () {
							var world, ran = false;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json']
									)
								.triggers('pathfinder.funnel.edgeify.1');
								
							event.bind('pathfinder.funnel.edgeify.1', function () {
								var level, path, edges;
								
								level = world.getComponent('level');
								
								level.getLevel().getSegmentFormatObject(function (Format) {
									path = AStar.route(
										level,
										level.search(10, 10),
										level.search(190, 190),
										1
										);
									
									edges = Funnel.edgeify(
										level,
										Format,
										path,
										10, 
										10,
										190,
										190
										);
									
									var s001 = level.getSegment('001');
									expect(edges).toEqual([
										Funnel.data.origin,
										s001.getShapeById(0).getVector2s()[1],
										s001.getShapeById(1).getVector2s()[1],
										s001.getShapeById(1).getVector2s()[2],
										Funnel.data.destination,
										s001.getShapeById(1).getVector2s()[3],
									]);
									
									ran = true;
								});
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should process a simple a* result set into a list of edges, on a simple Poly2 level
						
						it('it should process a simple a* result set into a list of edges, on a less simple Poly2 level', function () {
							var world, runs = 0;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.funnel.edgeify.2');
								
							event.bind('pathfinder.funnel.edgeify.2', function () {
								var level, path, edges;
								
								level = world.getComponent('level');
								
								level.getLevel().getSegmentFormatObject(function (Format) {
									path = AStar.route(
										level,
										level.search(10, 10),
										level.search(390, 290),
										1
										);
									edges = Funnel.edgeify(
										level,
										Format,
										path,
										10, 
										10,
										390,
										290
										);
									
									var s001 = level.getSegment('001'),
										s002 = level.getSegment('002');
									
									underscore.each(
										[
											Funnel.data.origin,
											s001.getShapeById(0).getVector2s()[1],
											s001.getShapeById(1).getVector2s()[1],
											s001.getShapeById(1).getVector2s()[2],
											s002.getShapeById(0).getVector2s()[1],
											s002.getShapeById(1).getVector2s()[1],
											s002.getShapeById(1).getVector2s()[2],
											Funnel.data.destination,
											s002.getShapeById(1).getVector2s()[3],
											s001.getShapeById(3).getVector2s()[2],
											s001.getShapeById(3).getVector2s()[3],
											s001.getShapeById(3).getVector2s()[0]
										], 
										function (edge, id) {
											expect(edges[id].sameAs(edge)).toBeTruthy();
											
											runs += 1;
										}
									);
								});
							});
							
							waitsFor(function () {
								return runs === 12;
							});
						});// it should process a simple a* result set into a list of edges, on a less simple Poly2 level
						
						it('it should return the parimiter of a single shape path', function () {
							var world, ran = false;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json']
									)
								.triggers('pathfinder.funnel.edgeify.3');
								
							event.bind('pathfinder.funnel.edgeify.3', function () {
								var level, path, edges;
								
								level = world.getComponent('level');
								
								level.getLevel().getSegmentFormatObject(function (Format) {
									path = AStar.route(
										level,
										level.search(0, 0),
										level.search(10, 0),
										1
										);
										
									edges = Funnel.edgeify(
										level,
										Format,
										path,
										0, 
										0,
										10,
										0
										);
									
									expect(edges).toEqual(
										level.getSegmentShape('001', 0)
											.getVector2s()
										);
									
									ran = true;
								});
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should return the parimiter of a single shape path
					});// desc has a edgeify function
					
					describe('the pointify function', function () {
						it('it should project points inwards on a super simple box room', function () {
							var runs = 0, edges, projected, fixture;
							
							edges = [
								new Vector2(0, 0),
								new Vector2(50, 0),
								new Vector2(50, 50),
								new Vector2(0, 50)
							];
							
							// Set the radius as the hypotenuse of a 10x10 box
							projected = Funnel.pointify(
								edges, 
								Math.sqrt((10 * 10) + (10 * 10))
								);
							
							fixture = {
								edges: [
									[0, 0],
									[50, 0],
									[50, 50],
									[0, 50]
								],
								projected: [
									[13, 13],
									[37, 13],
									[37, 37],
									[13, 37]
								]
							};
							
							underscore.each(edges, function (edge, id) {
								var point = projected[id];
								
								expect(edge.getSimpleCoords()).toEqual(fixture.edges[id]);
								expect(projected[id].getIntegerCoords()).toEqual(fixture.projected[id]);
								
								runs += 1;
							});
							
							expect(runs).toEqual(4);
						});// it should project points inwards on a super simple box room
						
						it('it should project points inwards on a mildly complex funnel', function () {
							var runs = 0, edges, projected, fixture;
							
							edges = [
								new Vector2(0, 0),
								new Vector2(250, 100),
								new Vector2(500, 0),
								new Vector2(500, 400),
								new Vector2(250, 300),
								new Vector2(0, 400)
							];
							
							// Set the radius as the hypotenuse of a 10x10 box
							projected = Funnel.pointify(
								edges, 
								Math.sqrt((10 * 10) + (10 * 10))
								);
							
							fixture = {
								edges: [
									[0, 0],
									[250, 100],
									[500, 0],
									[500, 400],
									[250, 300],
									[0, 400]
								],
								projected: [
									[13, 19],
									[250, 114],
									[487, 19],
									[487, 381],
									[250, 286],
									[13, 381]
								]
							};
							
							underscore.each(edges, function (edge, id) {
								expect(edge.getSimpleCoords()).toEqual(fixture.edges[id]);
								expect(projected[id].getIntegerCoords()).toEqual(fixture.projected[id]);
								
								runs += 1;
							});
							
							expect(runs).toEqual(6);
						});// it should project points inwards on a mildly complex funnel
					});// desc the pointify function
					
					describe('the process function', function () {
						it('it should find a route through a moderatly complex funnel', function () {
							var world, ran = false;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.funnel.process.1');
								
							event.bind('pathfinder.funnel.process.1', function () {
								var level, path, edges, points, route;
								
								level = world.getComponent('level');
								
								level.getLevel().getSegmentFormatObject(function (Format) {
									path = AStar.route(
										level,
										level.search(10, 10),
										level.search(390, 290),
										20
										);
									
									edges = Funnel.edgeify(
										level,
										Format,
										path,
										10, 
										10,
										390,
										290
										);
									
									points = Funnel.pointify(edges, 20);
									route = Funnel.process(edges, points, 390, 290);
									
									(function () {
										var es = [], ps = [];
										
										underscore.each(edges, function (edge) {
											es.push(edge.getIntegerCoords());
										});
										underscore.each(points, function (point) {
											if (point === false) {
												return;
											}
											ps.push(point.getIntegerCoords());
										});
										
										console.log('');
										console.log(JSON.stringify(es));
										console.log(JSON.stringify(ps));
									}());
									
									(function () {
										var ro = [], roo = [];
										underscore.each(route, function (pt) {
											ro.push(pt.getIntegerCoords());
											roo.push(pt.getIntegerCoords());
										});

										console.log(JSON.stringify(ro.concat(roo.reverse())));
									}());
									
									
									ran = true;
								});
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should find a route through a moderatly complex funnel
					});// the process function
				});// desc has the following function,
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should have the following functions', function () {
					// Nothing, as it has no Constructor
				});// it should have the following functions
			});// desc once instantiated
		});// desc The AStar Pathfinder Base Object
	}
);
/*
(function () {
	require.paths.unshift(__dirname + '/../');
	
	
	describe('the astar funnel system', function () {
		it('should have the following functions', function () {
			var ran = false;
			runs(function () {
				require('thorny/base')('./config/default.json')(function ($) {
					var funnel = $('thorny level pathfinder funnel');

					expect(typeof funnel.process).toEqual('function');
					expect(typeof funnel.edgeify).toEqual('function');
					expect(typeof funnel.pointify).toEqual('function');
					expect(typeof funnel.funnel).toEqual('function');
					
					ran = true;
				});//instanceof thorny
			});
			waits(200);
			runs(function () {
				expect(ran).toBeTruthy();
			});
		});//it should have the following functions
		
		describe('has a process function', function () {
			it('should process a simple a* result set into a path', function () {
				var ran = false;
				runs(function () {
					require('thorny/base')('./config/default.json')(function ($) {
						var 
							astar  = $('thorny level pathfinder astar'),
							funnel = $('thorny level pathfinder funnel'),
							fromClick,
							toClick,
							from,
							to,
							route,
							path,
							expected,
							i,	// Used for loop control
							ii;	// Used for loop delimiting
							
						// Load the levels
						$.es().makeEntity()
							.addTag('world')
							.addComponent('load-level', './thorny-spec-demo/files/level/room1.json')
							.addComponent('load-level', './thorny-spec-demo/files/level/room2.json')
							.triggers('loaded');
							
						// Listen for the loaded event.
						$.event().bind('loaded', function () {
							$.getTag('world')
								.getComponent('load-level')
								.first(function (level) {
									// Test one
									fromClick = $('thorny math vector2').factory(496, 50);
									toClick = $('thorny math vector2').factory(108, 340);
									from = level.data.xySearch($.getTag('world'), fromClick.getX(), fromClick.getY());
									to = level.data.xySearch($.getTag('world'), toClick.getX(), toClick.getY());
									
									// Search the network.
									route = astar.search(from, to, 16);
									path = funnel.process(
										fromClick,
										toClick,
										route,
										8
									);
									
									expected = [
										[496, 50],
										[346.9021048893677, 138.82161461266867],
										[108, 340]
									];

									expect(path.length).toEqual(expected.length);
									for (i = 0, ii = path.length; i < ii; i += 1) {
										expect(path[i].getSimpleCoords())
											.toEqual(expected[i]);
									}
									

									// Test two
									fromClick = $('thorny math vector2').factory(504, 54);
									toClick = $('thorny math vector2').factory(56, 458);
									from = level.data.xySearch($.getTag('world'), fromClick.getX(), fromClick.getY());
									to = level.data.xySearch($.getTag('world'), toClick.getX(), toClick.getY());
									
									route = astar.search(from, to, 16);
									path = funnel.process(
										fromClick,
										toClick,
										route,
										8
									);
									
									expected = [
										[504, 54],
										[427.438320875638, 116.38829388709452],
										[427.73361032928375, 171.04725945468473],
										[246.30525363717314, 366.28527956868874],
										[214.8145449315424, 360.96798414640267],
										[56, 458]
									];

									expect(path.length).toEqual(expected.length);
									for (i = 0, ii = path.length; i < ii; i += 1) {
										expect(path[i].getSimpleCoords())
											.toEqual(expected[i]);
									}

									// Test three
									fromClick = $('thorny math vector2').factory(280, 434);
									toClick = $('thorny math vector2').factory(114, 144);
									from = level.data.xySearch($.getTag('world'), fromClick.getX(), fromClick.getY());
									to = level.data.xySearch($.getTag('world'), toClick.getX(), toClick.getY());
									
									route = astar.search(from, to, 16);
									path = funnel.process(
										fromClick,
										toClick,
										route,
										8
									);
									
									expected = [
										[280, 434],
										[332.9183139651247, 259.859691291925],
										[304.6472248043002, 237.8797646649217],
										[114, 144]
									];

									expect(path.length).toEqual(expected.length);
									for (i = 0, ii = path.length; i < ii; i += 1) {
										expect(path[i].getSimpleCoords())
											.toEqual(expected[i]);
									}

									ran = true;
								});
						});
					});//instanceof thorny
				});
				waits(200);
				runs(function () {
					expect(ran).toBeTruthy();
				});
			});//it should process a simple a* result set into a path
		});// desc has a process function
		
		describe('has a pointify function', function () {
			it('should process a list of edges into a list of internal points', function () {
				var ran = false;
				runs(function () {
					require('thorny/base')('./config/default.json')(function ($) {
						// Load the levels
						$.es().makeEntity()
							.addTag('world')
							.addComponent('load-level', './thorny-spec-demo/files/level/poly.json')
							.triggers('loaded');
							
						// Listen for the loaded event.
						$.event().bind('loaded', function () {
							$.getTag('world')
								.getComponent('load-level')
								.first(function (level) {
									var
										funnel = $('thorny level pathfinder funnel'),
										iterator = level.data.iterator(),
										pointifyed,// Will the pointifyed data
										path = [
											iterator.stepTo(0).node,
											iterator.stepTo(1).node
										],
										edges = [
											iterator.stepTo(0).node.getVector2s()[0],
											iterator.stepTo(0).node.getVector2s()[2],
											iterator.stepTo(1).node.getVector2s()[2],
											iterator.stepTo(0).node.getVector2s()[1]
										];

									pointifyed = $('thorny level pathfinder funnel').pointify(path, edges, 50);

									expect(pointifyed.length).toEqual(4);
									expect(pointifyed[0].getIntegerCoords()).toEqual([35, 35]);
									expect(pointifyed[1].getIntegerCoords()).toEqual([35, 65]);
									expect(pointifyed[2].getIntegerCoords()).toEqual([65, 65]);
									expect(pointifyed[3].getIntegerCoords()).toEqual([65, 35]);

									// We round because its possible there will be
									// slight rounding errors.
									expect(Math.round(pointifyed[0].distance(edges[0]))).toEqual(50);
									expect(Math.round(pointifyed[1].distance(edges[1]))).toEqual(50);
									expect(Math.round(pointifyed[2].distance(edges[2]))).toEqual(50);
									expect(Math.round(pointifyed[3].distance(edges[3]))).toEqual(50);
									
									ran = true;
								});
						});// event().bind loaded
					});//instanceof thorny
				});
				waits(200);
				runs(function () {
					expect(ran).toBeTruthy();
				});
			});//it should process a list of edges into a list of internal points
		});// desc has a pointify function
		
		describe('has a funnel function', function () {
			it('should process an edge/edge input into a path', function () {
				// TODO
			});//it
			
			it('should process an edge/point input into a path', function () {
				var ran = false;
				runs(function () {
					require('thorny/base')('./config/default.json')(function ($) {
						// Load the levels
						$.es().makeEntity()
							.addTag('world')
							.addComponent('load-level', './thorny-spec-demo/files/level/room.json')
							.triggers('loaded');
							
						// Listen for the loaded event.
						$.event().bind('loaded', function () {
							$.getTag('world')
								.getComponent('load-level')
								.first(function (level) {
									var
										funnel = $('thorny level pathfinder funnel'),
										astar  = $('thorny level pathfinder astar'),
										from,
										to,
										fromClick,
										toClick,
										path,
										edges,
										projected,
										radius = 16;
									
									from = level.data.xySearch($.getTag('world'), 124, 342);
									to = level.data.xySearch($.getTag('world'), 304, 430);
									
									fromClick = $('thorny math vector2').factory(124, 342);
									toClick = $('thorny math vector2').factory(304, 430);
									
									
									// Find the path around the level.
									path = astar.search(
										from,
										to,
										(radius * 2)
										);
									
									// Find the paths edges
									edges = $('thorny level pathfinder funnel').edgeify(path);
									
									// Project the edges inwards.
									projected = $('thorny level pathfinder funnel').pointify(path, edges, radius);
									
									// Execute the funnel
									path = $('thorny level pathfinder funnel').funnel(fromClick, toClick, edges, projected);
													
									ran = true;
								});
						});// event().bind loaded
					});//instanceof thorny
				});
				waits(200);
				runs(function () {
					expect(ran).toBeTruthy();
				});
			});//it should process an edge/point input into a path
		});// desc has a funnel function
	});// desc the astar funnel system
}());
*/