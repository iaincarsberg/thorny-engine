/*global define*/
// Usage:
// new Entity()
//     .addComponent('level')
//     .addComponent('level-segment', 'something.json')
//     .addComponent('level-segment', 'something-else.json')
//     .triggers(function (entity) {
//         renderer.draw(entity);
//     });
define(
	[
		'require',
		'thorny',
		'thorny!observer/observer',
		'thorny!observer/observable',
		'cjs!underscore',
		'thorny!level>level-segment',
		
		// Addons
		// 'thorny!level>tag',
		
		// Components
		'thorny!level>level.component',
		'thorny!level>level-segment.component'
	], 
	function (
		require,
		Thorny,
		observer,
		observable,
		underscore,
		LevelSegment
	) {
		var Level, defaultOptions;
		
		/**
		 * Used to allow a user to customise level options.
		 * @param object Containing user defined options
		 * @return object Containing options
		 */
		defaultOptions = function (systemOptions, options) {
			underscore.extend(systemOptions, {
				format: 'poly2'
			}, options);
		};
		
		Level = Thorny.extend(
			function (options) {
				defaultOptions(this.options, options);
			},
			{
				// Contains the options for the level
				options: {},
				
				/**
				 * Used to add a segment to the level
				 * @param LevelSegment segment Contains a level segment
				 * @return this, to allow object chaining
				 */
				addSegment: function (segment) {
					if (! (segment instanceof LevelSegment)) {
						throw new Error('Level.addSegment only accepts objects of type LevelSegment.');
					}
					
					return this;
				}
			}
		);
		
		// Send all of the addons a copy of the Level system
		underscore.each(arguments, function (addon, key) {
			if (key < 6) {
				return;
			}
			addon(Level);
		});
		
		return Level;
	}
);