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
				it('it should have the following functions', function () {
					var e = new Entity();
					
					expect(typeof e.getId).toEqual('function');
					expect(typeof e.remove).toEqual('function');
				});// it should have the following functions
				
				describe('getId', function () {
					it('it should return an incromenting id', function () {
						var
							e1 = new Entity(),
							e2 = new Entity(),
							e3 = new Entity();
						
						expect(e1.getId() + 1).toEqual(e2.getId());
						expect(e1.getId() + 2).toEqual(e3.getId());
						expect(e2.getId() + 1).toEqual(e3.getId());
					});// it should return an incromenting id
				});// desc getId
				
				describe('remove', function () {
					describe('it should call the listening entityRemoved listener', function () {
						var 
							runs = 0,
							removalChecker,
							e1 = new Entity(),
							e2 = new Entity(),
							e3 = new Entity();
						
						removalChecker = observer({
							entityRemoved: function (entity) {
								expect(entity instanceof Entity).toBeTruthy();
								
								// This is the wrong way around, but we're 
								// making an array of allowable results, and
								// checking to see if our returned id is 
								// within the allowed range.
								expect([e1.getId(), e2.getId(), e3.getId()])
									.toContain(entity.getId());

								runs += 1;
							}
						});

						// Observe the entites, so we can catch there deletion.
						removalChecker
							.observe(e1)
							.observe(e2)
							.observe(e3);
						
						e1.remove();
						e2.remove();
						e3.remove();

						expect(runs).toMatch(3);
					});// it should call the listening entityRemoved listener
				});// desc remove
			});// desc once instantiated
		});// desc The Entity-System Base Object
	}
);