/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny!observer/observer'
	],
	function (
		observer
	) {
		describe('observer', function () {
			it('should have the following functions', function () {
				var
					item = {},
					processed = observer(item);

				expect(item).toEqual(processed);
				expect(typeof item.notify).toEqual('function');
				
				/*
				describe('notify', function () {
					it('should call the notified function', function () {
						var 
							ran = false,
							item = $('thorny core observer')({
								dance: function () {
									ran = true;
								}
							});

						expect(item.notify('dance')).toBeTruthy();
						expect(ran).toBeTruthy();
					});// it should call the notified function

					it('shouldnt error if an event is called that isnt within the observer object', function () {
						var 
							ran = true,
							item = $('thorny core observer')({});

						expect(item.notify('dance')).toBeFalsy();
						expect(ran).toBeTruthy();
					});// it shouldnt error if an event is called that isnt within the observer object

					it('should surpress any errors', function () {
						var 
							errored = false,
							item = $('thorny core observer')({
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
							item = $('thorny core observer')({
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
				*/
			});// it should have the following functions
		});// desc observer
	}
);