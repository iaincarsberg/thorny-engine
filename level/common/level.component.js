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
					 * Used to crate a level entity.
					 * @return true
					 */
					attach: function (options) {
						levels[entity.getId()] = new Level(options);
						
						return true;
					},
					
					/**
					 * Used to delete a level component
					 * @param void
					 * @return void
					 */
					delete: function () {
						delete levels[entity.getId()];
					}
				};
			});
		};
	}
);