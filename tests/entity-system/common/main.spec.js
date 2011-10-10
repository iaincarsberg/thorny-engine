/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!entity-system>main',
		'thorny!entity-system>tag',
		'thorny!observer/observer'
	],
	function (
		Thorny,
		Entity,
		Tag,
		observer
	) {
		describe('The Entity-System Base Object', function () {
			it('should have the following functions', function () {
				expect(typeof Entity).toEqual('function');
				expect(typeof Entity.getEntity).toEqual('function');
				expect(typeof Entity.getTag).toEqual('function');
			});//it should have the following functions
			
			describe('during instantiation', function () {
				it('should create a unique id per entity', function () {
					// We crate an instance, so we're not assuming this is the
					// first test to run that creates an Entity. 
					var first = new Entity().data('id');
					
					// Check the entities
					expect(new Entity().data('id')).toEqual(first + 1);
					expect(new Entity().data('id')).toEqual(first + 2);
					expect(new Entity().data('id')).toEqual(first + 3);
					expect(new Entity().data('id')).toEqual(first + 4);
					expect(new Entity().data('id')).toEqual(first + 5);
				});// it should create a unique id per entity
				
				it('should create an observable entity', function () {
					var e = new Entity();
					
					expect(e.isObservable).toBeTruthy();
				});// it should create an observable entity
			});// desc during instantiation
			
			describe('once instantiated', function () {
				describe('it should be removeable', function () {
					var 
						runs = 0,
						removalChecker,
						e1 = new Entity(),
						e2 = new Entity(),
						e3 = new Entity();
					
					removalChecker = observer({
						entityRemoved: function () {
							runs += 1;
						}
					});
					
					// Observe the entites, so we can catch there deletion.
					removalChecker
						.observe(e1)
						.observe(e2)
						.observe(e3);
					
					e1.delete();
					e2.delete();
					e3.delete();
					
					expect(runs).toMatch(3);
					
				});// it should be removeable
			});// desc once instantiated
		});// desc The Entity-System Base Object
	}
);