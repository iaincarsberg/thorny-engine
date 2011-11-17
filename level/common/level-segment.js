/*global define*/
define(
	[
		'thorny',
		'thorny!math/vector2',
		'cjs!underscore'
	], 
	function (
		Thorny,
		Vector2,
		underscore
	) {
		var LevelSegment, defaultData;
		
		/**
		 * Used to makesure the loaded data at least pretends to look like a 
		 * valid level
		 * @param object Containing a level loaded from disk
		 * @param object Contains options to allow a file loaded from disk to
		 *        have variables overridden without having to mutate the 
		 *        loaded data externally.
		 * @return object Containing level data
		 */
		defaultData = function (level, options) {
			return underscore.extend({
				name: false,
				network: false,
				data: [],
				x: false,
				y: false
			}, level, options);
		};
		
		LevelSegment = Thorny.extend(
			/**
			 * Used to make a new LevelSegment.
			 * @param Constructor Format Contains the format for the LevelSegment
			 * @param object data Contains raw level data
			 * @param object options Contains customisation options
			 */
			function (Format, data, options) {
				var x, y, vector2s;
				
				// Merge the data with the default data format.
				data = defaultData(data, options);
				
				// Set the y value
				x = data.x ? data.x : 0;
			
				// Set the y value
				y = data.y ? data.y : 0;
				
				// Store some of the data in the settings object.
				this.data(
					'settings',
					{
						name: data.name ? data.name : LevelSegment.uniqueName(),
						x: x,
						y: y,
						network: LevelSegment.setupNetworkedNeighbours(data.network)
					}
					);
				
				// Build a unique list of all the vector2s within the 
				// LevelSegment that we are currently processing.
				vector2s = LevelSegment.instantiateUniqueVector2s(Format, data.data);
				
				// Find the region in which this LevelSegment exists.
				this.data(
					'region',
					LevelSegment.findRegion(
						vector2s, 
						x, 
						y
						)
					);
				
				// Build the shape, which uses some or all of the Vector2s 
				// within this LevelSegment.
				this.data(
					'shapes',
					LevelSegment.instantiateShapes(
						Format,
						data.data,
						vector2s,
						x,
						y
						)
					);
				
				// Setup each shapes edges, when networks are formed edges 
				// state will need to be toggled.
				this.data(
					'edges',
					LevelSegment.instantiateEdges(
						Format,
						this.data('shapes')
						)
					);
				
				// Build the network hash, which contains a hash of the
				// distances between each of the shapes within this
				// LevelSegment.
				this.data(
					'network',
					LevelSegment.networkShapes(
						this.data('shapes'),
						this
						)
					);
			},
			{
				/**
				 * Used to expose the name of this level segment.
				 * @param void
				 * @return string Containing the name of this level-segment
				 */
				getName: function () {
					return this.data('settings').name;
				},
				
				/**
				 * Used to expose the networked neighbouring LevelSegments.
				 * @param void
				 * @return array Containing a list of LevelSegments this 
				 *         LevelSegment connects to.
				 */
				getNetworkedNeighbours: function () {
					return this.data('settings').network;
				},
				
				/**
				 * Used to get a shape from the LevelSegment via its id.
				 * @param int id Contains the shapes id from within this 
				 *        LevelSegment.
				 * @return object Contains a shape from this LevelSegment
				 */
				getShapeById: function (id) {
					return this.data('shapes')[id];
				},
				
				/**
				 * Used to alter the edge status of a vector in a shape.
				 * @param int shapeId Contains the shape within LevelSegment
				 * @param int pointId Contains the point within the shape
				 * @param boolean state Contains the new state
				 * @return this to allow object chaining
				 */
				flagEdge: function (shapeId, pointId, state) {
					// Default the state to true;
					if (state === undefined) {
						state = true;
					}
					
					if (this.data('edges')[shapeId] !== undefined &&
						this.data('edges')[shapeId][pointId] !== undefined
					) {
						this.data('edges')[shapeId][pointId] = state;
					}
					return this;
				},
				
				/**
				 * Used to see if an vector is an edge.
				 * @param int shapeId Contains the shape within LevelSegment
				 * @param int pointId Contains the point within the shape
				 * @return boolean True if edge, otherwise False
				 */
				isEdge: function (shapeId, pointId) {
					if (this.data('edges')[shapeId] === undefined ||
						this.data('edges')[shapeId][pointId] === undefined
					) {
						return false;
					}
					return this.data('edges')[shapeId][pointId];
				}
			}
		);
		
		/**
		 * Used to filter all unique vector2s and instantiate them.
		 * @param array data Containing the level data
		 * @return object Containing all unique vector2s within this segment 
		 * in a hashmap
		 */
		LevelSegment.instantiateUniqueVector2s = function (Format, data) {
			var hash = {}, v2s = [], key = false;
			
			if (! (data instanceof Array)) {
				throw new Error(
					'LevelSegment.instantiateUniqueVector2s: Expected array.'
					);
			}
			underscore.each(data, function (rawPolyData) {
				if (underscore.isBoolean(Format.acceptSimpleShapes) &&
					Format.acceptSimpleShapes
				) {
					rawPolyData = [rawPolyData];
				}
				
				if (! (rawPolyData instanceof Array)) {
					throw new Error(
						'LevelSegment.instantiateUniqueVector2s: Expected array.'
						);
				}
				
				underscore.each(rawPolyData, function (rawVectorData) {
					if (rawVectorData.x === undefined ||
						rawVectorData.y === undefined
					) {
						throw new Error(
							'LevelSegment.instantiateUniqueVector2s: ' +
							'Expected object of type {x: 0, y: 0}.'
							);
					}
					
					key = rawVectorData.x + ':' + rawVectorData.y;
					if (hash[key] === undefined) {
						hash[key] = new Vector2(
							rawVectorData.x, 
							rawVectorData.y
							);
					}
				});
			});
			
			return hash;
		};
		
		/**
		 * Used to build a list of shapes
		 * @param Constructor Format Contains the format for the LevelSegment
		 * @param array data Containing the level data
		 * @param object v2Hash Contains a hash of all shapes within this 
		 *        level segment
		 * @param int x Contains the x coordinate of the shapes offset
		 * @param int y Contains the y coordinate of the shapes offset
		 * @return array of Shapes that make up this segment
		 */
		LevelSegment.instantiateShapes = function (Format, data, v2Hash, x, y) {
			var shapes = [], v2s, key, offset;
			
			if (! (data instanceof Array)) {
				throw new Error(
					'LevelSegment.instantiateShapes: Expected array.'
					);
			}
			if (! (v2Hash instanceof Object)) {
				throw new Error(
					'LevelSegment.instantiateShapes: Expected hashmap of Vector2s.'
					);
			}
			
			// Makesure x is never undefined
			if (x === undefined) {
				x = 0;
			}
			
			// Makesure y is never undefined
			if (y === undefined) {
				y = 0;
			}
			
			// Set the offset
			offset = new Vector2(x, y);
			
			underscore.each(data, function (rawPolyData) {
				if (underscore.isBoolean(Format.acceptSimpleShapes) &&
					Format.acceptSimpleShapes
				) {
					rawPolyData = [rawPolyData];
				}
				
				if (! (rawPolyData instanceof Array)) {
					throw new Error(
						'LevelSegment.instantiateShapes: Expected array.'
						);
				}
				
				// Get v2s ready for filling with vector2s
				v2s = [];
				
				underscore.each(rawPolyData, function (rawVectorData) {
					if (rawVectorData.x === undefined ||
						rawVectorData.y === undefined
					) {
						throw new Error(
							'LevelSegment.instantiateShapes: Expected object ' + 
							'of type {x: 0, y: 0}.'
							);
					}
					
					key = rawVectorData.x + ':' + rawVectorData.y;
					
					// If the hash doesn't exist something odd is going on
					if (v2Hash[key] === undefined) {
						throw new Error(
							'LevelSegment.instantiateShapes: Unable to find hash.'
							);
					}
					
					// Build a list of Vector2s
					v2s.push(
						v2Hash[key]
							.clone()
						);
				});
				
				// Create a new Shape using the Vector2s, and then offset the
				// Shapes centroid based on the desired offset.
				shapes.push(
					Format
						.apply(null, v2s)
						.add(offset)
					);
			});
			
			return shapes;
		};
		
		/**
		 * Used to find the region in which a LevelSegment exists
		 * @param array vector2s Contains all Vector2s within this LevelSegment
		 * @param int offsetX Contains the x offset
		 * @param int offsetY Contains the y offset
		 * @return object Containing the region of the world this LevelSegment 
		 * exists within.
		 */
		LevelSegment.findRegion = function (vector2s, offsetX, offsetY) {
			// Default the offsets
			if (offsetX === undefined) {
				offsetX = 0;
			}
			if (offsetY === undefined) {
				offsetY = 0;
			}
			
			var minx, miny, maxx, maxy, x, y;
			underscore.each(vector2s, function (vector2) {
				x = vector2.getX();
				y = vector2.getY();
				
				// Find the min values
				minx = minx !== undefined ? Math.min(minx, x) : x;
				miny = miny !== undefined ? Math.min(miny, y) : y;
				
				// Find the max values
				maxx = maxx !== undefined ? Math.max(maxx, x) : x;
				maxy = maxy !== undefined ? Math.max(maxy, y) : y;
			});
			
			return {
				minx: minx + offsetX,
				miny: miny + offsetY,
				maxx: maxx + offsetX,
				maxy: maxy + offsetY
			};
		};
		
		/**
		 * Used to see if a point is within a LevelSegment.
		 * @param LevelSegment levelSegment Contains a level segment we're 
		 *        checking.
		 * @param Vector2 vector2 Contains the Vector2 we're checking to see 
		 *        if its within the bounds of this LevelSegment
		 * @return boolean True if the vector2 is within the level segment
		 */
		LevelSegment.vector2WithinLevelSegment = function (levelSegment, vector2) {
			if (! (levelSegment instanceof LevelSegment)) {
				throw new Error(
					'LevelSegment.vector2WithinLevelSegment: Expected LevelSegment.'
					);
			}
			if (! (vector2 instanceof Vector2)) {
				throw new Error(
					'LevelSegment.vector2WithinLevelSegment: Expected Vector2.'
					);
			}
			
			var 
				data = levelSegment.data('region'), 
				x = vector2.getX(), 
				y = vector2.getY();
			
			return x >= data.minx && x <= data.maxx && y >= data.miny && y <= data.maxy;
		};
		
		/**
		 * Used to network shapes together
		 * @param array shapes Contains all of the shapes within this segment
		 * @param LevelSegment instance Contains the current LevelSegment.
		 * @retrun void
		 */
		LevelSegment.networkShapes = function (shapes, instance) {
			var network = {}, distance;
			
			if (! (instance instanceof LevelSegment)) {
				throw new Error(
					'LevelSegment.networkShapes: Expected instance of type LevelSegment'
					);
			}
			
			underscore.each(shapes, function (a, aId) {
				underscore.each(shapes, function (b, bId) {
					var shared;
					
					// Prevent shapes networking to themselves
					if (a === b || aId > bId) {
						return;
					}
					
					// Makesure a space within the network exists for both
					// points.
					if (network[aId] === undefined) {
						network[aId] = {};
					}
					if (network[bId] === undefined) {
						network[bId] = {};
					}
					
					// If the two points share an edge, we need to network 
					// these two shapes together.
					if ((shared = a.sharesEdge(b))) {
						distance = a.distance(b);
						
						// Setup the network.
						network[aId][bId] = distance;
						network[bId][aId] = distance;
						
						// Alter the flags based on the newly established 
						// network between these two shapes.
						if (underscore.isObject(shared)	 &&
							underscore.isArray(shared.local) &&
							underscore.isArray(shared.remote) &&
							shared.local.length === 2 &&
							shared.remote.length === 2
						) {
							instance.flagEdge(aId, LevelSegment.edgePicker(shared.local[0], shared.local[1]), false);
							instance.flagEdge(bId, LevelSegment.edgePicker(shared.remote[0], shared.remote[1]), false);
						}
					}
				});
			});
			
			return network;
		};
		
		/**
		 * Used to make a unique name for a LevelSegment
		 * @param void
		 * @return string Containing a unique name for a LevelSegment
		 */
		LevelSegment.uniqueName = function () {
			// Hide away a private variable, so that we can create unique
			// LevelSegment's.
			var id = 0;
			
			// Replace the uniqueName function with one that uses the 
			// private id variable.
			LevelSegment.uniqueName = function () {
				id += 1;
				return 'LevelSegment:' + id;
			};
			
			// Once we've replaced the uniqueName function, we need to 
			// return a value generated by it, so the initial call 
			// resolves correctly.
			return LevelSegment.uniqueName();
		};
		
		/**
		 * Used to setup the network paramiter block
		 * @param array network Contains a network list
		 * @return array Containing a list of setup network links
		 */
		LevelSegment.setupNetworkedNeighbours = function (rawNetwork) {
			var network = [], applyDefaults;
			
			if (underscore.isObject(rawNetwork) &&
				! underscore.isArray(rawNetwork)
			) {
				throw new Error(
					'LevelSegment.setupNetworkedNeighbours: expected an array'
					);
			}
			
			/**
			 * Used to makesure the network item contains all the required 
			 * elements to be valid.
			 * @param object network Contains a network item in its raw state
			 * @return object Containing an entry in for correct format 
			 */
			applyDefaults = function (network) {
				return underscore.extend({
					target:           false,
					targetShapeId:    false,
					targetVector2Id1: false,
					targetVector2Id2: false,
					localShapeId:     false,
					localVector2Id1:  false,
					localVector2Id2:  false
				}, network);
			};
			
			underscore.each(rawNetwork, function (item) {
				network.push(
					applyDefaults(item)
					);
			});
			
			return network;
		};
		
		/**
		 * Used to setup edges within a shape
		 * @param Thorny Format Used to find the length of a specific shape
		 * @param array shapes Contains all shapes within the LevelSegment
		 * @return void
		 */
		LevelSegment.instantiateEdges = function (Format, shapes) {
			var edges = [];
			underscore.each(shapes, function (shape, id) {
				var i, ii, edge = [];

				for (i = 0, ii = Format.getLength(shape); i < ii; i += 1) {
					edge.push(true);
				}
				
				edges.push(edge);
			});
			return edges;
		};
		
		/**
		 * Used to pick an edge
		 * @param int edgeId1 Contains an edge id
		 * @param int edgeId2 Contains an edge id
		 * @return int Containing an edge id
		 */
		LevelSegment.edgePicker = function (edgeId1, edgeId2) {
			return (Math.abs(edgeId1 - edgeId2) === 1) ? Math.min(edgeId1, edgeId2) : Math.max(edgeId1, edgeId2);
		};
		
		return LevelSegment;
	}
);