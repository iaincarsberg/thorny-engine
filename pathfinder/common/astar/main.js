/*global define*/
/*
Usage:

	var level = Model.select('level')
		.factory(
			['level', {format: 'thorny!math/tile2'}],
			['levelSegment', 'some/cool/level/segment01.json'],
			['levelSegment', 'some/cool/level/segment02.json'],
			['levelSegment', 'some/cool/level/segment03.json'],
			['levelSegment', 'some/cool/level/segment04.json']
			)
		.triggers('level-loaded');
		
	event.bind('level-loaded', function () {
		// Find a route from 0px/0px to 10px/10px.
		level
			.getComponent('pathfinder/astar')
			.route([0, 0], [10, 10]);
	});
*/
define(
	[
		'thorny',
		'cjs!underscore'
	], 
	function (
		Thorny,
		underscore
	) {
		var AStar;
		
		// The AStar system isn't instantiated, it only exposes a collection
		// of functions that are used to find a path through a Level.
		AStar = {};
		
		/**
		 * Used to search a loaded and processed level collcetion.
		 * @param array from Contains the from node,
		 * @param array to Contains the to node.
		 * @param int diameter Contains the diameter of an entity moving
		 * though the network.
		 * @return array Containing a list of references to nodes.
		 * @throws "Thorny Astar: Invalid start or end."
		 * @throws "Thorny Astar: Cannot find viable path."
		 */
		AStar.route = function (from, to, diameter, heuristic) {
			var open = [],
				closed = [],
				costs = {},
				parent = false,
				path,
				fromId,
				toId,
				i,	// Used for loop control
				ii;	// Used for loop delimiting
				
			// If no heuristic function was parsed use the default one.
			if (heuristic === undefined) {
				heuristic = AStar.calculateHeuristic;
			}
			
			// Add the starting element to the costs and open array.
			AStar.addToSearch(open, costs, from, heuristic(from, to), false);
			
			path = [];
			while (true) {
				if (from === false) {
					throw new Error("Thorny Astar: Cannot find viable path.");
				}
				
				// Test to see if we're at the end of the path.
				if (open.length === 0 || (from === to)) {
					path = AStar.minePath(costs, to);
					break;
				}
				
				for (i = 0, ii = open.length; i < ii; i += 1) {
					if (AStar.isUniqueInList(closed, open[i])) {
						continue;
					}
					
					AStar.addChildrenToOpen(
						open, 
						costs, 
						from, 
						to, 
						diameter, 
						heuristic
						);
				}
				
				AStar.addUniqueToList(closed, from);
				open = AStar.removeUniqueFromList(open, from);
				
				from = AStar.pickBestFromOpen(open, closed, costs);
			}

			return path;
		};//search
		
		
		/**
		 * Used to add a unique item to either the open or closed array
		 * @param array open Contains all list paths
		 * @param array item Contains a network node
		 * @return void
		 */
		AStar.addUniqueToList = function (list, item) {
			var
				i,	// Used for loop control
				ii;	// Used for loop delimiting

			for (i = 0, ii = list.length; i < ii; i += 1) {
				if (list[i] === item) {
					return false;
				}
			}

			list.push(item);

			return true;
		};

		/***
		 * Used to see if an item is within a collection.
		 * @param array list Contains the container for processed nodes
		 * @param object item Contains a network node
		 * @return boolean
		 */
		AStar.isUniqueInList = function (list, item) {
			var
				i,	// Used for loop control
				ii;	// Used for loop delimiting

			for (i = 0, ii = list.length; i < ii; i += 1) {
				if (list[i] === item) {
					return true;
				}
			}

			return false;
		};

		/**
		 * Used to remove a unique item from either the open or closed array
		 * @param array list Contains the container for processed nodes
		 * @param object item Contains a network node
		 * @reutrn double Contains the shortened array
		 */
		AStar.removeUniqueFromList = function (list, item) {
			var
				i,	// Used for loop control
				ii;	// Used for loop delimiting

			for (i = 0, ii = list.length; i < ii; i += 1) {
				if (list[i] === item) {
					return list.slice(0, i).concat(list.slice((i + 1), list.length));
				}
			}

			return false;
		};

		/**
		 * Used to find the manhattan distance between two points
		 * @param node from Contains the remote node
		 * @param node to Contains the remote node
		 * @return float Containing the manhattan distance between two points
		 */
		AStar.calculateHeuristic = function (from, to) {
			return Math.abs(from.getX() - to.getX()) + Math.abs(from.getY() - to.getY());
		};

		/**
		 * Used to add a new record to the costs array
		 * @param array open Contains all open nodes
		 * @param array costs Contains search data for this request
		 * @param object o Contains the new open position
		 * @param double heuristic Contains the distance between nodes
		 * @param object parent Contains o's parent
		 * @param double distanceToParent Contains the distance to the parent
		 * @return void
		 */
		AStar.addToSearch = function (open, costs, o, heuristic, parent, distanceToParent) {
			var
				toGoal,
				traveled = 0;

			// Prep our traveled variable
			if (parent !== false) {
				traveled = (costs[parent.getId()] !== undefined) ? costs[parent.getId()].traveled : 0;
				traveled += distanceToParent;
			}

			// Estimate how much further we have to move till we reach the goal.
			toGoal = traveled + heuristic;

			// If the new item is already in the open list, no point trying
			// to so anything.
			if (! AStar.addUniqueToList(open, o)) {
				if (costs[o.getId()] &&
					traveled < costs[o.getId()].traveled
				) {
					costs[o.getId()].parent = parent.getId();
					costs[o.getId()].heuristic = heuristic;
					costs[o.getId()].traveled = traveled;
					costs[o.getId()].toGoal = toGoal;
				}

				return false;
			}

			// If the item already has a costs worked out for it then skip onto 
			// the next item.
			if (costs[o.getId()] !== undefined) {
				return false;
			}

			costs[o.getId()] = {
				node: o,
				parent: (parent === false) ? false : parent.getId(),

				heuristic: heuristic,
				traveled: traveled,
				toGoal: toGoal
			};
		};

		/**
		 * Used to add all a nodes child elements to the open array.
		 * @param array network Contains all connections between nodes
		 * @param array open Contains all open nodes
		 * @param array costs Contains search data for this request
		 * @param object from Contains the current location
		 * @param object to   Contains the target location
		 * @param int diameter Contains the diameter of an entity moving
		 * @param function findHeuristic Contains the heuristic function to use.
		 * though the network.
		 * @return void
		 */
		AStar.addChildrenToOpen = function (open, costs, from, to, diameter, findHeuristic) {
			var
				neighbours = from.getNeightbours(),
				neighbour,// Contains a single node from the collection
				i,	// Used for loop control
				ii;	// Used for loop delimiting

			while ((neighbour = neighbours.step())) {
				// If the diameter is unset, or the diameter is larger than the
				// edge width skip this child.
				if (neighbour.details.edgeWidth !== undefined && 
					neighbour.details.edgeWidth !== false &&
					diameter !== undefined
				) {
					if (diameter > neighbour.details.edgeWidth) {
						continue;
					}
				}

				// Add the neighbouring node to the open list.
				AStar.addToSearch(
					open,
					costs,
					neighbour.node,
					findHeuristic(from, neighbour.node),
					from,
					neighbour.details.distanceTo
				);
			}
		};

		/**
		 * Used to pick the best open node from the 
		 * @param array open Contains
		 * @param array closed Contains
		 * @param object costs Contains
		 * @return object Containing the best location to start the next search.
		 */
		AStar.pickBestFromOpen = function (open, closed, costs) {
			var 
				bestO = false,
				bestToGoal = false,
				o,
				toGoal,
				i,	// Used for loop control
				ii;	// Used for loop delimiting

			for (i = 0, ii = open.length; i < ii; i += 1) {
				o = open[i];

				// Check to see if this node has already need closed.
				if (AStar.isUniqueInList(closed, o)) {
					continue;
				}

				toGoal = costs[o.getId()].toGoal;

				if (bestToGoal === false || bestToGoal >= toGoal) {
					bestO = o;
					bestToGoal = toGoal;
				}
			}

			return bestO;
		};

		/**
		 * Used to unpack the best path.
		 * @param object costs Contains the movement costs for this request
		 * @param object goal Contains the goal location
		 * @param array route Contains the current route
		 * @return array Containing the order you need to move around the nodelist
		 */
		AStar.minePath = function (costs, goal, route) {
			if (route === undefined) {
				route = [];
			}

			var next = costs[costs[goal.getId()].parent];

			if (next === undefined) {
				route.push(goal);
				return route.reverse();
			}

			route.push(goal);
			return AStar.minePath(costs, next.node, route);
		};
		
		return AStar;
	}
);