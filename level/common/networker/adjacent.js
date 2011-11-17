/*global define*/
define(
	[
		'thorny',
		'thorny!level>level-segment',
		'cjs!underscore'
	], 
	function (
		Thorny,
		LevelSegment,
		underscore
	) {
		/**
		 * Used to network two LevelSegments together using network rules 
		 * found within the level json payload.
		 * @param Level level Contains the currently loaded level.
		 * @param LevelSegment segment Contains a level segment that is being
		 *        inserted into the Level.
		 * @param function callback Called once the LevelSegment has been 
		 *        networked with other LevelSegments.
		 * @return void.
		 */
		return function (level, segment, callback) {
			require(['thorny!level>main'], function (Level) {
				var network;
				
				// Makesure the level object is of type Level
				if (! (level instanceof Level)) {
					throw new Error(
						'Level/Networker/file() only accepts levels of type Level.'
						);
				}
				
				// Makesure the segment object is of type LevelSegment
				if (! (segment instanceof LevelSegment)) {
					throw new Error(
						'Level/Networker/file() only accepts segments of type LevelSegment.'
						);
				}
				
				// Execute the callback.
				callback();
			});
		};
	}
);