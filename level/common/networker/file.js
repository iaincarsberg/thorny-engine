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
		return function (level, localSegment, callback) {
			require(['thorny!level>main'], function (Level) {
				var network, targetSegment;
				
				// Makesure the level object is of type Level
				if (! (level instanceof Level)) {
					throw new Error(
						'Level/Networker/file() only accepts levels of type Level.'
						);
				}
				
				// Makesure the segment object is of type LevelSegment
				if (! (localSegment instanceof LevelSegment)) {
					throw new Error(
						'Level/Networker/file() only accepts segments of type LevelSegment.'
						);
				}

				underscore.each(
					localSegment.getNetworkedNeighbours(), 
					function (connection) {
						var distance, target, local;
						
						// Makesure the connection is valid.
						if (connection.target           === undefined ||
							connection.targetShapeId    === undefined ||
							connection.targetVector2Id1 === undefined ||
							connection.targetVector2Id2 === undefined ||
							connection.localShapeId     === undefined ||
							connection.localVector2Id1  === undefined ||
							connection.localVector2Id2  === undefined ||
							connection.target           === false ||
							connection.targetShapeId    === false ||
							connection.targetVector2Id1 === false ||
							connection.targetVector2Id2 === false ||
							connection.localShapeId     === false ||
							connection.localVector2Id1  === false ||
							connection.localVector2Id2  === false
						) {
							return;
						}
						
						// Fetch the target LevelSegment
						targetSegment = level.getSegment(connection.target);
						
						// If the targetSegment isn't a valid LevelSegment 
						// then stop this execution.
						if (! (targetSegment instanceof LevelSegment)) {
							return;
						}
						
						// Localise the polys that are being networked.
						target = targetSegment.getShapeById(connection.targetShapeId);
						local  = localSegment.getShapeById(connection.localShapeId);
						
						// Makesure both from and to exist
						if (! target instanceof Thorny ||
							! local instanceof Thorny
						) {
							return;
						}
						
						// Makesure the hash is ready for use.
						if (level.data('network')[targetSegment.getName()] === undefined) {
							level.data('network')[targetSegment.getName()] = {};
						}
						if (level.data('network')[localSegment.getName()] === undefined) {
							level.data('network')[localSegment.getName()] = {};
						}
						
						// Add the network entry.
						distance = target.distance(local);
						
						level.data('network')[targetSegment.getName()][localSegment.getName()] = {
							distance:    distance,
							localShape:  target,
							targetShape: local
						};
						level.data('network')[localSegment.getName()][targetSegment.getName()] = {
							distance:    distance,
							localShape:  local,
							targetShape: target
						};
						
						// Flag the edges as clear on the newly attached 
						// LevelSegments.
						targetSegment.flagEdge(
							connection.targetShapeId, 
							LevelSegment.edgePicker(
								connection.targetVector2Id1,
								connection.targetVector2Id2
								),
							false
							);
						
						localSegment.flagEdge(
							connection.localShapeId, 
							LevelSegment.edgePicker(
								connection.localVector2Id1,
								connection.localVector2Id2
								),
							false
							);
					}
				);

				// Execute the callback.
				if (underscore.isFunction(callback)) {
					callback();
				}
			});
		};
	}
);