/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!entity-system>main',
		'thorny!model>main',
		'thorny!event',
		'thorny!level>main',
		'thorny!level>level-segment',
		'thorny!math/poly2',
		'cjs!underscore'
	],
	function (
		Thorny,
		Entity,
		Model,
		event,
		Level,
		LevelSegment,
		Poly2,
		underscore
	) {	
		describe('The Level.Component Object', function () {
			describe('once composed', function () {
				it('it should add the following functions', function () {
					var world = new Entity()
						.addComponent('level')
						.getComponent('level');
					
					expect(underscore.isFunction(world.getLevel)).toBeTruthy();
					expect(underscore.isFunction(world.addSegment)).toBeTruthy();
					expect(underscore.isFunction(world.removeSegment)).toBeTruthy();
					expect(underscore.isFunction(world.getSegment)).toBeTruthy();
					expect(underscore.isFunction(world.search)).toBeTruthy();
					expect(underscore.isFunction(world.getNeighbours)).toBeTruthy();
					expect(underscore.isFunction(world.getSegmentShape)).toBeTruthy();
					expect(underscore.isFunction(world.getDistance)).toBeTruthy();
				});// it should add the following functions
				
				describe('has the following function,', function () {
					xdescribe('the getLevel function', function () {
						console.log('TODO: Level.getComponent.getLevel');
					});// desc the getLevel function
					
					xdescribe('the addSegment function', function () {
						console.log('TODO: Level.getComponent.addSegment');
					});// desc the addSegment function
					
					xdescribe('the removeSegment function', function () {
						console.log('TODO: Level.getComponent.removeSegment');
					});// desc the removeSegment function
					
					xdescribe('the getSegment function', function () {
						console.log('TODO: Level.getComponent.getSegment');
					});// desc the getSegment function
					
					xdescribe('the search function', function () {
						console.log('TODO: Level.getComponent.search');
					});// desc the search function
					
					describe('the getNeighbours function', function () {
						it('it should return a list of neighbouring LevelSegments', function () {
							var ran = false, world;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('level.component.getNeighbours.0');
							
							event.bind('level.component.getNeighbours.0', function () {
								expect(
									world
										.getComponent('level')
										.getNeighbours('001')
									).toEqual(['002']);
								expect(
									world
										.getComponent('level')
										.getNeighbours('002')
									).toEqual(['001']);
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should return a list of neighbouring LevelSegments
						
						it('it should return false if attempting to find neighbours for an unknown segment', function () {
							var ran = false, world;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('level.component.getNeighbours.1');
							
							event.bind('level.component.getNeighbours.1', function () {
								expect(
									world
										.getComponent('level')
										.getNeighbours('an unknown segment')
									).toBeFalsy();
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should return false if attempting to find neighbours for an unknown segment
						
						
						
						it('it should return a list of neighbouring shapes for a specific shape within a LevelSegment', function () {
							var ran = false, world;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('level.component.getNeighbours.2');
							
							event.bind('level.component.getNeighbours.2', function () {
								var fixture, runs = 0;
								
								fixture = [
									{from: ['001', 0], neighbours: [['001', 1], ['001', 2]]},
									{from: ['001', 1], neighbours: [['001', 0], ['001', 3]]},
									{from: ['001', 2], neighbours: [['001', 0], ['001', 3]]},
									{from: ['001', 3], neighbours: [['002', 0], ['001', 1], ['001', 2]]},
									{from: ['002', 0], neighbours: [['001', 3], ['002', 1], ['002', 2]]},
									{from: ['002', 1], neighbours: [['002', 0], ['002', 3]]},
									{from: ['002', 2], neighbours: [['002', 0], ['002', 3]]},
									{from: ['002', 3], neighbours: [['002', 1], ['002', 2]]}
								];
								
								underscore.each(fixture, function (data) {
									expect(
										world
											.getComponent('level')
											.getNeighbours.apply(world, data.from)
										)
										.toMatch(data.neighbours);
									
									runs += 1;
								});
								
								
								expect(runs).toEqual(fixture.length);
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should return a list of neighbouring shapes for a specific shape within a LevelSegment
					});// desc the getNeighbours function
					
					describe('the getSegmentShape function', function () {
						it('it should return the shape', function () {
							var ran = false, world;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('level.component.getSegmentShape.1');
							
							event.bind('level.component.getSegmentShape.1', function () {
								var level = world.getComponent('level');
								
								expect(level.getSegmentShape('001', 0).getSimpleCoords()).toEqual([50, 50]);
								expect(level.getSegmentShape('001', 1).getSimpleCoords()).toEqual([150, 50]);
								expect(level.getSegmentShape('001', 2).getSimpleCoords()).toEqual([50, 150]);
								expect(level.getSegmentShape('001', 3).getSimpleCoords()).toEqual([150, 150]);
								expect(level.getSegmentShape('002', 0).getSimpleCoords()).toEqual([250, 150]);
								expect(level.getSegmentShape('002', 1).getSimpleCoords()).toEqual([350, 150]);
								expect(level.getSegmentShape('002', 2).getSimpleCoords()).toEqual([250, 250]);
								expect(level.getSegmentShape('002', 3).getSimpleCoords()).toEqual([350, 250]);
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should return the shape
						
						it('it should work, when parsed an array', function () {
							var ran = false, world;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('level.component.getSegmentShape.2');
							
							event.bind('level.component.getSegmentShape.2', function () {
								var level = world.getComponent('level');
								
								expect(level.getSegmentShape(['001', 0]).getSimpleCoords()).toEqual([50, 50]);
								expect(level.getSegmentShape(['001', 1]).getSimpleCoords()).toEqual([150, 50]);
								expect(level.getSegmentShape(['001', 2]).getSimpleCoords()).toEqual([50, 150]);
								expect(level.getSegmentShape(['001', 3]).getSimpleCoords()).toEqual([150, 150]);
								expect(level.getSegmentShape(['002', 0]).getSimpleCoords()).toEqual([250, 150]);
								expect(level.getSegmentShape(['002', 1]).getSimpleCoords()).toEqual([350, 150]);
								expect(level.getSegmentShape(['002', 2]).getSimpleCoords()).toEqual([250, 250]);
								expect(level.getSegmentShape(['002', 3]).getSimpleCoords()).toEqual([350, 250]);
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should work, when parsed an array
					});// desc the getSegmentShape function
					
					describe('the getDistance function', function () {
						it('it should return the distance between any two neighbouring points', function () {
							var ran = false, world;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('level.component.getDistance.1');
							
							event.bind('level.component.getDistance.1', function () {
								var level = world.getComponent('level');
								
								expect(level.getDistance(['001', 0], ['001', 1])).toEqual(100);
								expect(level.getDistance(['001', 0], ['001', 2])).toEqual(100);
								expect(level.getDistance(['001', 0], ['001', 3])).toEqual(false);
								
								expect(level.getDistance(['001', 1], ['001', 0])).toEqual(100);
								expect(level.getDistance(['001', 1], ['001', 2])).toEqual(false);
								expect(level.getDistance(['001', 1], ['001', 3])).toEqual(100);
								
								expect(level.getDistance(['001', 2], ['001', 0])).toEqual(100);
								expect(level.getDistance(['001', 2], ['001', 1])).toEqual(false);
								expect(level.getDistance(['001', 2], ['001', 3])).toEqual(100);
								
								expect(level.getDistance(['001', 3], ['001', 0])).toEqual(false);
								expect(level.getDistance(['001', 3], ['001', 1])).toEqual(100);
								expect(level.getDistance(['001', 3], ['001', 2])).toEqual(100);
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should return the distance between any two neighbouring points
						
						it('it should return false if the inputs are invalid', function () {
							var ran = false, world;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('level.component.getDistance.2');
							
							event.bind('level.component.getDistance.2', function () {
								var level = world.getComponent('level');
								
								expect(level.getDistance(123, 456)).toBeFalsy();
								expect(level.getDistance(['001', 0], ['001'])).toBeFalsy();
								expect(level.getDistance(['001', 0], {0: '001', 1: 1})).toBeFalsy();
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should return false if the inputs are invalid
						
						it('it should return a valid path when the two points are on different LevelSegments', function () {
							var ran = false, world;
							
							world = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('level.component.getDistance.3');
							
							event.bind('level.component.getDistance.3', function () {
								var level = world.getComponent('level');
								
								expect(level.getDistance(['001', 3], ['002', 0])).toEqual(100);
								expect(level.getDistance(['002', 0], ['001', 3])).toEqual(100);
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should return a valid path when the two points are on different LevelSegments
					});// the getDistance function
				});// desc has the following function,
			});// desc once composed
		});// desc The Level.Component Object
	}
);