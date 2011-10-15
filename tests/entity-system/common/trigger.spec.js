/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!entity-system>main',
		'thorny!event'
	],
	function (
		Thorny,
		Entity,
		event
	) {	
		describe('The Entity-Systems Trigger Component', function () {
			it('should trigger an event within the event chain call', function () {
				var called = 0;
				
				new Entity()
					.triggers('entity:trigger:chained:1')
					.triggers('entity:trigger:chained:2')
					.triggers('entity:trigger:chained:3');
				
				event.bind('entity:trigger:chained:1', function () {
					called += 1;
				});
				expect(called).toEqual(1);
				
				event.bind('entity:trigger:chained:2', function () {
					called += 1;
				});
				expect(called).toEqual(2);
				
				event.bind('entity:trigger:chained:3', function () {
					called += 1;
				});
				expect(called).toEqual(3);
			});// it should trigger an event within the event chain call
		});// desc The Entity-System Base Object
	}
);