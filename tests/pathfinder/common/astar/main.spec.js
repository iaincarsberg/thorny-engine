/*global define window describe it expect runs waitsFor*/
define(
	[
		'thorny!pathfinder>astar/main',
		'thorny!math/vector2',
		'cjs!underscore'
	],
	function (
		AStar,
		Vector2,
		underscore
	) {	
		xdescribe('The AStar Pathfinder Base Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					expect(underscore.isFunction(AStar.route)).toBeTruthy();
					expect(underscore.isFunction(AStar.addUniqueToList)).toBeTruthy();
					expect(underscore.isFunction(AStar.isUniqueInList)).toBeTruthy();
					expect(underscore.isFunction(AStar.removeUniqueFromList)).toBeTruthy();
					expect(underscore.isFunction(AStar.calculateHeuristic)).toBeTruthy();
					expect(underscore.isFunction(AStar.addToSearch)).toBeTruthy();
					expect(underscore.isFunction(AStar.addChildrenToOpen)).toBeTruthy();
					expect(underscore.isFunction(AStar.pickBestFromOpen)).toBeTruthy();
					expect(underscore.isFunction(AStar.minePath)).toBeTruthy();
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('the route function', function () {
						// TODO
					});// the route function', function
					
					describe('the addUniqueToList function', function () {
						// TODO
					});// the addUniqueToList function', function
					
					describe('the isUniqueInList function', function () {
						// TODO
					});// the isUniqueInList function', function
					
					describe('the removeUniqueFromList function', function () {
						// TODO
					});// the removeUniqueFromList function', function
					
					describe('the calculateHeuristic function', function () {
						it('it should find a valid manhatten distance heuristic for two entered coordinates', function () {
							expect(
								AStar.calculateHeuristic(
									new Vector2(0, 0),
									new Vector2(10, 10)
								)
							).toEqual(20);
								
							expect(
								AStar.calculateHeuristic(
									new Vector2(0, 0),
									new Vector2(-10, -10)
								)
							).toEqual(20);
							
							expect(
								AStar.calculateHeuristic(
									new Vector2(5, 5),
									new Vector2(10, 10)
								)
							).toEqual(10);
						});// it should find a valid manhatten distance heuristic for two entered coordinates
					});// the calculateHeuristic function', function
					
					describe('the addToSearch function', function () {
						it('it should add a shape into the search', function () {
							var open = [], costs = {}, from, to, result;
							from = new Vector2(0, 0);
							to = new Vector2(10, 10);
							
							result = AStar.addToSearch(open, costs, from, AStar.calculateHeuristic(from, to), false);
							
							console.log(
								open, costs, from.getSimpleCoords(), to.getSimpleCoords(), result
								);
						});// it should add a shape into the search
					});// the addToSearch function', function
					
					describe('the addChildrenToOpen function', function () {
						// TODO
					});// the addChildrenToOpen function', function
					
					describe('the pickBestFromOpen function', function () {
						// TODO
					});// the pickBestFromOpen function', function
					
					describe('the minePath function', function () {
						// TODO
					});// the minePath function', function
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


/*global console window describe it expect runs waits*/
/*
(function () {
	require.paths.unshift(__dirname + '/../');
	
	describe('the astar pathfinding system', function () {
		it('should have the following functions', function () {
			var ran = false;
			runs(function () {
				require('thorny/base')('./config/default.json')(function ($) {
					var astar = $('thorny level pathfinder astar');
					
					expect(typeof astar.search).toEqual('function');
					expect(typeof astar.__specs).toEqual('function');
					
					ran = true;
				});//instanceof thorny
			});
			waits(200);
			runs(function () {
				expect(ran).toBeTruthy();
			});
		});//it should have the following functions
		
		describe('has a search function', function () {
			it('should find a path through a simple 2d mesh level', function () {
				var ran = false;
				runs(function () {
					require('thorny/base')('./config/default.json')(function ($) {
						$.es().makeEntity()
							.addTag('world')
							.addComponent('load-level', './thorny-spec-demo/files/level/poly.json')
							.triggers('loaded');
						
						$.event().bind('loaded', function () {
							$.getTag('world')
								.getComponent('load-level')
								.first(function (level) {
									var 
										astar = $('thorny level pathfinder astar'),
										path,
										iterator,
										expected,
										i,	// Used for loop control
										ii;	// Used for loop delimiting
									
									// Search the network.
									path = astar.search(
										level.data.xySearch($.getTag('world'), 0, 0),
										level.data.xySearch($.getTag('world'), 50, 150),
										32
										);
									
									iterator = level.data.iterator();
									
									expected = [
										iterator.stepTo(0).node.getMidpoint(),
										iterator.stepTo(1).node.getMidpoint(),
										iterator.stepTo(2).node.getMidpoint()
									];
									
									// Makesure the example path is long enough
									expect(path.length).toEqual(3);

									// Then loop over the collection and expect the 
									// return to match the expected route.
									for (i = 0, ii = expected.length; i < ii; i += 1) {
										expect(path[i].getSimpleCoords())
											.toEqual(expected[i].getSimpleCoords());
									}
									
									ran = true;
								});
						});
					});//instanceof thorny
				});
				waits(50);
				runs(function () {
					expect(ran).toBeTruthy();
				});
			});//it should find a path through a simple 2d mesh level
			
			it('should find a path through a multiple 2d meshs', function () {
				var ran = false;
				runs(function () {
					require('thorny/base')('./config/default.json')(function ($) {
						$.es().makeEntity()
							.addTag('world')
							.addComponent('load-level', './thorny-spec-demo/files/level/multi/one.json')
							.addComponent('load-level', './thorny-spec-demo/files/level/multi/two.json')
							.addComponent('load-level', './thorny-spec-demo/files/level/multi/three.json')
							.triggers('loaded');
						
						$.event().bind('loaded', function () {
							$.getTag('world')
								.getComponent('load-level')
								.first(function (level) {
									var 
										astar = $('thorny level pathfinder astar'),
										path,
										iterator,
										expected,
										i,	// Used for loop control
										ii;	// Used for loop delimiting
										
									// Search the network.
									path = astar.search(
										level.data.xySearch($.getTag('world'), 0, 0),
										level.data.xySearch($.getTag('world'), 300, 100),
										1
										);
									
									iterator = level.data.iterator();
									
									expected = [
										[  33, 33 ], [ 67, 67 ],
										[ 133, 33 ], [ 167, 67 ],
										[ 233, 33 ], [ 267, 67 ]
									];
									
									// Makesure the example path is long enough
									expect(path.length).toEqual(6);
									
									// Then loop over the collection and expect the 
									// return to match the expected route.
									for (i = 0, ii = expected.length; i < ii; i += 1) {
										expect(path[i].getIntegerCoords())
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
			});//it should find a path through a multiple 2d meshs
		});// desc has a search function
		
		describe('has a __specs object', function () {
			// TODO
		});// desc has a __specs object
	});// desc the core node system
}());
*/