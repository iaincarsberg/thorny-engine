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
		 * Used to find a path through a loaded Level.
		 * @var object from Contains the origin
		 * @var object to Contains the destination
		 * @return Array Containing a list of refernces to LevelSegments 
		 *         within the Level
		 */
		AStar.route = function (from, to) {};
		
		return AStar;
	}
);