/*global define*/
define(
	[
		'thorny!level>main',
		'compose',
		'cjs!underscore'
	], 
	function (
		Level,
		compose,
		underscore
	) {
		return function (route) {
			/**
			 * Used to return the route as a list of refernces
			 * @param void
			 * @return Array Containing the references
			 */
			route.asReferences = function () {
				var refs = [];
				
				underscore.each(this, function (value, key) {
					refs.push(
						value
						);
				});
				
				return refs;
			};
			
			/**
			 * Used to convert an array of ['segment_name', shape_id] into a
			 * shape that extends from Vector2.
			 * @param Level level Contains the current level
			 * @return Array Containing shapes from within a LevelSegment that 
			 *         are moved through when nagivating the world.
			 * @throws Error
			 */
			route.asShapes = function (level) {
				// Makesure parsed object attempts to look valid.
				if (! underscore.isObject(level) ||
					! underscore.isFunction(level.getSegmentShape)
				) {
					throw new Error(
						'pathfinder/route.asShape: Expected param to be of type Level.component'
						);
				}
				
				var shapes = [];
				
				underscore.each(this, function (value, key) {
					shapes.push(
						level.getSegmentShape.apply(level, value)
						);
				});
				
				return shapes;
			};
			
			/**
			 * Used to convert an array of ['segment_name', shape_id] into a
			 * shape that extends from Vector2.
			 * @param Level level Contains the current level
			 * @return Array Containing shapes from within a LevelSegment that 
			 *         are moved through when nagivating the world.
			 * @throws Error
			 */
			route.asSimpleCoords = function (level) {
				// Makesure parsed object attempts to look valid.
				if (! underscore.isObject(level) ||
					! underscore.isFunction(level.getSegmentShape)
				) {
					throw new Error(
						'pathfinder/route.asSimpleCoords: Expected param to be of type Level.component'
						);
				}
				
				var shapes = [];
				
				underscore.each(this, function (value, key) {
					shapes.push(
						level.getSegmentShape.apply(level, value)
							.getSimpleCoords()
						);
				});
				
				return shapes;
			};
			
			return route;
		};
	}
);