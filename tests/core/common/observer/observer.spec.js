/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny!observer/observer'
	],
	function (
		observer
	) {
		describe('the observer class', function () {
			it('should have the following functions', function () {
				var
					item = {},
					processed = observer(item);

				expect(item).toEqual(processed);
				expect(typeof item.notify).toEqual('function');
			});// it should have the following functions
			
			describe('has the following functions,', function () {
				describe('notify', function () {
					it('should call the notified function', function () {
						var 
							ran = false,
							item = observer({
								dance: function () {
									ran = true;
								}
							});

						expect(item.notify('dance')).toBeTruthy();
						expect(ran).toBeTruthy();
					});// it should call the notified function

					it("shouldn't error if an event is called that isnt within the observer object", function () {
						var 
							ran = true,
							item = observer({});

						expect(item.notify('dance')).toBeFalsy();
						expect(ran).toBeTruthy();
					});// it shouldn't error if an event is called that isnt within the observer object

					it('should surpress any errors', function () {
						var 
							errored = false,
							item = observer({
								dance: function () {
									throw new Error('Surpressed error!!!');
								}
							});

						try {
							expect(item.notify('dance')).toBeFalsy();
							expect(true).toBeTruthy();

						} catch (e) {
							expect(false).toBeTruthy();
						}
					});// it should surpress any errors

					it('should execute the notifyHandler if one is set, and an exception is encountered', function () {
						var 
							ran = false,
							item = observer({
								throwsError: function () {
									throw new Error('Surpressed error!!!');
								},
								notifyHandler: function (e) {
									expect(e.message).toEqual('Surpressed error!!!');
									ran = true;
								}
							});

						expect(item.notify('throwsError')).toBeTruthy();
						expect(ran).toBeTruthy();
					});// it should execute the notifyHandler if one is set, and an exception is encountered
				});// desc notify
			});// desc has the following functions,
		});// desc observer
	}
);