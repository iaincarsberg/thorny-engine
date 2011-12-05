/*global define*/
define(
	[
		'thorny!math/vector2'
	], 
	function (
		Vector2
	) {
		var Circle2 = Vector2.extend(
			function (x, y, radius) {
				this.setRadius(radius);
			},
			{
				/**
				 * Used to expose the x coordinate
				 * @param void
				 * @return double Containing the x value
				 */
				getRadius: function () {
					return this.data('radius');
				},
				
				/**
				 * Used to set the x coordinate
				 * @param float x Contains the x
				 * @return this, to allow object chaning
				 */
				setRadius: function (radius) {
					this.data('radius', radius);
					return this;
				},
			}
		);
		
		
		/**
		 * Used to find an intersection between two circles.
		 * @param int x0 contains a x point for the first point
		 * @param int y0 contains a y point for the first point
		 * @param int r0 contains the radius for the first circle
		 * @param int x1 contains a x point for the second point
		 * @param int y1 contains a y point for the second point
		 * @param int r1 contains the radius for the second circle
		 * @return array|false if intersection happened returns array of x/y 
		 * otherwise fales.
		 */
		Circle2.circleCircleIntersection = function (x0, y0, r0, x1, y1, r1) {
			var dx, dy, d, a, x2, y2, h, rx, ry, xi, xi_prime, yi, yi_prime;
			
			/* dx and dy are the vertical and horizontal distances between
			 * the circle centers.
			 */
			dx = x1 - x0;
			dy = y1 - y0;

			/* Determine the straight-line distance between the centers. */
			d = Math.sqrt((dy * dy) + (dx * dx));

			/* Check for solvability. */
			if (d > (r0 + r1)) {
				/* no solution. circles do not intersect. */
				return false;
			}

			if (d < Math.abs(r0 - r1)) {
				/* no solution. one circle is contained in the other */
				return false;
			}

			/* 'point 2' is the point where the line through the circle
			 * intersection points crosses the line between the circle
			 * centers.  
			 */

			/* Determine the distance from point 0 to point 2. */
			a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2 * d);

			/* Determine the coordinates of point 2. */
			x2 = x0 + (dx * a / d);
			y2 = y0 + (dy * a / d);

			/* Determine the distance from point 2 to either of the
			 * intersection points.
			 */
			h = Math.sqrt((r0 * r0) - (a * a));

			/* Now determine the offsets of the intersection points from
			 * point 2.
			 */
			rx = -dy * (h / d);
			ry = dx * (h / d);

			/* Determine the absolute intersection points. */
			xi       = x2 + rx;
			xi_prime = x2 - rx;
			yi       = y2 + ry;
			yi_prime = y2 - ry;
			
			return [
				new Vector2(xi, yi),
				new Vector2(xi_prime, yi_prime)
			];
		};
		
		return Circle2;
	}
);