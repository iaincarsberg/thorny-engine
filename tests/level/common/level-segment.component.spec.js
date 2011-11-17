/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!entity-system>main',
		'thorny!level>main',
		'thorny!event'
	],
	function (
		Thorny,
		Entity,
		Level,
		event
	) {	
		describe('The Level Base Object', function () {
			var ran = false;
			new Entity()
				.addComponent(
					'level'
					)
				.addComponent(
					'level-segment', 
					'tests/fixtures/levels/poly2/001.json'
					)
				.addComponent(
					'level-segment', 
					'tests/fixtures/levels/poly2/002.json'
					)
				.triggers('loaded');
			
			event.bind('loaded', function (entity, data) {
				entity.remove();
				
				ran = true;
			});
			
			waitsFor(function () {
				return ran;
			});
		});// desc The Level Base Object
	}
);