/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!level>main',
		'thorny!level>level-segment',
		'thorny!math/poly2',
		'cjs!underscore'
	],
	function (
		Thorny,
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
					expect(typeof level.getSegmentFormat).toEqual('function');
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
				});// desc has the following function,
			});// desc once instantiated
		});// desc The Level Base Object
	}
);