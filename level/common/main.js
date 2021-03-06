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
		
		// Networkers
		'thorny!level>networker/file',
		'thorny!level>networker/adjacent',
		
		// Models
		'thorny!level>level.model',
		
		// Components - Note if you add more components don't forget to update
		//              the loadedComponents variable below.
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
		var Level, defaultOptions, numberOfAddons, loadedComponents = 3;
		
		/**
		 * Used to allow a user to customise level options.
		 * @param object Containing user defined options
		 * @return object Containing options
		 */
		defaultOptions = function (systemOptions, options) {
			underscore.extend(systemOptions, {
				// Contains the path to the default processor used to populate 
				// a LevelSegment.
				format:  'thorny!math/poly2',
				
				// Contains the path to the default LevelSegment networker.
				network: 'thorny!level>networker/file'
			}, options);
		};
		
		Level = Thorny.extend(
			function (options) {
				defaultOptions(this.options, options);
				
				// Set the segments store.
				this.data('segments', {});
				
				// Set the segment network hash.
				this.data('network', {});
			},
			{
				// Contains the options for the level
				options: {},
				
				/**
				 * Used to add a segment to the level
				 * @param LevelSegment segment Contains a level segment
				 * @param function callback Contains a callback which is 
				 *        executed once the LevelSegment has been added.
				 * @return this, to allow object chaining
				 */
				addSegment: function (segment, callback) {
					// Localise the level, so we can parse it into the 
					// networker function.
					var level = this;
					
					if (! (segment instanceof LevelSegment)) {
						throw new Error('Level.addSegment only accepts objects of type LevelSegment.');
					}
					
					// Store the segment in the level.
					this.data('segments')[segment.getName()] = segment;
					
					// Fetch the networker and execute it.
					require(
						[this.options.network], 
						function (networker) {
							networker(level, segment, callback);
						}
					);
					
					return this;
				},
				
				/**
				 * Used to remove a specific LevelSegment
				 * @param void
				 * @return this, to allow object chaining
				 */
				removeSegment: function (name) {
					var level, segment;
					
					level = this;
					segment = level.getSegment(name);
					
					// Makesure the segment is valid
					if (! (segment instanceof LevelSegment)) {
						return;
					}
					
					// Close the edges of the level, this is to prevent any 
					// entity falling through the gaps of an open edge that
					// goes into unknow space.
					underscore.each(segment.getNetworkedNeighbours(), function (connection) {
						var targetSegment = level.getSegment(connection.target);
						
						// Flag the edges as clear on the newly attached 
						// LevelSegments.
						targetSegment.setEdge(
							connection.targetShapeId, 
							LevelSegment.edgePicker(
								connection.targetVector2Id1,
								connection.targetVector2Id2
								),
							false
							);
					});
					
					// Clearout the network data
					//   First remove all remote links
					underscore.each(level.data('network')[name], function (value, key) {
						delete level.data('network')[key][name];
					});
					//   Then remove the local link.
					delete level.data('network')[name];
					
					// Clear the segment out from the level
					delete level.data('segments')[name];
				},
				
				/**
				 * Used to fetch a LevelSegment from the level.
				 * @param string name Contains the name of a LevelSegment
				 * @return LevelSegment|false Contains the required 
				 *         LevelSegment or false
				 */
				getSegment: function (name) {
					var 
						segments = this.data('segments'),
						segment = (segments ? segments : {})[name];
					return segment ? segment : false;
				},
				
				/**
				 * Used to get the format accepted by this level.
				 * @param void
				 * @return string Containing this levels format
				 */
				getSegmentFormat: function () {
					return this.options.format;
				},
				
				/**
				 * Used to expose the level format.
				 * @param function callback Used to continue execution of 
				 * whatever requires the level format.
				 * @return object Containing the format object
				 */
				getSegmentFormatObject: function (callback) {
					var level = this;
					
					// If the format has been loaded then return it.
					if (level.data('format')) {
						return callback(level.data('format'));
					}
					
					// Require the segment format, and localise it into the 
					// format data slot, for quick access later on.
					require(
						[level.getSegmentFormat()], 
						function (format) {
							level.data('format', format);
							return callback(level.data('format'));
						}
					);
				},
				
				/**
				 * Used to find a shape within the loaded LevelSegments
				 * @param integer x Contains the x coordinate of the search
				 * @param integer y Contains the y coordinate of the search
				 * @return array|false If point is within the Level it returns
				 *         an array containing the [segmentName, shapeId];
				 */
				search: function (x, y) {
					var found_segment_id = false;
					
					underscore.each(this.data('segments'), function (segment, segment_id) {
						// Prevent any more calls to segment.search than 
						// are needed.
						if (found_segment_id !== false) {
							return;
						}
						
						// Check to see if the point is within this segment.
						var found_shape_id = segment.search(x, y);
						
						// If a shape_id was found then we need to update the 
						// found_segment_id value.
						if (found_shape_id !== false) {
							found_segment_id = [
								segment_id,
								found_shape_id
							];
						}
					});
					
					return found_segment_id;
				}
			}
		);
		
		// Mixin the Components.
		// Find the number of addons
		numberOfAddons = arguments.length - loadedComponents;
		
		// Send all of the addons a copy of the Level system
		underscore.each(arguments, function (addon, key) {
			if (key < numberOfAddons) {
				return;
			}
			addon(Level);
		});
		
		return Level;
	}
);