/*global define*/
define(
	[
		'compose'
	], 
	function (
		Compose
	) {
		var Vector2 = Compose(
			function (x, y) {
				this.x = x;
				this.y = y;
			},
			{
				/**
				 * Used to expose the x coordinate
				 * @param void
				 * @return double Containing the x value
				 */
				getX: function () {
					return this.x;
				},
				
				/**
				 * Used to expose the x coordinate
				 * @param void
				 * @return double Containing the x value
				 */
				getY: function () {
					return this.y;
				},
				
				/**
				 * Used to clone an existing Vector2
				 * @param void
				 * @return Vector2 Containing a duplicate of this Vector2
				 */
				clone: function () {
					return new Vector2(this.x, this.y);
				},
				
				/**
				 * Used to get the vector coordinates
				 * @param void
				 * @return array Containing the vector
				 */
				getSimpleCoords: function () {
					return [this.x, this.y];
				},
				
				/**
				 * Used to get the vector coordinates, in integer form
				 * @param void
				 * @return array Containing an integer version of the vector
				 */
				getIntegerCoords: function () {
					return [Math.round(this.x), Math.round(this.y)];
				},

				/**
				 * Used to normalize a vector
				 * @param void
				 * @return this, to allow object chaining
				 */
				normalize: function () {
					var dist = Math.sqrt((this.x * this.x) + (this.y * this.y));
					if (dist > 0) {
						dist = 1 / dist;
					}
					
					this.x *= dist;
					this.y *= dist;
					return this;
				},

				/**
				 * Used to add another vector onto this one
				 * @param Vector2 v Containing the vector to add
				 * @return this, to allow object chaining
				 */
				add: function (v) {
					this.x += v.getX();
					this.y += v.getY();
					return this;
				},

				/**
				 * Used to subtract another vector on this one
				 * @param Vector2 v Containing the vector to add
				 * @return this, to allow object chaining
				 */
				sub: function (v) {
					this.x -= v.getX();
					this.y -= v.getY();
					return this;
				},

				/**
				 * Used to translate one vector by another, by a set distance
				 * @param Vector2 Contains the vectors facing
				 * @param double distance Contains now much the actor is to translate
				 * @return this, to allow object chaining
				 */
				translate: function (facing, distance) {
					var v = facing.clone().normalize();
					
					this.x += (v.getX() * distance);
					this.y += (v.getY() * distance);
					return this;
				},

				/**
				 * Used to return the cross product a 2D vector
				 * @param Vector2 v Contains a vector
				 * @return this, to allow object chaining
				 */
				cross: function (v) {
					return (this.x * v.getY()) - (this.y * v.getX());
				},

				/**
				 * Used to return the dot product a 2D vector
				 * @param Vector2 v Contains a vector
				 * @return double Containing the dot product
				 */
				dot: function (v) {
					return (this.x * v.getX()) + (this.y * v.getY());
				},

				/**
				 * Used to find the magnitude of the vector
				 * @param void
				 * @return double Containing the magnitude
				 */
				magnitude: function () {
					return Math.sqrt((this.x * this.x) + (this.y * this.y));
				},

				/**
				 * Used to find the distance between two vectors.
				 * @param $.thorny.world.vector v Contains a vector
				 * @return double Containing the distance between two vectors
				 */
				distance: function (v) {
					var xx = (v.getX() - this.x),
						yy = (v.getY() - this.y);
					return Math.sqrt((xx * xx) + (yy * yy));
				},

				/**
				 * Used to find the angle between two vectors.
				 * @param Vector2 v Contains the vector we want to know the angle 
				 * between.
				 * @return float Containing the angle to a specific vector
				 */
				angle: function (v) {
					return (Math.atan2(v.getY(), v.getX()) - Math.atan2(this.y, this.x));
				},

				/**
				 * Used to see if two vectors are the same 
				 * @param Vector2 v Contains another vector to see if they are the same
				 * @return boolean If the parsed param matches true, otherwise false
				 */
				sameAs: function (v) {
					if (this.x === v.getX() && this.y === v.getY()) {
						return true;
					}
					return false;
				},

				/**
				 * Used to rotate a normalized vector around a get point.
				 * @param double n Containing the rotation amount
				 * @return this, to allow object chaining
				 */
				rotate: function (n) {
					var 
						// Normalise the vector
						v = this.clone().normalize(),

						// Find the angle
						ca = Math.cos(n),
						sa = Math.sin(n);

						// And translate the position.
					this.x = v.getX() * ca - v.getY() * sa;
					this.y = v.getX() * sa + v.getY() * ca;
					return this; 
				},

				/**
				 * Used to rotate a normalized vector to face a specific point.
				 * @param Vector2 vector Containing the target vector
				 * @return this, to allow object chaining
				 */
				rotateToFace: function (vector) {
					var v = this.clone().sub(vector).normalize();

					this.x = v.getX() * -1;
					this.y = v.getY() * -1;
					return this;
				},

				/**
				 * Used to convert a vector into an angle in radians
				 * @param void
				 * @return float Containing the angle of the vector in radians
				 */
				toRadians: function () {
					var v = this.clone().normalize();
					return Math.atan2(v.getY(), v.getX());
				}
			}
		);
		
		
		/**
		 * Used to find an intersection between two points.
		 * @param Vector2 v1 Contains the first point in line one
		 * @param Vector2 v2 Contains the second point in line one
		 * @param Vector2 v3 Contains the first point in line two
		 * @param Vector2 v4 Contains the second point in line two
		 * @return obj|false if intersection happened returns array of x/y 
		 * otherwise fales.
		 */
		Vector2.lineIntersection = function (v1, v2, v3, v4) {
			var 
				bx,
				by, 
				dx, 
				dy,
				b_dot_d_perp,
				cx,
				cy,
				t,
				u;

			bx = v2.getX() - v1.getX();
			by = v2.getY() - v1.getY();
			dx = v4.getX() - v3.getX();
			dy = v4.getY() - v3.getY();

			b_dot_d_perp = bx * dy - by * dx;
			if (b_dot_d_perp === 0) {
				return false;
			}

			cx = v3.getX() - v1.getX();
			cy = v3.getY() - v1.getY();
			t = (cx * dy - cy * dx) / b_dot_d_perp;

			if (t < 0 || t > 1) {
				return false;
			}

			u = (cx * by - cy * bx) / b_dot_d_perp;

			if (u < 0 || u > 1) {
				return false;
			}	

			return new Vector2(
				v1.getX() + t * bx,
				v1.getY() + t * by
				);
		};

		/**
		 * Used to find the centroid of a poly.
		 * @param Vector2 v2 Contains the second point in a poly
		 * @param Vector2 v3 Contains the third point in a poly
		 * @return Vector2 Containing the centroid of a shape
		 */
		Vector2.centroid = function (v1, v2, v3) {
			var 
				/**
				 * Used to find the midpoint along an edge of the poly
				 * @param p1 Contains a vector
				 * @param p2 Contains a vector
				 * @return Vector2 Containing a mid point for a poly
				 */
				findEdgeMp = function (p1, p2) {
					return p1.clone().translate(
						p2.clone().sub(p1),
						(p1.distance(p2) / 2)
					);
				},

				mp1 = findEdgeMp(v1, v2),
				mp2 = findEdgeMp(v2, v3);

			return this.lineIntersection(v1, mp2, v3, mp1);
		};

		/**
		 * Used to see if a point is on the left of an edge
		 * @param object point Contains the point being checked
		 * @param object edge1 Contains one of the two vectors that makes up the edge
		 * @param object edge2 Contains the other vector that makes up the edge
		 * @return boolean True if on left, otherwise false
		 */
		Vector2.isLeftOfEdge = function (point, edge1, edge2) {
			if (
				(edge2.getX() - edge1.getX()) * (point.getY() - edge1.getY()) - 
				(edge2.getY() - edge1.getY()) * (point.getX() - edge1.getX()) > 0
			) {
				return false;
			}
			return true;
		};
		
		return Vector2;
	}
);