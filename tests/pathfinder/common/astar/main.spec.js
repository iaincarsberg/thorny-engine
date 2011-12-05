/*global define window describe it expect runs waitsFor*/
define(
	[
		'thorny!pathfinder>astar/main',
		'thorny!model>main',
		'thorny!event',
		'thorny!math/vector2',
		'cjs!underscore'
	],
	function (
		AStar,
		Model,
		event,
		Vector2,
		underscore
	) {	
		describe('The AStar Pathfinder Base Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					expect(underscore.isFunction(AStar.route)).toBeTruthy();
					expect(underscore.isFunction(AStar.addUniqueToList)).toBeTruthy();
					expect(underscore.isFunction(AStar.isUniqueInList)).toBeTruthy();
					expect(underscore.isFunction(AStar.removeUniqueFromList)).toBeTruthy();
					expect(underscore.isFunction(AStar.calculateHeuristic)).toBeTruthy();
					expect(underscore.isFunction(AStar.estimateDistanceToGoal)).toBeTruthy();
					expect(underscore.isFunction(AStar.addToSearch)).toBeTruthy();
					expect(underscore.isFunction(AStar.addChildrenToOpen)).toBeTruthy();
					expect(underscore.isFunction(AStar.pickBestFromOpen)).toBeTruthy();
					expect(underscore.isFunction(AStar.minePath)).toBeTruthy();
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('the route function', function () {
						it('it should find a route through a complex Poly2 level', function () {
							var world, level, path, ran = false;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.route.1');
								
							event.bind('pathfinder.astar.route.1', function () {
								level = world.getComponent('level');
								
								path = AStar.route(
									level,
									level.search(0, 0),
									level.search(400, 300),
									1
									);
								
								expect(underscore.isArray(path)).toBeTruthy();
								expect(underscore.toArray(path)).toEqual([
									['001', 0], 
									['001', 1], 
									['001', 3], 
									['002', 0], 
									['002', 1], 
									['002', 3]
								]);
								expect(path.asReferences()).toEqual([
									['001', 0], 
									['001', 1], 
									['001', 3], 
									['002', 0], 
									['002', 1], 
									['002', 3]
								]);
								expect(path.asShapes(level)).toEqual([
									level.getSegmentShape.apply(level, ['001', 0]), 
									level.getSegmentShape.apply(level, ['001', 1]), 
									level.getSegmentShape.apply(level, ['001', 3]), 
									level.getSegmentShape.apply(level, ['002', 0]), 
									level.getSegmentShape.apply(level, ['002', 1]), 
									level.getSegmentShape.apply(level, ['002', 3])
								]);
								expect(path.asSimpleCoords(level)).toEqual([
									level.getSegmentShape.apply(level, ['001', 0]).getSimpleCoords(), 
									level.getSegmentShape.apply(level, ['001', 1]).getSimpleCoords(), 
									level.getSegmentShape.apply(level, ['001', 3]).getSimpleCoords(), 
									level.getSegmentShape.apply(level, ['002', 0]).getSimpleCoords(), 
									level.getSegmentShape.apply(level, ['002', 1]).getSimpleCoords(), 
									level.getSegmentShape.apply(level, ['002', 3]).getSimpleCoords()
								]);
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should find a route through a complex Poly2 level
					});// the route function', function
					
					describe('the addUniqueToList function', function () {
						it('it should add unique items to a collection', function () {
							var list = [];
							
							expect(AStar.addUniqueToList(list, ['001', 0])).toBeTruthy();
							expect(AStar.addUniqueToList(list, ['001', 1])).toBeTruthy();
							expect(AStar.addUniqueToList(list, ['001', 2])).toBeTruthy();
							expect(AStar.addUniqueToList(list, ['001', 3])).toBeTruthy();
							expect(AStar.addUniqueToList(list, ['001', 4])).toBeTruthy();
							
							expect(list).toEqual([
								['001', 0],
								['001', 1],
								['001', 2],
								['001', 3],
								['001', 4]
							]);
						});// it should add unique items to a collection
						
						it('it should return false if an item has already been added to a list', function () {
							var list = [
								['001', 0],
								['001', 1],
								['001', 2],
								['001', 3],
								['001', 4]
							];
							
							expect(AStar.addUniqueToList(list, ['001', 0])).toBeFalsy();
							expect(AStar.addUniqueToList(list, ['001', 1])).toBeFalsy();
							expect(AStar.addUniqueToList(list, ['001', 2])).toBeFalsy();
							expect(AStar.addUniqueToList(list, ['001', 3])).toBeFalsy();
							expect(AStar.addUniqueToList(list, ['001', 4])).toBeFalsy();
							
							expect(list).toEqual([
								['001', 0],
								['001', 1],
								['001', 2],
								['001', 3],
								['001', 4]
							]);
						});// it should return false if an item has already been added to a list
					});// the addUniqueToList function', function
					
					describe('the isUniqueInList function', function () {
						it('it should return true if an item is within a list', function () {
							var items = [
								['001', 0],
								['001', 1],
								['001', 2],
								['001', 3],
								['001', 4]
							];
							
							expect(AStar.isUniqueInList(items, ['001', 0])).toBeTruthy();
							expect(AStar.isUniqueInList(items, ['001', 1])).toBeTruthy();
							expect(AStar.isUniqueInList(items, ['001', 2])).toBeTruthy();
							expect(AStar.isUniqueInList(items, ['001', 3])).toBeTruthy();
							expect(AStar.isUniqueInList(items, ['001', 4])).toBeTruthy();
						});// it should return true if an item is within a list
						
						it("it should return false if an item isn't within a list", function () {
							var items = [];
							
							expect(AStar.isUniqueInList(items, ['001', 0])).toBeFalsy();
							expect(AStar.isUniqueInList(items, ['001', 1])).toBeFalsy();
							expect(AStar.isUniqueInList(items, ['001', 2])).toBeFalsy();
							expect(AStar.isUniqueInList(items, ['001', 3])).toBeFalsy();
							expect(AStar.isUniqueInList(items, ['001', 4])).toBeFalsy();
						});// it should return false if an item isn't within a list
					});// the isUniqueInList function', function
					
					describe('the removeUniqueFromList function', function () {
						it('it should remove an item from the list', function () {
							var items = [
								['001', 0],
								['001', 1],
								['001', 2],
								['001', 3],
								['001', 4]
							];
							
							expect(AStar.removeUniqueFromList(items, ['001', 0])).toEqual([['001', 1], ['001', 2], ['001', 3], ['001', 4]]);
							expect(AStar.removeUniqueFromList(items, ['001', 1])).toEqual([['001', 0], ['001', 2], ['001', 3], ['001', 4]]);
							expect(AStar.removeUniqueFromList(items, ['001', 2])).toEqual([['001', 0], ['001', 1], ['001', 3], ['001', 4]]);
							expect(AStar.removeUniqueFromList(items, ['001', 3])).toEqual([['001', 0], ['001', 1], ['001', 2], ['001', 4]]);
							expect(AStar.removeUniqueFromList(items, ['001', 4])).toEqual([['001', 0], ['001', 1], ['001', 2], ['001', 3]]);
						});// it should remove an item from the list
						
						it("it shouldn't alter the list, as the required item isn't in it", function () {
							var items = [
								['001', 0],
								['001', 1],
								['001', 2],
								['001', 3],
								['001', 4]
							];
								
							expect(AStar.removeUniqueFromList(items, ['002', 0])).toEqual([['001', 0], ['001', 1], ['001', 2], ['001', 3], ['001', 4]]);
							expect(AStar.removeUniqueFromList(items, ['002', 1])).toEqual([['001', 0], ['001', 1], ['001', 2], ['001', 3], ['001', 4]]);
							expect(AStar.removeUniqueFromList(items, ['002', 2])).toEqual([['001', 0], ['001', 1], ['001', 2], ['001', 3], ['001', 4]]);
							expect(AStar.removeUniqueFromList(items, ['002', 3])).toEqual([['001', 0], ['001', 1], ['001', 2], ['001', 3], ['001', 4]]);
							expect(AStar.removeUniqueFromList(items, ['002', 4])).toEqual([['001', 0], ['001', 1], ['001', 2], ['001', 3], ['001', 4]]);
						});// it shouldn't alter the list, as the required item isn't in it
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
					
					describe('the estimateDistanceToGoal function', function () {
						it('it should return valid estimates, when no parent is set', function () {
							var ran = false, world, level, costs = {};
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.estimateDistanceToGoal.1');

							event.bind('pathfinder.astar.estimateDistanceToGoal.1', function () {
								var runs = 0, fixture;
								
								fixture = [
									[['002', 0], ['001', 0]],
									[['002', 1], ['001', 0]],
									[['002', 2], ['001', 0]],
									[['002', 3], ['001', 0]],
									[['002', 0], ['001', 1]],
									[['002', 1], ['001', 1]],
									[['002', 2], ['001', 1]],
									[['002', 3], ['001', 1]],
									[['002', 0], ['001', 2]],
									[['002', 1], ['001', 2]],
									[['002', 2], ['001', 2]],
									[['002', 3], ['001', 2]],
									[['002', 0], ['001', 3]],
									[['002', 1], ['001', 3]],
									[['002', 2], ['001', 3]],
									[['002', 3], ['001', 3]]
								];
								
								level = world.getComponent('level');
								underscore.each(fixture, function (test) {
									expect(
										AStar.estimateDistanceToGoal(level, costs, AStar.calculateHeuristic, test[0], test[1])
									).toEqual(
										[
											0,
											AStar.calculateHeuristic(
												level.getSegmentShape(test[0]),
												level.getSegmentShape(test[1]))
										]
									);
									runs += 1;
								});
								
								expect(runs).toEqual(fixture.length);
								expect(costs).toEqual({});
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should return valid estimates, when no parent is set
						
						it('it should return valid estimates, when a parent IS set, but no prior costs have been incurred', function () {
							var ran = false, world, level, costs = {};
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.estimateDistanceToGoal.2');

							event.bind('pathfinder.astar.estimateDistanceToGoal.2', function () {
								var runs = 0, fixture;
								
								fixture = [
									[['002', 0], ['001', 0], ['001', 1]],
									[['002', 1], ['001', 0], ['001', 1]],
									[['002', 2], ['001', 0], ['001', 1]],
									[['002', 3], ['001', 0], ['001', 1]],
									[['002', 0], ['001', 0], ['001', 2]],
									[['002', 1], ['001', 0], ['001', 2]],
									[['002', 2], ['001', 0], ['001', 2]],
									[['002', 3], ['001', 0], ['001', 2]],
									
									[['002', 0], ['001', 1], ['001', 0]],
									[['002', 1], ['001', 1], ['001', 0]],
									[['002', 2], ['001', 1], ['001', 0]],
									[['002', 3], ['001', 1], ['001', 0]],
									[['002', 0], ['001', 1], ['001', 3]],
									[['002', 1], ['001', 1], ['001', 3]],
									[['002', 2], ['001', 1], ['001', 3]],
									[['002', 3], ['001', 1], ['001', 3]],
									
									[['002', 0], ['001', 2], ['001', 0]],
									[['002', 1], ['001', 2], ['001', 0]],
									[['002', 2], ['001', 2], ['001', 0]],
									[['002', 3], ['001', 2], ['001', 0]],
									[['002', 0], ['001', 2], ['001', 3]],
									[['002', 1], ['001', 2], ['001', 3]],
									[['002', 2], ['001', 2], ['001', 3]],
									[['002', 3], ['001', 2], ['001', 3]],
									
									[['002', 0], ['001', 3], ['001', 1]],
									[['002', 1], ['001', 3], ['001', 1]],
									[['002', 2], ['001', 3], ['001', 1]],
									[['002', 3], ['001', 3], ['001', 1]],
									[['002', 0], ['001', 3], ['001', 2]],
									[['002', 1], ['001', 3], ['001', 2]],
									[['002', 2], ['001', 3], ['001', 2]],
									[['002', 3], ['001', 3], ['001', 2]]
								];
								
								level = world.getComponent('level');
								underscore.each(fixture, function (test) {
									expect(
										AStar.estimateDistanceToGoal(level, costs, AStar.calculateHeuristic, test[0], test[1], test[2])
									).toEqual(
										[
											level.getDistance(test[1], test[2]),
											AStar.calculateHeuristic(
												level.getSegmentShape(test[0]),
												level.getSegmentShape(test[1]))
										]
									);
									
									runs += 1;
								});
								
								expect(runs).toEqual(fixture.length);
								expect(costs).toEqual({});
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should return valid estimates, when a parent IS set, but no prior costs have been incurred
						
						it('it should return valid estimates, when a parent IS set, AND prior costs have been incurred', function () {
							var ran = false, world, level, costs = {};
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.estimateDistanceToGoal.3');

							event.bind('pathfinder.astar.estimateDistanceToGoal.3', function () {
								var runs = 0, fixture, makeCosts;
								
								makeCosts = function () {
									return {
										'001:0': {traveled: 123},
										'001:1': {traveled: 325},
										'001:2': {traveled: 733},
										'001:3': {traveled: 256},
										'002:0': {traveled: 754},
										'002:1': {traveled: 857},
										'002:2': {traveled: 375},
										'002:3': {traveled: 963}
									};
								};
								
								fixture = [
									[['002', 0], ['001', 0], ['001', 1], makeCosts()],
									[['002', 1], ['001', 0], ['001', 1], makeCosts()],
									[['002', 2], ['001', 0], ['001', 1], makeCosts()],
									[['002', 3], ['001', 0], ['001', 1], makeCosts()],
									[['002', 0], ['001', 0], ['001', 2], makeCosts()],
									[['002', 1], ['001', 0], ['001', 2], makeCosts()],
									[['002', 2], ['001', 0], ['001', 2], makeCosts()],
									[['002', 3], ['001', 0], ['001', 2], makeCosts()],
									
									[['002', 0], ['001', 1], ['001', 0], makeCosts()],
									[['002', 1], ['001', 1], ['001', 0], makeCosts()],
									[['002', 2], ['001', 1], ['001', 0], makeCosts()],
									[['002', 3], ['001', 1], ['001', 0], makeCosts()],
									[['002', 0], ['001', 1], ['001', 3], makeCosts()],
									[['002', 1], ['001', 1], ['001', 3], makeCosts()],
									[['002', 2], ['001', 1], ['001', 3], makeCosts()],
									[['002', 3], ['001', 1], ['001', 3], makeCosts()],
									
									[['002', 0], ['001', 2], ['001', 0], makeCosts()],
									[['002', 1], ['001', 2], ['001', 0], makeCosts()],
									[['002', 2], ['001', 2], ['001', 0], makeCosts()],
									[['002', 3], ['001', 2], ['001', 0], makeCosts()],
									[['002', 0], ['001', 2], ['001', 3], makeCosts()],
									[['002', 1], ['001', 2], ['001', 3], makeCosts()],
									[['002', 2], ['001', 2], ['001', 3], makeCosts()],
									[['002', 3], ['001', 2], ['001', 3], makeCosts()],
									
									[['002', 0], ['001', 3], ['001', 1], makeCosts()],
									[['002', 1], ['001', 3], ['001', 1], makeCosts()],
									[['002', 2], ['001', 3], ['001', 1], makeCosts()],
									[['002', 3], ['001', 3], ['001', 1], makeCosts()],
									[['002', 0], ['001', 3], ['001', 2], makeCosts()],
									[['002', 1], ['001', 3], ['001', 2], makeCosts()],
									[['002', 2], ['001', 3], ['001', 2], makeCosts()],
									[['002', 3], ['001', 3], ['001', 2], makeCosts()]
								];
								
								level = world.getComponent('level');
								underscore.each(fixture, function (test) {
									expect(test[3][test[2].join(':')]).toBeTruthy();
									expect(
										AStar.estimateDistanceToGoal(level, test[3], AStar.calculateHeuristic, test[0], test[1], test[2])
									).toEqual(
										[
											level.getDistance(test[1], test[2]) +
											test[3][test[2].join(':')].traveled,
											AStar.calculateHeuristic(
												level.getSegmentShape(test[0]),
												level.getSegmentShape(test[1])
												)
										]
									);
									
									runs += 1;
								});
								
								expect(runs).toEqual(fixture.length);
								expect(costs).toEqual({});
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should return valid estimates, when a parent IS set, AND prior costs have been incurred
					});// the estimateDistanceToGoal function
					
					describe('the addToSearch function', function () {
						it('it should add a shape into the search', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.addToSearch.1');

							event.bind('pathfinder.astar.addToSearch.1', function () {
								level = world.getComponent('level');
								
								result = AStar.addToSearch(
									level, 
									costs, 
									open,
									AStar.calculateHeuristic, 
									['002', 3], 
									['001', 3], 
									['001', 2]
									);
								
								expect(result).toBeTruthy();
								expect(costs).toEqual({
									'001:3': {
										node: ['001', 3],
										from: ['001', 2],
										heuristic: AStar.calculateHeuristic(
											level.getSegmentShape(['002', 3]),
											level.getSegmentShape(['001', 3])
											),
										traveled: 100,
										toGoal: AStar.calculateHeuristic(
											level.getSegmentShape(['002', 3]),
											level.getSegmentShape(['001', 3])
											) + 100
									}
								});
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should add a shape into the search
						
						it('it should return false, if the current point is already in the open list', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.addToSearch.2');

							event.bind('pathfinder.astar.addToSearch.2', function () {
								level = world.getComponent('level');
								
								open.push(['001', 3]);
								result = AStar.addToSearch(
									level, 
									costs, 
									open,
									AStar.calculateHeuristic, 
									['002', 3], 
									['001', 3], 
									['001', 2]
									);
								
								expect(result).toBeFalsy();
								expect(costs).toEqual({});
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should update a route, when a better one is found
						
						it('it should replace a slower route', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.addToSearch.3');

							event.bind('pathfinder.astar.addToSearch.3', function () {
								level = world.getComponent('level');
								
								open.push(['001', 3]);
								costs['001:3'] = {
									node: ['001', 3],
									from: ['001', 2],
									heuristic: 1000,
									traveled: 1000,
									toGoal: 2000
								};
								
								result = AStar.addToSearch(
									level, 
									costs, 
									open,
									AStar.calculateHeuristic, 
									['002', 3], 
									['001', 3], 
									['001', 2]
									);
								
								expect(result).toBeTruthy();
								expect(costs).toEqual({
									'001:3': {
										node: ['001', 3],
										from: ['001', 2],
										heuristic: AStar.calculateHeuristic(
											level.getSegmentShape(['002', 3]),
											level.getSegmentShape(['001', 3])
											),
										traveled: 100,
										toGoal: AStar.calculateHeuristic(
											level.getSegmentShape(['002', 3]),
											level.getSegmentShape(['001', 3])
											) + 100
									}
								});
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should replace a slower route
						
						it('it shouldnt replace a quicker route', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.addToSearch.4');

							event.bind('pathfinder.astar.addToSearch.4', function () {
								level = world.getComponent('level');
								
								costs['001:3'] = {
									node: ['001', 3],
									from: ['000', 2],
									heuristic: 1,
									traveled: 1,
									toGoal: 2
								};
								
								result = AStar.addToSearch(
									level, 
									costs, 
									open,
									AStar.calculateHeuristic, 
									['002', 3], 
									['001', 3], 
									['001', 2]
									);
								
								expect(result).toBeFalsy();
								expect(costs).toEqual({
									'001:3': {
										node: ['001', 3],
										from: ['000', 2],
										heuristic: 1,
										traveled: 1,
										toGoal: 2
									}
								});
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it shouldnt replace a quicker route
					});// the addToSearch function', function
					
					describe('the addChildrenToOpen function', function () {
						it('it should add child elements to the open list', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.addChildrenToOpen.1');

							event.bind('pathfinder.astar.addChildrenToOpen.1', function () {
								level = world.getComponent('level');
								
								result = AStar.addChildrenToOpen(
									level, 
									costs, 
									open,
									AStar.calculateHeuristic, 
									['002', 3],
									['001', 3],
									10
									);
								
								expect(result).toBeTruthy();
								expect(open).toEqual([['002', 0], ['001', 1], ['001', 2]]);
								expect(costs).toEqual({
									'002:0': {
										node: ['002', 0],
										from: ['001', 3],
										heuristic: 200,
										traveled: 100,
										toGoal: 300
									},
									'001:1': {
										node: ['001', 1],
										from: ['001', 3],
										heuristic: 400,
										traveled: 100,
										toGoal: 500
									},
									'001:2': {
										node: ['001', 2],
										from: ['001', 3],
										heuristic: 400,
										traveled: 100,
										toGoal: 500
									}
								});
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should add child elements to the open list
						
						it('it should add child elements to the open list', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.addChildrenToOpen.2');

							event.bind('pathfinder.astar.addChildrenToOpen.2', function () {
								level = world.getComponent('level');
								
								result = AStar.addChildrenToOpen(
									level, 
									costs, 
									open,
									AStar.calculateHeuristic, 
									['001', 2],
									['001', 1],
									10
									);
								
								expect(result).toBeTruthy();
								expect(open).toEqual([['001', 0], ['001', 3]]);
								
								expect(costs).toEqual({
									'001:0': {
										node: ['001', 0],
										from: ['001', 1],
										heuristic: 100,
										traveled: 100,
										toGoal: 200
									},
									'001:3': {
										node: ['001', 3],
										from: ['001', 1],
										heuristic: 100,
										traveled: 100,
										toGoal: 200
									}
								});
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should add child elements to the open list
						
						it('it should check the length of an edge to makesure its less than the parsed diameter', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.astar.addChildrenToOpen.3');

							event.bind('pathfinder.astar.addChildrenToOpen.3', function () {
								level = world.getComponent('level');
								
								result = AStar.addChildrenToOpen(
									level, 
									costs, 
									open,
									AStar.calculateHeuristic, 
									['001', 2],
									['001', 1],
									1000
									);
								
								expect(result).toBeTruthy();
								expect(open).toEqual([]);
								expect(costs).toEqual({});
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should check the length of an edge to makesure its less than the parsed diameter
					});// the addChildrenToOpen function', function
					
					describe('the pickBestFromOpen function', function () {
						it('it should pick the best item from a simple list, there are no closed items', function () {
							var best = AStar.pickBestFromOpen(
								[
									['001', 0],
									['001', 1],
									['001', 2],
									['001', 3],
									['001', 4]
								],
								[],
								{
									'001:0': {toGoal: 5},
									'001:1': {toGoal: 3},
									'001:2': {toGoal: 1},
									'001:3': {toGoal: 4},
									'001:4': {toGoal: 2}
								}
							);
							
							expect(best).toMatch(['001', 2]);
						});// it should pick the best item from a simple list, there are no closed items
						
						it('it should pick the best item from a simple list, there ARE closed items', function () {
							var best = AStar.pickBestFromOpen(
								[
									['001', 0],
									['001', 1],
									['001', 2],
									['001', 3],
									['001', 4]
								],
								[
									['001', 1],
									['001', 2]
								],
								{
									'001:0': {toGoal: 5},
									'001:1': {toGoal: 3},
									'001:2': {toGoal: 1},
									'001:3': {toGoal: 4},
									'001:4': {toGoal: 2}
								}
							);
							
							expect(best).toMatch(['001', 4]);
						});// it should pick the best item from a simple list, there ARE closed items
					});// the pickBestFromOpen function', function
					
					describe('the minePath function', function () {
						it('it should process the costs array, and find a valid route to the origin', function () {
							var path = AStar.minePath(
								{
									'001:0': {node: ['001', 0], from: undefined},
									'001:1': {node: ['001', 1], from: ['001', 0]},
									'001:2': {node: ['001', 2], from: ['001', 1]},
									'001:3': {node: ['001', 3], from: ['001', 2]},
									'002:0': {node: ['002', 0], from: ['001', 3]},
									'002:1': {node: ['002', 1], from: ['002', 0]},
									'002:2': {node: ['002', 2], from: ['002', 1]},
									'002:3': {node: ['002', 3], from: ['002', 2]}
								},
								['002', 3]
							);
							
							expect(path).toEqual([
								['001', 0],
								['001', 1],
								['001', 2],
								['001', 3],
								['002', 0],
								['002', 1],
								['002', 2],
								['002', 3]
							]);
						});// it should process the costs array, and find a valid route to the origin
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