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
		describe('The Level Base Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					expect(typeof Level).toEqual('function');
				});// it should have the following functions
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should have the following functions', function () {
					var level = new Level();
					
					// Structure
					expect(typeof level).toEqual('object');
					expect(level instanceof Level).toBeTruthy();
					expect(typeof level.data).toEqual('function');
					
					// Functions
					expect(typeof level.addSegment).toEqual('function');
					expect(typeof level.getSegment).toEqual('function');
					expect(typeof level.removeSegment).toEqual('function');
					expect(typeof level.getSegmentFormat).toEqual('function');
					expect(typeof level.search).toEqual('function');
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('the addSegment function', function () {
						it('it should only accepts objects of type LevelSegment', function () {
							var level = new Level();

							try {
								level.addSegment({
									some: 'object',
									that: "isn't",
									of: 'type',
									level: 'segment'
								});
								expect(false).toBeTruthy();
								
							} catch (e) {
								expect(true).toBeTruthy();
								expect(e.message).toEqual('Level.addSegment only accepts objects of type LevelSegment.');
							}
						});// it should only accepts objects of type LevelSegment
						
						it('it should accept a LevelSegment', function () {
							var level, segment;
							
							level = new Level();
							segment = new LevelSegment(
								Poly2,
								{
									name: 'some-cool-level-segment'
								}
							);
							
							level.addSegment(
								segment
							);
							
							expect(underscore.isObject(level.data('segments'))).toBeTruthy();
							expect(level.data('segments')['some-cool-level-segment'] instanceof LevelSegment).toBeTruthy();
						});// it should accept a LevelSegment
						
						it('it should accept multiple LevelSegments', function () {
							var level, segmentOne, segmentTwo, segmentThree;
							
							level = new Level();
							segmentOne = new LevelSegment(
								Poly2,
								{
									name: 'the first cool level segment'
								}
							);
							
							segmentTwo = new LevelSegment(
								Poly2,
								{
									name: 'the second cool level segment'
								}
							);
							
							segmentThree = new LevelSegment(
								Poly2,
								{
									name: 'the third cool level segment'
								}
							);
						
							level.addSegment(
								segmentOne
							);
							
							level.addSegment(
								segmentTwo
							);
							
							level.addSegment(
								segmentThree
							);
							
							expect(underscore.isObject(level.data('segments'))).toBeTruthy();
							expect(level.data('segments')['the first cool level segment'] instanceof LevelSegment).toBeTruthy();
							expect(level.data('segments')['the second cool level segment'] instanceof LevelSegment).toBeTruthy();
							expect(level.data('segments')['the third cool level segment'] instanceof LevelSegment).toBeTruthy();
						});// iit should accept multiple LevelSegments
					});// desc the addSegment function
					
					describe('the getSegment function', function () {
						it('it should return a reuqested LevelSegment', function () {
							var level, levelSegment;
							
							level = new Level();
							levelSegment = new LevelSegment(Poly2, {name: 'some segment'});
							
							level.addSegment(levelSegment);
							
							expect(level.getSegment('some segment')).toEqual(levelSegment);
						});// it should return a reuqested LevelSegment
						
						it('it should return false if attempting to access an unknow level segment', function () {
							var level = new Level();
							
							expect(level.getSegment('some unknown segment')).toBeFalsy();
						});// it should return false if attempting to access an unknow level segment
					});// desc the getSegment function
					
					describe('the removeSegment function', function () {
						it('it should remove the LevelSegment from the level', function () {
							var ran = false;
							
							new Entity()
								.addComponent(
									'level'
									)
								.addComponent(
									'level-segment', 
									'tests/fixtures/levels/poly2/003.json'
									)
								.addComponent(
									'level-segment', 
									'tests/fixtures/levels/poly2/004.json'
									)
								.triggers('level:removeSegment:1');

							event.bind('level:removeSegment:1', function (entity, data) {
								expect(entity instanceof Entity).toBeTruthy();
								expect(entity.listComponents()).toContain('flow-js-handle');
								
								var level, segment;
								
								level = entity
									.getComponent('level')
									.getLevel();
								
								// Remove the 002 level segment
								level.removeSegment('004');
								
								// Makesure its been removed
								expect(level.getSegment('004')).toBeFalsy();
								
								segment = level.getSegment('003');
								
								// Makesure the edge is replaced
								expect(segment.isEdge(0, 0)).toBeTruthy();
								expect(segment.isEdge(0, 1)).toBeTruthy();
								expect(segment.isEdge(0, 2)).toBeTruthy();
								expect(segment.isEdge(0, 3)).toBeTruthy();
								
								// Makesure the level has un-networked the
								// recently deleted LevelSegment.
								expect(level.data('network')['004']).toEqual(undefined);
								expect(level.data('network')['003']['004']).toEqual(undefined);
								
								ran = true;
							});

							waitsFor(function () {
								return ran;
							});
						});// it should remove the LevelSegment from the level
					});// desc the removeSegment function
					
					describe('the getSegmentFormat function', function () {
						it('it should return the default path that points to a Poly2', function () {
							var level = new Level();
							
							expect(level.getSegmentFormat()).toEqual('thorny!math/poly2');
						});// it should return the default path that points to a Poly2
						
						it('it should allow the segment format to be replaced on level instantiation', function () {
							var level = new Level({
								format: 'thorny!math/vector2'
							});
							
							expect(level.getSegmentFormat()).toEqual('thorny!math/vector2');
						});// it should allow the segment format to be replaced on level instantiation
					});// desc the getSegmentFormat function
					
					describe('the search function', function () {
						it('it should search the Level Entity for a specific shape within its LevelSegment', function () {
							var level, ran = false;
							
							level = Model.select('level')
								.factory(
									['level-segment', 'tests/fixtures/levels/poly2/001.json'],
									['level-segment', 'tests/fixtures/levels/poly2/002.json']
									)
								.triggers('the search function - loaded');
							
							event.bind('the search function - loaded', function () {
								/*
								Note:
								001 and 002 are offset, so they look like
								
								----
								|  |
								|  |----
								----|  |
								    |  |
								    ----
								*/
								
								expect(level.getComponent('level').search(10, 10)).toEqual(['001', 0]);
								expect(level.getComponent('level').search(90, 10)).toEqual(['001', 0]);
								expect(level.getComponent('level').search(10, 90)).toEqual(['001', 0]);
								expect(level.getComponent('level').search(90, 90)).toEqual(['001', 0]);
								expect(level.getComponent('level').search(110, 10)).toEqual(['001', 1]);
								expect(level.getComponent('level').search(190, 10)).toEqual(['001', 1]);
								expect(level.getComponent('level').search(110, 90)).toEqual(['001', 1]);
								expect(level.getComponent('level').search(190, 90)).toEqual(['001', 1]);
								expect(level.getComponent('level').search(10, 110)).toEqual(['001', 2]);
								expect(level.getComponent('level').search(90, 110)).toEqual(['001', 2]);
								expect(level.getComponent('level').search(10, 190)).toEqual(['001', 2]);
								expect(level.getComponent('level').search(90, 190)).toEqual(['001', 2]);
								expect(level.getComponent('level').search(110, 110)).toEqual(['001', 3]);
								expect(level.getComponent('level').search(190, 110)).toEqual(['001', 3]);
								expect(level.getComponent('level').search(110, 190)).toEqual(['001', 3]);
								expect(level.getComponent('level').search(190, 190)).toEqual(['001', 3]);
								
								expect(level.getComponent('level').search(210, 10)).toBeFalsy();
								expect(level.getComponent('level').search(290, 10)).toBeFalsy();
								expect(level.getComponent('level').search(210, 90)).toBeFalsy();
								expect(level.getComponent('level').search(290, 90)).toBeFalsy();
								expect(level.getComponent('level').search(310, 10)).toBeFalsy();
								expect(level.getComponent('level').search(390, 10)).toBeFalsy();
								expect(level.getComponent('level').search(310, 90)).toBeFalsy();
								expect(level.getComponent('level').search(390, 90)).toBeFalsy();
								expect(level.getComponent('level').search(210, 110)).toEqual(['002', 0]);
								expect(level.getComponent('level').search(290, 110)).toEqual(['002', 0]);
								expect(level.getComponent('level').search(210, 190)).toEqual(['002', 0]);
								expect(level.getComponent('level').search(290, 190)).toEqual(['002', 0]);
								expect(level.getComponent('level').search(310, 110)).toEqual(['002', 1]);
								expect(level.getComponent('level').search(390, 110)).toEqual(['002', 1]);
								expect(level.getComponent('level').search(310, 190)).toEqual(['002', 1]);
								expect(level.getComponent('level').search(390, 190)).toEqual(['002', 1]);
								
								ran = true;
							});
							
							waitsFor(function () {
								return ran;
							});
						});// it should search the Level Entity for a specific shape within its LevelSegment
					});// desc the search function
				});// desc has the following function,
			});// desc once instantiated
		});// desc The Level Base Object
	}
);