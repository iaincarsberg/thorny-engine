/*global define*/
define(
	[
		'compose'
	], 
	function (
		Compose
	) {
		var Poly2 = Compose(
			function (v1, v2, v3) {
				this.v1 = v1;
				this.v2 = v2;
				this.v3 = v3;
			},
			{
				//
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
		
		return Poly2;
	}
);