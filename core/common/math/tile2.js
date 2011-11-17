/*global define*/
/*
Note:
The following crude ascii diagram labels the corners of a Tile2, this is of 
importance when dealing with networking Tile2s within a LevelSegment.

  2       1
	-----
	|   |
	|   |
	|   |
	-----
  3       0

*/
define(
	[
		'thorny',
		'thorny!math/vector2',
		'compose',
		'cjs!underscore'
	], 
	function (
		Thorny,
		Vector2,
		Compose,
		underscore
	) {
		var 
			Tile2,
			defaults = {
				width: 32,
				height: 32
			};
		
		Tile2 = Thorny.extend(
			function (x, y, width, height) {
				if (width === undefined) {
					width = defaults.width;
				}
				if (height === undefined) {
					height = defaults.height;
				}
				
				// The way the LevelSegment class works is to build a list of
				// Vector2s, and call Format.apply(null, Vector2s), so we need
				// to be in a situation where we can accept a Vector2 as our
				// constructor.
				if (x instanceof Vector2 && 
					y === undefined
				) {
					y = x.getY() * height;
					x = x.getX() * width;
				}
				
				// Half the width and height
				width /= 2;
				height /= 2;
				
				var 
					i,// Used for loop control
					centroid;
				
				// Find the centroid of the tile
				centroid = new Vector2(x + width, y + height);
				
				// Mixin the centroid
				Compose.call(
					this,
					centroid
					);
				
				// Store the height and width
				this.data('width', width);
				this.data('height', height);
				
				// Build the vector2 data store.
				this.data('vector2s', [
					new Vector2(width * -1, height * -1),
					new Vector2(width, height * -1),
					new Vector2(width, height),
					new Vector2(width * -1, height)
				]);
			},
			{
				/**
				 * Used to access the Vector2s witin the node.
				 * @param void
				 * @return array Contains the raw polys nodes
				 */
				getVector2s: function () {
					var 
						vectors = this.data('vector2s'),
						response = [],
						i, ii;
					
					for (i = 0, ii = vectors.length; i < ii; i += 1) {
						response.push(
							vectors[i]
								.clone()
								.add(this)
							);
					}
					
					return response;
				},
				
				/**
				 * Used to get the midpoint of a poly.
				 * We can directly return references to the midpoint
				 * as the vector2 exposes no way to alter the
				 * internal value.
				 * @param void
				 * @return vector2 Containing the midpoint of the poly2
				 */
				getMidpoint: function () {
					return this;
				},
				
				/**
				 * Used to see if two polys share a common edge.
				 * @param poly2 poly2 Contains a remove poly
				 * @return boolean true is edge is shared
				 */
				sharesEdge: function (tile2) {
					var negativeAdjacency = false;
					
					if (tile2 instanceof Tile2) {
						if (this.sameAs(tile2)) {
							return false;
						}
						
						if (this.getX() === tile2.getX() &&
							(
								this.getY() === tile2.getY() - this.data('height') - tile2.data('height') ||
								(negativeAdjacency = this.getY() === tile2.getY() + this.data('height') + tile2.data('height'))
							)
						) {
							if (negativeAdjacency) {
								return {
									local: [0, 3],
									remote: [1, 2]
								};
							}
							return {
								local: [1, 2],
								remote: [0, 3]
							};
							
						} else if (
							this.getY() === tile2.getY() &&
							(
								this.getX() === tile2.getX() - this.data('width') - tile2.data('width') ||
								(negativeAdjacency = this.getX() === tile2.getX() + this.data('width') + tile2.data('width'))
							)
						) {
							if (negativeAdjacency) {
								return {
									local: [2, 3],
									remote: [0, 1]
								};
							}
							return {
								local: [0, 1],
								remote: [2, 3]
							};
						}
					}
					
					return false;
				},
				
				/**
				 * Used to see if a point is within this shape.
				 * @param object point Contains a vector2
				 * @return boolean
				 * @url http://mathworld.wolfram.com/TriangleInterior.html
				 * @note thanks to footyfish and andrewjbaker for spending a
				 * lonely wednesday everning in april helping me get this 
				 * working right.
				 */
				isVector2Internal: function (point) {
					if (
						(
							point.getX() >= this.getX() - this.data('width') &&
							point.getX() <= this.getX() + this.data('width') 
						) && (
							point.getY() >= this.getY() - this.data('height') &&
							point.getY() <= this.getY() + this.data('height')
						)
					) {
						return true;
					}
					
					return false;
				}
			}
		);
		
		/**
		 * Used to set the defaults for objects of type Tile2
		 * @param object options Contains Tile2 options
		 * @return this, to allow object chaining
		 */
		Tile2.setDefaults = function (options) {
			defaults = underscore.extend(defaults, options);
			return Tile2;
		};
		
		/**
		 * Used to find the length of a Tile2
		 * @param Tile2 tile2
		 * @return int Containing the length of the Tile2
		 */
		Tile2.getLength = function (tile2) {
			if (tile2 !== undefined &&
				! (tile2 instanceof Tile2)
			) {
				throw new Error(
					'Poly2.getLength: Only accepts object of type Poly2'
					);
			}
			return 4;
		};
		
		/**
		 * This is a bit of a hack to allow "level/common/level-segment.js" 
		 * to load in less verbose Tile2's from disk.
		 * @var boolean
		 */
		Tile2.acceptSimpleShapes = true;
		
		// Make the Tile2d available to the big wide world!
		return Tile2;
	}
);