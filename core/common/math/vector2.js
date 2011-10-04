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
				}
			}
		);
		
		
		/**
		 * Used to find an intersection between two points.
		 * @param vector2 
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
		 * @param vector v2 Contains the second point in a poly
		 * @param vector v3 Contains the third point in a poly
		 * @return vector Containing the centroid of a shape
		 */
		Vector2.centroid = function (v1, v2, v3) {
			var 
				/**
				 * Used to find the midpoint along an edge of the poly
				 * @param p1 Contains a vector
				 * @param p2 Contains a vector
				 * @return vector Containing a mid point for a poly
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