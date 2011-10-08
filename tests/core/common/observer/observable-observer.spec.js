/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny!observer/observable',
		'thorny!observer/observer'
	],
	function (
		observable,
		observer
	) {
		describe('observer and observerable interaction', function () {
			it('should allow an observable to execute code in an observer', function () {
				var
					hasRegistered = false,
					hasDanced = false,
					stalker = observer({
						onRegister: function () {
							hasRegistered = true;
						},
						dance: function () {
							hasDanced = true;
						}
					}),
					victim = observable({
						
					});
				
				victim.addObserver(stalker);
				victim.notifyObservers('dance');
				
				expect(hasRegistered).toBeTruthy();
				expect(hasDanced).toBeTruthy();
			});//it should allow an observable to execute code in an observer
			
			it('should call the observers notifyHandler if something goes wrong', function () {
				var
					hasErrored = false,
					stalker = observer({
						onRegister: function () {
							throw new Error('Managed error!!!');
						},
						notifyHandler: function (e) {
							hasErrored = true;
							expect(e.message).toEqual('Managed error!!!');
						}
					}),
					victim = observable({
						
					});
				
				victim.addObserver(stalker);
				victim.notifyObservers('dance');
				
				expect(hasErrored).toBeTruthy();
			});// it should call the observers notifyHandler if something goes wrong
			
			
			describe('notifyObservers', function () {
				it('should return the correct number of triggered observers', function () {
					var
						victim = observable({}),
						observerA = observer({
							a: function () {}
						}),
						observerB = observer({
							a: function () {},
							b: function () {}
						}),
						observerC = observer({
							a: function () {},
							b: function () {},
							c: function () {}
						});
						
					victim.addObserver(observerA);
					victim.addObserver(observerB);
					victim.addObserver(observerC);
					
					expect(victim.notifyObservers('a')).toEqual(3);
					expect(victim.notifyObservers('b')).toEqual(2);
					expect(victim.notifyObservers('c')).toEqual(1);
					
				});// it should return the correct number of triggered observers
			});// desc notifyObservers
			
			describe('the observers ability to observe an observable', function () {
				it('should show an observer observing an observable', function () {
					var 
						warnings = 0,
						arrested = false,
						police = observer({
							thatWereDealingWithAPeepingTom: function () {
								arrested = true;
							}
						}),
						stalker = observer({
							youveBeenCaughtPeeping: function () {
								// Have the police create a file on this 
								// vial stalker.
								police.observe(this);
								
								// Warn the perp
								warnings += 1;
								
								// If he's been warn to often, then deal with 
								// him :)
								if (warnings >= 3) {
									this.notifyObservers('thatWereDealingWithAPeepingTom');
								}
							}
						}),
						victim1 = observable({}),
						victim2 = observable({}),
						victim3 = observable({});

					// Observe the entites, so we can catch there deletion.
					stalker
						.observe(victim1)
						.observe(victim2)
						.observe(victim3);
					
					victim1.notifyObservers('youveBeenCaughtPeeping');
					expect(arrested).toBeFalsy();
					
					victim2.notifyObservers('youveBeenCaughtPeeping');
					expect(arrested).toBeFalsy();
					
					victim3.notifyObservers('youveBeenCaughtPeeping');
					expect(arrested).toBeTruthy();

					expect(warnings).toMatch(3);
					
					
				});// it should show an observer observing an observable
			});// desc the observers ability to observe an observable
		});//desc observer and observerable interaction
	}
);