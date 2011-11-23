/*global window console*/
(function (require, undefined) {
	require(
		[
			'thorny',
			'thorny!model>main',
			'thorny!level>main',
			'thorny!event'
		], 
		function (
			Thorny,
			Model,
			Level,
			event
		) {
			var world = Model.select('level')
				.factory(
					['level-segment', 'tests/fixtures/levels/poly2/001.json'],
					['level-segment', 'tests/fixtures/levels/poly2/002.json']
					)
				.triggers('level-loaded');
			
			event.bind('level-loaded', function () {
				console.log(
					world
						.getComponent('level')
						.getSegment('001')
						.getName()
					);
			});
			
			
			
		/*
		Toying with how to implement the astar system...
		
		// Create a hero for the player to control
		new Entity()
			.addComponent('player-controlled')
			.addComponent('position')
			.addComponent(
				'sprite', 
				new Entity()
					.addComponent('sprite-sheet', {
						// sprite sheet data
					})
				);
		
		// Load the level
		new Entity()
			.addComponent('level')
			.addComponent('levelSegment', 'path/to/a/level/segment.json')
			.addComponent('levelSegment', 'path/to/another/level/segment.json')
			.addComponent('pathfinder/astar')
			.addComponent('pathfinder/funnel')
			.triggers('level-loaded');
		
		// Wait for the level to be loaded
		event.bind('level-loaded', function (entity) {
			// Bind the mouse click event to control the actor
			event.bind('mouse-click', function (click) {
				// Search for the player(s)
				Entity
					.searchByComponents('player-controlled', 'position')
					.each(function (controller, position) {
						// And update their movement route
						controller.updateRoute(
							entity
								.getComponent('pathfinder/funnel')[0]
								.route(
									position,
									click
								)
						);
					});
			});
		});
		*/
		
		/*
		Model system...
		
		// Setup
		var ModelSprite = Model.extends([
			{
				component: 'sprite'
			},
			{
				component: 'rendererable'
			}
		]);
		
		var ModelHeroSprite = ModelSprite.extends({
			sprite: {
				atlas: 'hero.png',
				cellWidth: 32,
				cellHeight: 32,
				animations: {
					walk:  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
					run:   [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],
					fight: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
					die:   [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]]
				}
			},
			rendererable: {
				opacity: 1.0
			}
		});
		
		var ModelActor = Model.extends([
			{
				component: 'player-controlled',
			},
			{
				component: 'position',
				data: [
					0, 0
				]
			},
			{
				component: 'sprite',
				data: [
					ModelHeroSprite.createEntity()
				]
			}
		]);
		
		var ModelWorld = Model.extends([
			{
				component: 'level'
			},
			{
				component: 'levelSegment'
			}
		]);
		
		
		// Usage
		Actor.createEntity();
		World.createEntity({
			levelSegment: [
				[
					'path/to/a/level/segment.json'
				],
				[
					'path/to/another/level/segment.json',
					{
						name: 'another world'
					}
				]
			]
		}).triggers('level-load');
		
		event.bind('level-loaded', function (entity) {
			// Bind the mouse click event to control the actor
			event.bind('mouse-click', function (click) {
				// Search for the player(s)
				Entity
					.searchByComponents('player-controlled', 'position')
					.each(function (controller, position) {
						// And update their movement route
						controller.updateRoute(
							entity
								.getComponent('pathfinder/funnel')[0]
								.route(
									position,
									click
								)
						);
					});
			});
		});
		*/
		}
	);
}(typeof window === 'undefined' ? require('./lib/r') : require));