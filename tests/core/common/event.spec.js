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
						.triggers('event:belated');
					
					event.bind('event:belated', function () {
						helloWorld = true;
					});
					
					expect(helloWorld).toBeTruthy();
				});//it should have the following functions
			});// desc belated events
		});// desc The Event Object
	}
);