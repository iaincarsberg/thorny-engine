/*global define window describe it expect runs waitsFor*/
define(
	[
		'thorny!level>main',
		'thorny!level>level-segment',
		'thorny!level>networker/file',
		'thorny!math/Poly2',
		'thorny!math/Vector2',
		'cjs!underscore'
	],
	function (
		Level,
		LevelSegment,
		fileNetworker,
		Poly2,
		Vector2,
		underscore
	) {	
		describe("The Level modules file networking function", function () {
			it('it should network two simple Poly2 square LevelSegments together', function () {
				var level, segment, ran = false, baseSegment, newSegment;

				level = new Level();
				level.addSegment(new LevelSegment(
					Poly2,
					{
						name: 'base segment',
						data: [
							[
								{"x": 0, "y": 0},
								{"x": 100, "y": 0},
								{"x": 100, "y": 100},
								{"x": 0, "y": 100}
							]
						]
					}
				));
				
				segment = new LevelSegment(
					Poly2,
					{
						name: 'new segment',
						data: [
							[
								{"x": 0, "y": 0},
								{"x": 100, "y": 0},
								{"x": 100, "y": 100},
								{"x": 0, "y": 100}
							]
						],
						x: 100,
						y: 0,
						network: [
							{
								target: 'base segment',
								targetShapeId: 0,
								targetVector2Id1: 1,
								targetVector2Id2: 2,
								localShapeId: 0,
								localVector2Id1: 0,
								localVector2Id2: 3
							}
						]
					}
				);
				
				// Exeucte the file based networker
				fileNetworker(
					level, 
					segment,
					function () {
						ran = true;
					});
				
				expect(ran).toBeTruthy();
				
				// Check the "base segment" entry
				baseSegment = level.data('network')['base segment']['new segment'];
				expect(underscore.isObject(baseSegment)).toBeTruthy();
				expect(typeof baseSegment.distance).toEqual('number');
				expect(baseSegment.localShape instanceof Poly2).toBeTruthy();
				expect(baseSegment.targetShape instanceof Poly2).toBeTruthy();
				
				expect(baseSegment.distance).toEqual(100);
				expect(baseSegment.localShape.getSimpleCoords()).toEqual([50, 50]);
				expect(baseSegment.targetShape.getSimpleCoords()).toEqual([150, 50]);
				
				// Check the "new segment" entry
				newSegment = level.data('network')['new segment']['base segment'];
				
				expect(underscore.isObject(newSegment)).toBeTruthy();
				expect(typeof newSegment.distance).toEqual('number');
				expect(newSegment.localShape instanceof Poly2).toBeTruthy();
				expect(newSegment.targetShape instanceof Poly2).toBeTruthy();
				
				expect(newSegment.distance).toEqual(100);
				expect(newSegment.localShape.getSimpleCoords()).toEqual([150, 50]);
				expect(newSegment.targetShape.getSimpleCoords()).toEqual([50, 50]);
				
				describe('during which it should mark edges as being non-edges', function () {
					it('it should have marked the following as such', function () {
						var baseSegmentEdges = level.getSegment('base segment');
						
						expect(baseSegmentEdges.isEdge(0, 0)).toBeTruthy();
						expect(baseSegmentEdges.isEdge(0, 1)).toBeFalsy();
						expect(baseSegmentEdges.isEdge(0, 2)).toBeTruthy();
						expect(baseSegmentEdges.isEdge(0, 3)).toBeTruthy();
						
						expect(segment.isEdge(0, 0)).toBeTruthy();
						expect(segment.isEdge(0, 1)).toBeTruthy();
						expect(segment.isEdge(0, 2)).toBeTruthy();
						expect(segment.isEdge(0, 3)).toBeFalsy();
					});// it should have marked the following as such
				});// during which it should mark edges as being non-edges
			});// it should network two simple Poly2 square LevelSegments together
		});// desc The Level modules file networking function
	}
);