/*global define console*/
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
		'thorny!pathfinder>route',
		'cjs!underscore'
	], 
	function (
		Thorny,
		route,
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
		AStar.route = function (level, from, to, diameter, heuristic) {
			var open   = [],
				closed = [],
				costs  = {},
				path   = [],
				
				/**
				 * Used to add children to the open list, used as apart of the 
				 * foreach within the while(true) loop.
				 * @param array o Contains a location
				 * @return void
				 */
				openAdder = function (o) {
					if (AStar.isUniqueInList(closed, o)) {
						return;
					}

					AStar.addChildrenToOpen(
						level, 
						costs, 
						open, 
						heuristic, 
						to, 
						o, 
						diameter
						);
				};
			
			// If no heuristic function was parsed use the default one.
			if (heuristic === undefined) {
				heuristic = AStar.calculateHeuristic;
			}
			
			// Add the starting element to the costs and open array.
			AStar.addToSearch(level, costs, open, heuristic, to, from);
			
			while (true) {
				if (from === false) {
					break;
				}
				
				// Test to see if we're at the end of the path.
				if (open.length === 0 || 
					(
						from[0] === to[0] &&
						from[1] === to[1]
					)
				) {
					path = AStar.minePath(costs, to);
					break;
				}
				
				// Add the shape's networked neighbours to the open list.
				underscore.each(open, openAdder);
				
				AStar.addUniqueToList(closed, from);
				open = AStar.removeUniqueFromList(open, from);
				from = AStar.pickBestFromOpen(open, closed, costs);
			}
			
			// Bind functions contained within route to the path array.
			return route(path);
		};
		
		/**
		 * Used to add a unique item to either the open or closed array
		 * @param array open Contains all list paths
		 * @param array item Contains a network node
		 * @return void
		 */
		AStar.addUniqueToList = function (list, item) {
			var
				i,	// Used for loop control
				ii, // Used for loop delimiting
				hash = item.join(':');

			for (i = 0, ii = list.length; i < ii; i += 1) {
				if (list[i].join(':') === hash) {
					return false;
				}
			}
			
			// Makesure the stored item is of style [string, number]
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
				ii,	// Used for loop delimiting
				hash = item.join(':');

			for (i = 0, ii = list.length; i < ii; i += 1) {
				if (list[i].join(':') === hash) {
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
				ii,	// Used for loop delimiting
				hash = item.join(':');

			for (i = 0, ii = list.length; i < ii; i += 1) {
				if (list[i].join(':') === hash) {
					return list.slice(0, i).concat(list.slice((i + 1), list.length));
				}
			}

			return list;
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
		 * Used to estimate the cost to travel from a specific tile, to the goal.
		 * @param object level Contains the level component we're searching
		 * @param object costs Contains the costs of any movement we're already componeted
		 * @param function heuristic Used to extimate the new movement cost
		 * @param array to Contains the destination
		 * @param array current Contains out current location
		 * @param array from Contains the place we came from
		 * @return float Containing the estimated distance to the goal
		 */
		AStar.estimateDistanceToGoal = function (level, costs, heuristic, to, current, from) {
			var traveled = 0, heur;
			
			// If we're coming FROM somewhere, we need to update the currently 
			// traveled distance.
			if (from !== undefined) {
				traveled += level.getDistance(current, from);
				traveled += (costs[from.join(':')]) ? costs[from.join(':')].traveled : 0;
			}
			
			// Calculate the heuristic
			heur = heuristic(
				level.getSegmentShape(current),
				level.getSegmentShape(to)
				);
			
			// Estimate how much further we have to move till we reach the goal.
			return [
				traveled,
				heur
			];
		};

		/**
		 * Used to add a new record to the costs array
		 * @param Level level Contains the level were searching
		 * @param Object costs Contains any previosly processed movement costs
		 * @param Array open Contains the current open list
		 * @param Function heuristicFuncion Calculates the heuristic
		 * @param Array to Contains the destination
		 * @param Array current Contains the current location
		 * @param Array from Contains the prior location
		 * @return void
		 */
		AStar.addToSearch = function (level, costs, open, heuristicFuncion, to, current, from) {
			var traveled,
				heuristic,
				toGoal,
				estimate = AStar.estimateDistanceToGoal(level, costs, heuristicFuncion, to, current, from), 
				hash = current.join(':');
			
			// Localise the extimate
			traveled  = underscore.isNaN(estimate[0]) ? 0 : estimate[0];
			heuristic = underscore.isNaN(estimate[1]) ? 0 : estimate[1];
			toGoal    = traveled + heuristic;
			
			// If the new item is already in the open list, no point trying
			// to so anything.
			if (! AStar.addUniqueToList(open, current)) {
				if (costs[hash] &&
					traveled < costs[hash].traveled
				) {
					costs[hash].from = from;
					costs[hash].heuristic = heuristic;
					costs[hash].traveled = traveled;
					costs[hash].toGoal = toGoal;
					
					return true;
				}
				
				return false;
			}
			
			// If the item already has a costs worked out for it then skip onto 
			// the next item.
			if (costs[hash] !== undefined) {
				return false;
			}

			// Store the costs associated with the move
			costs[hash] = {
				node: current,
				from: (from === undefined) ? false : from,
				heuristic: heuristic,
				traveled: traveled,
				toGoal: toGoal
			};
			
			return true;
		};

		/**
		 * Used to add all nodes that are networked to an element to the open array.
		 * @param 
		 * @param 
		 * @param 
		 * @param 
		 * @return void
		 */
		AStar.addChildrenToOpen = function (level, costs, open, heuristicFuncion, to, current, diameter) {
			var neighbours   = level.getNeighbours.apply(level, current),
				segment      = level.getSegment(current[0]),
				currentEdges = segment.data('edges')[current[1]],
				edgeLengths  = segment.data('edge-lengths'),
				length;
			
			// Loop over each of the neighbours, and add them to the open list
			// if they don't already exist.
			underscore.each(neighbours, function (neighbour) {
				// If the diameter is set, then check to see if the edge is
				// wide enough to support an entity of this size moving 
				// through it as it navigates this network.
				if (diameter !== undefined) {
					length = false;

					// Before we add the shape to the search, we need to first 
					// find the length of the edge joining these two shapes.
					underscore.each(currentEdges, function (edge) {
						if (edge &&
							edge[0] === neighbour[0] &&
							edge[1] === neighbour[1]
						) {
							length = edgeLengths[edge[1]][edge[2]];
						}
					});
					
					// If the diameter is greater than the length of this edge,
					// then we cannot add this network to the search.
					if (length !== false &&
						diameter > length
					) {
						return false;
					}
				}
				
				// Add the neighbouring node to the open list.
				AStar.addToSearch(
					level, 
					costs, 
					open, 
					heuristicFuncion, 
					to, 
					neighbour, 
					current
				);
			});
			
			return true;
		};

		/**
		 * Used to pick the best open node from the 
		 * @param array open Contains
		 * @param array closed Contains
		 * @param object costs Contains
		 * @return object Containing the best location to start the next search.
		 */
		AStar.pickBestFromOpen = function (open, closed, costs) {
			var bestO, bestToGoal, toGoal;
			
			// Default the values
			bestO = bestToGoal = false;
			
			underscore.each(open, function (o) {
				// Check to see if this node has already need closed.
				if (AStar.isUniqueInList(closed, o)) {
					return;
				}
				
				// Localise the distance to the goal.
				toGoal = costs[o.join(':')].toGoal;
				
				// Check to see if this toGoal value is an improvement over 
				// the previous best.
				if (bestToGoal === false || 
					bestToGoal >= toGoal
				) {
					bestO = o;
					bestToGoal = toGoal;
				}
			});
			
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

			var next, 
				hash = goal.join(':');
			
			if (costs[hash] && costs[hash].from) {
				next = costs[costs[hash].from.join(':')];
			}
			
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