/*global define window describe it expect runs waitsFor*/
define(
	[
		'thorny!pathfinder>route',
		'thorny!model>main',
		'thorny!event',
		'cjs!underscore'
	],
	function (
		route,
		Model,
		event,
		underscore
	) {	
		describe('The Pathfinder Route Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					
				});// it should have the following functions
				
				describe('has the following function,', function () {
					
				});// desc has the following function,
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should have the following functions', function () {
					var path = route([]);
					
					expect(underscore.isArray(path)).toBeTruthy();
					expect(underscore.isFunction(path.asReferences)).toBeTruthy();
					expect(underscore.isFunction(path.asShapes)).toBeTruthy();
					expect(underscore.isFunction(path.asSimpleCoords)).toBeTruthy();
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('the asReferences function', function () {
						it('it should return a list of refernces', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;

							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.route.asReferences.1');

							event.bind('pathfinder.route.asReferences.1', function () {
								level = world.getComponent('level');

								var path = route([
									['001', 0],
									['001', 1],
									['001', 2],
									['001', 3],
									['002', 0],
									['002', 1],
									['002', 2],
									['002', 3]
								]);

								expect(path.asReferences()).toEqual([
									['001', 0],
									['001', 1],
									['001', 2],
									['001', 3],
									['002', 0],
									['002', 1],
									['002', 2],
									['002', 3]
								]);
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should return a list of refernces
					});// desc the asReferences function
					
					describe('the asShapes function', function () {
						it('it should reutrn a list of segment shapes', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;

							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.route.asShapes.1');

							event.bind('pathfinder.route.asShapes.1', function () {
								level = world.getComponent('level');

								var path = route([
									['001', 0],
									['001', 1],
									['001', 2],
									['001', 3],
									['002', 0],
									['002', 1],
									['002', 2],
									['002', 3]
								]);
								
								expect(path.asShapes(level)).toEqual([
									level.getSegmentShape.apply(level, ['001', 0]),
									level.getSegmentShape.apply(level, ['001', 1]),
									level.getSegmentShape.apply(level, ['001', 2]),
									level.getSegmentShape.apply(level, ['001', 3]),
									level.getSegmentShape.apply(level, ['002', 0]),
									level.getSegmentShape.apply(level, ['002', 1]),
									level.getSegmentShape.apply(level, ['002', 2]),
									level.getSegmentShape.apply(level, ['002', 3])
								]);
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should reutrn a list of segment shapes
						
						it('it should throw an exception if no level object is parsed', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;

							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.route.asShapes.2');

							event.bind('pathfinder.route.asShapes.2', function () {
								level = world.getComponent('level');

								var path = route([
									['001', 0],
									['001', 1]
								]);
								
								try {
									path.asShapes();
									expect(false).toBeTruthy();
									
								} catch (e) {
									expect(e.message).toEqual('pathfinder/route.asShape: Expected param to be of type Level.component');
									ran = true;
								}
							});

							waitsFor(function () {
								return ran;
							});
						});// it should throw an exception if no level object is parsed
					});// desc the asShapes function
					
					describe('the asSimpleCoords function', function () {
						it('it should reutrn a list of coordinates', function () {
							var ran = false, world, level, open = [], costs = {}, from, to, result;

							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('pathfinder.route.asSimpleCoords.1');

							event.bind('pathfinder.route.asSimpleCoords.1', function () {
								level = world.getComponent('level');

								var path = route([
									['001', 0],
									['001', 1],
									['001', 2],
									['001', 3],
									['002', 0],
									['002', 1],
									['002', 2],
									['002', 3]
								]);
								
								expect(path.asSimpleCoords(level)).toEqual([
									level.getSegmentShape.apply(level, ['001', 0]).getSimpleCoords(),
									level.getSegmentShape.apply(level, ['001', 1]).getSimpleCoords(),
									level.getSegmentShape.apply(level, ['001', 2]).getSimpleCoords(),
									level.getSegmentShape.apply(level, ['001', 3]).getSimpleCoords(),
									level.getSegmentShape.apply(level, ['002', 0]).getSimpleCoords(),
									level.getSegmentShape.apply(level, ['002', 1]).getSimpleCoords(),
									level.getSegmentShape.apply(level, ['002', 2]).getSimpleCoords(),
									level.getSegmentShape.apply(level, ['002', 3]).getSimpleCoords()
								]);

								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should reutrn a list of coordinates
					});// desc the asSimpleCoords function
				});// desc has the following function,
			});// desc once instantiated
		});// desc The Pathfinder Route Object
	}
);