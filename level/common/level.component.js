/*global define*/
define(
	[
		'require',
		'compose',
		'thorny!entity-system>main',
		'cjs!underscore'
	], 
	function (
		require,
		Compose,
		Entity,
		underscore
	) {
		var levels = {};
		
		/**
		 * Used to expose the level system to the entity system
		 * @param constructor Level Used to create new level segments
		 * @return void
		 */
		return function (Level) {
			Entity.registerComponent('level', function (entity) {
				return {
					isUnique: true,
					
					/**
					 * Contains the level
					 * @var Level
					 */
					getLevel: function () {
						return levels[entity.getId()];
					},
					
					/**
					 * Used to add a segment to the level
					 * @param LevelSegment segment Contains a level segment
					 * @param function callback Contains a callback which is 
					 *        executed once the LevelSegment has been added.
					 * @return this, to allow object chaining
					 */
					addSegment: function (segment, callback) {
						levels[entity.getId()].addSegment(segment, callback);
						return this;
					},

					/**
					 * Used to remove a specific LevelSegment
					 * @param void
					 * @return this, to allow object chaining
					 */
					removeSegment: function (name) {
						return levels[entity.getId()].removeSegment(name); 
					},

					/**
					 * Used to fetch a LevelSegment from the level.
					 * @param string name Contains the name of a LevelSegment
					 * @return LevelSegment|false Contains the required 
					 *         LevelSegment or false
					 */
					getSegment: function (name) {
						return levels[entity.getId()].getSegment(name); 
					},
					
					/**
					 * Used to find a shape within the loaded LevelSegments
					 * @param integer x Contains the x coordinate of the search
					 * @param integer y Contains the y coordinate of the search
					 * @return array|false If point is within the Level it returns
					 *         an array containing the [segmentName, shapeId];
					 */
					search: function (x, y) {
						return levels[entity.getId()].search(x, y);
					},
					
					/**
					 * Used to crate a level entity.
					 * @return true
					 */
					attach: function (options) {
						levels[entity.getId()] = new Level(options);
						
						return true;
					},
					
					/**
					 * Used to remove a level component
					 * @param void
					 * @return void
					 */
					remove: function () {
						delete levels[entity.getId()];
					}
				};
			});
		};
	}
);