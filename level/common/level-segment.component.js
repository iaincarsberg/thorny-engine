/*global define*/
define(
	[
		'require',
		'compose',
		'cjs!underscore',
		'thorny!entity-system>main',
		'thorny!level>level-segment'
	], 
	function (
		require,
		Compose,
		underscore,
		Entity,
		LevelSegment
	) {
		/**
		 * Used to expose the level-segment to the entity system
		 * @param constructor Level Used to create new level segments
		 * @return void
		 */
		return function (Level) {
			Entity.registerComponent('level-segment', function (entity) {
				return {
					isUnique: false,
					
					/**
					 * Used to attach a new level-segment to a level entity.
					 * @param string path Contains a path to a json map file
					 * @param object options Contains user customised options
					 * @return true
					 */
					attach: function (path, options) {
						// The level component is required.
						if (! entity.hasComponent('level')) {
							return false;
						}
						
						// Launch the async operation
						return function () {
							var callback = this;
							
							// Execute the async file load.
							require(['text!' + path], function (data) {
								data = JSON.parse(data);
								
								entity.getComponent('level')[0].getLevel()
									.addSegment(
										new LevelSegment(data, options)
										);
								
								callback();
							});
						};
					}
				};
			});
		};
	}
);