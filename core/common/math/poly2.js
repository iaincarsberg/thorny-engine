/*global define*/
define(
	[
		'thorny',
		'thorny!math/vector2',
		'thorny!math/circle2',
		'compose'
	], 
	function (
		Thorny,
		Vector2,
		Circle2,
		Compose
	) {
		var Poly2, radDeg;

		radDeg = (180 / Math.PI);
		Poly2 = Thorny.extend(
			function () {
				var 
					i,// Used for loop control
					args = arguments.length,
					centroid;
				
				// Find the centroid of the shape based on the arguments
				centroid = Vector2.centroid.apply(Vector2, arguments);
				
				// If the centroid doesn't exist, throw an error
				if (! centroid) {
					throw new Error('Unable to determinable a centroid for the loaded shape');
				}
				
				// Mixin the centroid
				Compose.call(
					this,
					centroid
					);
				
				// Build the vector2 data store.
				this.data('vector2s', []);
				this.data('publicVector2s', []);
				for (i = 0, args; i < args; i += 1) {
					if (! (arguments[i] instanceof Vector2)) {
						throw new Error('Poly2 only accepts parameters of type Vector2');
					}
					
					this.data('vector2s').push(
						// we want the centroid to act as the origin for the
						// shape, so if the Poly2 needs to move we just 
						// translate one point, then add it to the others when 
						// you do a getVector2s.
						arguments[i].clone().sub(centroid)
						);
						
					// We want to create a public vector per vector within 
					// this shape. This allows us to expose a fixed number of 
					// Vector2s without having to abuse the garbage collector.
					this.data('publicVector2s').push(new Vector2());
					
				}
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
						publicVector2s = this.data('publicVector2s'),
						response = [],
						i, ii;
					
					for (i = 0, ii = vectors.length; i < ii; i += 1) {
						response.push(
							publicVector2s[i]
								.copy(vectors[i])
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
				sharesEdge: function (poly2) {
					if (poly2 instanceof Poly2 &&
						this.sameAs(poly2)
					) {
						return false;
					}
					
					var
						edge = {
							local: [],
							remote: []
						},
						common = 0,
						local = this.getVector2s(),
						remote = poly2.getVector2s(),
						i,	// Used for loop control
						ii,	// Used for loop delimiting
						j,	// Used for loop control
						jj;	// Used for loop delimiting

					for (i = 0, ii = local.length; i < ii; i += 1) {
						for (j = 0, jj = remote.length; j < jj; j += 1) {
							if (local[i].sameAs(remote[j])) {
								// Build up the edges data
								edge.local.push(i);
								edge.remote.push(j);
								
								// Incroment the common counter
								common += 1;
							}
						}
					}
					
					// Check to makesure a complete edge was detected.
					if (common === 2) {
						return edge;
					}
					
					return false;
				},
				
				/**
				 * Used to find the uncommonVector2 in a poly
				 * @param array Contains an array of vector2s that make up an 
				 * edge in this poly2
				 * @return object Containing a vector2
				 */
				uncommonVector2: function (edge) {
					var 
						v2s = this.getVector2s(),
						isUncommon,
						i,	// Used for loop control
						ii,	// Used for loop delimiting
						j,	// Used for loop control
						jj;	// Used for loop delimiting
					
					// Loop over all of the nodes vector2s
					for (i = 0, ii = v2s.length; i < ii; i += 1) {
						isUncommon = true;
						
						// Loop over the parsed edge
						for (j = 0, jj = edge.length; j < jj; j += 1) {
							// If the vector2 is in the edge then its not the
							// uncommon point.
							if (v2s[i].sameAs(edge[j])) {
								isUncommon = false;
							}
						}
						
						// Return the uncommon vector2
						if (isUncommon) {
							return v2s[i];
						}
					}
					
					// Return false encase there is no uncommon point.
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
					var 
						i, ii,
						pt, v1, v2, v3,
						u, w, a, b, c,
						vectors = this.getVector2s(),
						vectorsLength = vectors.length;
					
					// If the vector is on one of the points, then return true
					for (i = 0, ii = vectorsLength; i < ii; i += 1) {
						if (vectors[i].sameAs(point)) {
							return true;
						}
					}
					
					// Check the Poly2 for internal points
					for (i = 1, ii = (vectorsLength - 1); i < ii; i += 1) {
						// Localise the data
						pt = point.clone();
						v1 = vectors[0].clone();
						v2 = vectors[i].clone();
						v3 = vectors[i + 1].clone();
						
						// Do maths stuff
						u = v2.sub(v1);
						w = v3.sub(v1);
						a = (point.cross(w) - v1.cross(w)) / u.cross(w);
						b = -(point.cross(u) - v1.cross(u)) / u.cross(w);
						c = a + b;
						
						// And check for the internals
						if ((a >= 0) && (b >= 0) && (c <= 1)) {
							return true;
						}
					}
					return false;
				}
			}
		);
		
		/**
		 * Used to find the internal angles within a poly
		 * @param Vector2 v1 Contains a vector2
		 * @param Vector2 v2 Contains a vector2
		 * @param Vector2 v3 Contains a vector2
		 * @return array Containing all internal angles
		 */
		Poly2.findAngles = function (v1, v2, v3) {
			var
				a = v1.distance(v2),
				b = v2.distance(v3),
				c = v3.distance(v1);

			return [
				Math.acos((a * a + c * c - b * b) / (2 * a * c)),
				Math.acos((b * b + a * a - c * c) / (2 * b * a)),
				Math.acos((c * c + b * b - a * a) / (2 * c * b))
			];
		};//findAngles
		
		/**
		 * Used to find the distance from the line-segment.
		 * @param array angles Contains all three internal angles of in the poly
		 * @param object goal Contains the target location the actor would like 
		 *        to move to.
		 * @param object edge1 Contains one of the two vectors that makes up the edge
		 * @param object edge2 Contains the other vector that makes up the edge
		 * @return double Containing the distance between the actor and edge
		 */
		Poly2.findDistanceFromLineSegment = function (angles, goal, edge1, edge2) {
			var
				e1g = edge1.distance(goal),
				e2g = edge2.distance(goal),
				insideProjection = true,
				distance;

			// Check to makesure the line segment is within the projection
			// of the line.
			if (angles[0] > 1.5707963267948966 || angles[1] > 1.5707963267948966) {
				insideProjection = false;
				if (e1g > e2g) {
					distance = e2g;
				} else {
					distance = e1g;
				}

			} else {
				distance = Math.sin(angles[0]) * e1g;
			}
			
			return {
				distance: distance,
				insideProjection: insideProjection
			};
		};//findDistanceFromLineSegment
		
		/**
		 * Used to find the length of a Poly2
		 * @param Poly2 poly2 Contains a poly2 we want to know the length of
		 * @return int Containing the length of the Poly2
		 */
		Poly2.getLength = function (poly2) {
			if (! (poly2 instanceof Poly2)) {
				throw new Error(
					'Poly2.getLength: Only accepts object of type Poly2'
					);
			}
			
			return poly2.data('vector2s').length;
		};
		
		/**
		 * Used to find the closest point of intersection between a line and 
		 * a vector.
		 * @param object goal Contains the Vector2 we're intersted in finding 
		 *        the product pointing to the edge1/edge2 line.
		 * @param object edge1 Contains one of the edges involved with the collision
		 * @param object edge2 Contains one of the edges involved with the collision 
		 * @return Vector2 Containing the point of projected intersection.
		 */
		Poly2.findEdgeIntersectionPoint = function (goal, edge1, edge2) {
			var angles = Poly2.findAngles(edge1, edge2, goal),
				distance = Poly2.findDistanceFromLineSegment(angles, goal, edge1, edge2),
				midpoint,
				intersect,
				edgeDistance,
				mpEdge0,
				mpEdge1;
			
			// Check to makesure we have a valid distance.
			if (distance === false) {
				return false;
			}

			// Check to see if the distance was inside of the original projection
			// if it wasn't then we need to return the closest vector.
			if (distance.insideProjection === false) {
				if (edge1.distance(goal) > edge2.distance(goal)) {
					return edge2;
				}
				return edge1;
			}

			// Find where the midpoint is on the collided edge, this 
			// tells us how far along an edge the collision was.
			midpoint = Math.sin((90 - (angles[0] * radDeg)) / radDeg) * edge1.distance(goal);

			// Find the intersection point for the goal based on 
			// the edge.
			intersect = Circle2.circleCircleIntersection(
				edge1.getX(), edge1.getY(), midpoint,
				goal.getX(),  goal.getY(),  distance.distance
			);
			
			// If there was an intersection then we need to deal 
			// with it.
			if (intersect) {
				// Find the best possible midpoint ana return that
				// line intersection
				edgeDistance = edge1.distance(edge2);
				mpEdge0 = (edge1.distance(intersect[0]) + edge2.distance(intersect[0])) - edgeDistance;
				mpEdge1 = (edge1.distance(intersect[1]) + edge2.distance(intersect[1])) - edgeDistance;

				if (mpEdge0 < 0) {
					mpEdge0 *= -1;
				}
				
				if (mpEdge1 < 0) {
					mpEdge1 *= -1;
				}

				if (mpEdge0 < mpEdge1) {
					return intersect[0];

				} else {
					return intersect[1];
				}
			}
			return false;
		};
		
		// Make the Poly2 available to the big wide world!
		return Poly2;
	}
);