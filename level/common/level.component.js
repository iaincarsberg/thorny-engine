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
					 * Used to access a shape within a LevelSegment
					 * This is a lazy lazy function, but it means less tying,
					 * so, win :)
					 * @param string name Contains the name of a LevelSegment
					 * @param int shape_id Contains the id of a shape within 
					 * a LevelSegment.
					 * @return Child of Vector2
					 */
					getSegmentShape: function (name, shape_id) {
						if (shape_id === undefined &&
							underscore.isArray(name) &&
							name.length === 2
						) {	
							shape_id = name[1];
							name = name[0];
						}
						
						var segment = this.getSegment(name);
						return segment ? segment.getShapeById(shape_id) : false;
					},
					
					/**
					 * Used to fetch the precalcuated distance between two 
					 * points in the Level.
					 * @param array from Contains the origin
					 * @param array to Contains the destination
					 * @return float Containing the distance between two shapes
					 */
					getDistance: function (from, to) {
						var segment, fromNetwork;
						
						if (! underscore.isArray(from) ||
							from.length !== 2 ||
							! underscore.isArray(to) ||
							to.length !== 2
						) {
							return false;
						}
						
						// Check to see if the two shapes are in the same 
						// LevelSegment, if they are then...
						if (from[0] === to[0]) {
							// Check the network
							segment = levels[entity.getId()].getSegment(from[0]);
							
							if (! segment) {
								return false;
							}
							
							fromNetwork = segment.data('network')[from[1]];
							
							if (! fromNetwork) {
								return false;
							}
							
							return fromNetwork[to[1]] ? fromNetwork[to[1]] : false;
							
						} else {
							fromNetwork = this.getLevel().data('network')[from[0]];
							
							if (! fromNetwork) {
								return false;
							}
							
							return fromNetwork[to[0]] ? fromNetwork[to[0]].distance :  false;
						}
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
					 * This functions works in two ways, 
					 * firstly, 
					 *     If no shape_id is specified then it will 
					 *     return a list containing all neighbouring 
					 *     LevelSegments that belong to the specified 
					 *     LevelSegment
					 * secondly, 
					 *     If a shape_id is set, it will return a list of all
					 *     networks that point has, including ones to remove 
					 *     LevelSegments within this Level.
					 * @param string name Contains the name of a LevelSegment
					 * @param optional int shape_id Contains the id of a shape 
					 *        within the LevelSegment
					 * @return Array of references to LevelSegments and shapes
					 */
					getNeighbours: function (name, shape_id) {
						var segment, neighbours = [];
						
						segment = levels[entity.getId()].getSegment(name);
						
						// If the segment doesn't exist then return false;
						if (! segment) {
							return false;
						}
						
						// If no shape_id was specified then return all 
						// networks between the specified LevelSegment.
						if (shape_id === undefined) {
							underscore.each(levels[entity.getId()].data('network')[name], function (link, neighbour_name) {
								neighbours.push(
									neighbour_name
								);
							});
						} else {
							// Add networks from this shape_id to other LevelSegments.
							underscore.each(levels[entity.getId()].data('network')[name], function (link, neighbour_name) {
								if (link.localShape !== shape_id) {
									return;
								}
								
								neighbours.push([
									neighbour_name,
									parseInt(link.targetShape, 10)
								]);
							});
							
							// Add internal networks.
							underscore.each(segment.data('network')[shape_id], function (distance, neighbour_id) {
								neighbours.push([
									name,
									parseInt(neighbour_id, 10)
								]);
							});
						}
						
						return neighbours;
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