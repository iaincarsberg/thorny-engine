/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!event',
		'thorny!entity-system>main'
	],
	function (
		Thorny,
		event,
		Entity
	) {	
		describe('The Event Object', function () {
			it('should have the following functions', function () {
				expect(typeof Thorny.event.bind).toEqual('function');
				expect(typeof Thorny.event.trigger).toEqual('function');
				expect(typeof Thorny.event.addObserver).toEqual('function');
				expect(typeof Thorny.event.notifyObservers).toEqual('function');
				
				expect(typeof event.bind).toEqual('function');
				expect(typeof event.trigger).toEqual('function');
				expect(typeof event.addObserver).toEqual('function');
				expect(typeof event.notifyObservers).toEqual('function');
			});//it should have the following functions
			
			describe('the bind and trigger functions', function () {
				it('should allow us to bind and trigger events in the system', function () {
					var
						helloWorld = false,
						eatLotsOfCake = false,
						calls = 0;

					event.bind('hello-world', function () {
							helloWorld = true;
						});
					event.bind('eat-lots-of-cake', function () {
							eatLotsOfCake = true;
						});
					event.bind('incroment-calls', function () {
							calls += 1;
						});

					event.trigger('hello-world');
					event.trigger('eat-lots-of-cake');

					event.trigger('incroment-calls');
					event.trigger('incroment-calls');
					event.trigger('incroment-calls');
					event.trigger('incroment-calls');
					event.trigger('incroment-calls');
					event.trigger('incroment-calls');

					expect(helloWorld).toBeTruthy();
					expect(eatLotsOfCake).toBeTruthy();
					expect(calls).toEqual(6);
				});//it should allow us to bind and trigger events in the system
				
				it('it should allow us to send a 3rd paramiter, and have that be applied to the callbacks params', function () {
					var ran = false;
					event.bind('some-event-with-loads-of-params', function (one, two, three, four, five) {
						expect(one).toEqual(1);
						expect(two).toEqual(2);
						expect(three).toEqual(3);
						expect(four).toEqual(4);
						expect(five).toEqual(5);
						
						ran = true;
					});
					
					event.trigger('some-event-with-loads-of-params', false, [1, 2, 3, 4, 5]);
					
					expect(ran).toBeTruthy();
				});// it should allow us to send a 3rd paramiter, and have that be applied to the callbacks params
			});// desc the bind and trigger functions

			describe('belated events', function () {
				it('should allow us to trigger an event, then bind the listener', function () {
					/**
					 * The reasioning behind belated binding is that it keeps the 
					 * flow of the code logical, meaning you so something that 
					 * takes a while, that requires a callback.
					 * How while callbacks rock, sometimes its better to have an
					 * event that is listened to, so you can bind multiple actions
					 * to a specific event.
					 * How to validate the belated bit, say your loading a level
					 * you tell the system which levels your loading, then you
					 * process that request. Using the normal flow you'd have to
					 * have the code to handle the processing of the loaded levels
					 * before you load them, which looks odd. Belated events lets
					 * the code logically flow.
					 */
					var helloWorld = false;
					
					new Entity()
						.triggers('event:belated:1');
					
					event.bind('event:belated:1', function () {
						helloWorld = true;
					});
					
					expect(helloWorld).toBeTruthy();
				});//it should have the following functions
				
				it('it should parse any data provided into the bound callback', function () {
					var ran = false;
					new Entity()
						.triggers('event:belated:2');
					
					event.bind('event:belated:2', function (entity) {
						expect(entity instanceof Entity).toBeTruthy();
						ran = true;
					});
					
					expect(ran).toBeTruthy();
				});// it should parse any data provided into the bound callback
			});// desc belated events
		});// desc The Event Object
	}
);