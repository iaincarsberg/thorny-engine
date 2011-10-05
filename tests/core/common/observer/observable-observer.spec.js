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
		});//desc observer and observerable interaction
	}
);