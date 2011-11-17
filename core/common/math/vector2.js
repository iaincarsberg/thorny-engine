/*global define*/
define(
	[
		'thorny'
	], 
	function (
		Thorny
	) {
		var Vector2 = Thorny.extend(
			function (x, y) {
				this.setX(x);
				this.setY(y);
			},
			{
				/**
				 * Used to expose the x coordinate
				 * @param void
				 * @return double Containing the x value
				 */
				getX: function () {
					return this.data('x');
				},
				
				/**
				 * Used to expose the x coordinate
				 * @param void
				 * @return double Containing the x value
				 */
				getY: function () {
					return this.data('y');
				},
				
				/**
				 * Used to set the x coordinate
				 * @param float x Contains the x
				 * @return this, to allow object chaning
				 */
				setX: function (x) {
					this.data('x', x);
					return this;
				},
				
				/**
				 * Used to set the y coordinate
				 * @param float y Contains the y
				 * @return this, to allow object chaning
				 */
				setY: function (y) {
					this.data('y', y);
					return this;
				},
				
				/**
				 * Used to copy the values from another Vector2.
				 * @param Vector2 host Contains a Vector2 that we're copying
				 * @return this, to allow object chaining
				 */
				copy: function (host) {
					this
						.setX(host.getX())
						.setY(host.getY());
					
					return this;
				},
				
				/**
				 * Used to clone an existing Vector2
				 * @param void
				 * @return Vector2 Containing a duplicate of this Vector2
				 */
				clone: function () {
					return new Vector2(this.getX(), this.getY());
				},
				
				/**
				 * Used to get the vector coordinates
				 * @param void
				 * @return array Containing the vector
				 */
				getSimpleCoords: function () {
					return [this.getX(), this.getY()];
				},
				
				/**
				 * Used to get the vector coordinates, in integer form
				 * @param void
				 * @return array Containing an integer version of the vector
				 */
				getIntegerCoords: function () {
					return [Math.round(this.getX()), Math.round(this.getY())];
				},

				/**
				 * Used to normalize a vector
				 * @param void
				 * @return this, to allow object chaining
				 */
				normalize: function () {
					var dist = Math.sqrt((this.getX() * this.getX()) + (this.getY() * this.getY()));
					if (dist > 0) {
						dist = 1 / dist;
					}
					
					this.setX(this.getX() * dist);
					this.setY(this.getY() * dist);
					return this;
				},

				/**
				 * Used to add another vector onto this one
				 * @param Vector2 v Containing the vector to add
				 * @return this, to allow object chaining
				 */
				add: function (v) {
					this.setX(this.getX() + v.getX());
					this.setY(this.getY() + v.getY());
					return this;
				},

				/**
				 * Used to subtract another vector on this one
				 * @param Vector2 v Containing the vector to add
				 * @return this, to allow object chaining
				 */
				sub: function (v) {
					this.setX(this.getX() - v.getX());
					this.setY(this.getY() - v.getY());
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
					
					this.setX(this.getX() + v.getX() * distance);
					this.setY(this.getY() + v.getY() * distance);
					return this;
				},

				/**
				 * Used to return the cross product a 2D vector
				 * @param Vector2 v Contains a vector
				 * @return this, to allow object chaining
				 */
				cross: function (v) {
					return (this.getX() * v.getY()) - (this.getY() * v.getX());
				},

				/**
				 * Used to return the dot product a 2D vector
				 * @param Vector2 v Contains a vector
				 * @return double Containing the dot product
				 */
				dot: function (v) {
					return (this.getX() * v.getX()) + (this.getY() * v.getY());
				},

				/**
				 * Used to find the magnitude of the vector
				 * @param void
				 * @return double Containing the magnitude
				 */
				magnitude: function () {
					return Math.sqrt((this.getX() * this.getX()) + (this.getY() * this.getY()));
				},

				/**
				 * Used to find the distance between two vectors.
				 * @param $.thorny.world.vector v Contains a vector
				 * @return double Containing the distance between two vectors
				 */
				distance: function (v) {
					var xx = (v.getX() - this.getX()),
						yy = (v.getY() - this.getY());
					return Math.sqrt((xx * xx) + (yy * yy));
				},

				/**
				 * Used to find the angle between two vectors.
				 * @param Vector2 v Contains the vector we want to know the angle 
				 * between.
				 * @return float Containing the angle to a specific vector
				 */
				angle: function (v) {
					return (Math.atan2(v.getY(), v.getX()) - Math.atan2(this.getY(), this.getX()));
				},

				/**
				 * Used to see if two vectors are the same 
				 * @param Vector2 v Contains another vector to see if they are the same
				 * @return boolean If the parsed param matches true, otherwise false
				 */
				sameAs: function (v) {
					if (this.getX() === v.getX() && this.getY() === v.getY()) {
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
					this.setX(v.getX() * ca - v.getY() * sa);
					this.setY(v.getX() * sa + v.getY() * ca);
					return this; 
				},

				/**
				 * Used to rotate a normalized vector to face a specific point.
				 * @param Vector2 vector Containing the target vector
				 * @return this, to allow object chaining
				 */
				rotateToFace: function (vector) {
					var v = this.clone().sub(vector).normalize();

					this.setX(v.getX() * -1);
					this.setY(v.getY() * -1);
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
		 * @param vararg Vector2 Parse in as many vectors as you like, and 
		 *        this will find the centroid of your convex shape.
		 * @return Vector2 Containing the centroid of a shape
		 */
		Vector2.centroid = function () {
			/**
			 * Used to find the midpoint along an edge of the poly
			 * @param p1 Contains a vector
			 * @param p2 Contains a vector
			 * @return Vector2 Containing a mid point for a poly
			 */
			function findEdgeMp(p1, p2) {
				return p1.clone().translate(
					p2.clone().sub(p1),
					(p1.distance(p2) / 2)
				);
			}
			
			var
				args = arguments.length,
				opposite;
			
			// Makesure our shape has enough detail.
			if (args < 3) {
				throw new Error("Can only find the centroid with >= 3 Vector2's");
			}
			
			// Check to see if we're dealing
			if (args % 2 === 0) {// Even
				opposite = args / 2;
				return this.lineIntersection(
					arguments[0],
					arguments[opposite],
					arguments[1],
					arguments[opposite + 1]
					);
				
			} else {// Odd
				opposite = Math.ceil(args / 2);
				return this.lineIntersection(
					arguments[0],
					findEdgeMp(arguments[opposite - 1], arguments[opposite]),
					arguments[1],
					findEdgeMp(arguments[opposite], arguments[(opposite + 1) % args])
					);
			}
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