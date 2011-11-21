/*global define*/
define(
	[
		'thorny!entity-system>main',
		'thorny!pathfinder>astar/main',
		'cjs!underscore'
	], 
	function (
		Entity,
		AStar,
		underscore
	) {
		var level = false;
		
		/**
		 * Used to expose the level system to the entity system
		 * @param constructor Level Used to create new level segments
		 * @return void
		 */
		return function (Level) {
			Entity.registerComponent('pathfinder/astar', function (entity) {
				return {
					isUnique: true,
					
					/**
					 * Used to find a route though a level
					 * @var object from Contains the origin
					 * @var object to Contains the destination
					 * @return Array Containing a list of references to 
					 *         LevelSegments that lead to the goal.
					 */
					route: function (from, to) {
						return AStar.route(level, from, to);
					},
					
					/**
					 * Used to bind a level to the astar search algorithum
					 * @param Level _level Contains the level we will be 
					 *        searching for routes in.
					 * @return true
					 */
					attach: function (_level) {
						level = _level;
						
						return true;
					},
					
					/**
					 * Used to remove the level from the astar search 
					 * algorithum.
					 * @param void
					 * @return void
					 */
					remove: function () {
						level = undefined;
					}
				};
			});
		};
	}
);