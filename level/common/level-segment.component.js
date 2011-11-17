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
						var level;
						
						// The level component is required.
						if (! entity.hasComponent('level')) {
							return false;
						}
						
						// Localise the level component.
						level = entity.getComponent('level')[0].getLevel();
						
						// Launch the async operation
						return function () {
							// Localise the callback to complete the belated 
							// flow-js request
							var callback = this;
							
							// Execute the async file load.
							require(['text!' + path, level.getSegmentFormat()], function (data, Format) {
								data = JSON.parse(data);
								
								// Create a new LevelSegment, and execute the
								// belated flow-js request.
								level
									.addSegment(
										new LevelSegment(Format, data, options),
										callback
									);
							});
						};
					}
				};
			});
		};
	}
);