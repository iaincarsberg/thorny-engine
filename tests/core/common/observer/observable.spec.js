/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny!observer/observable'
	],
	function (
		observable
	) {	
		describe('the observable class', function () {
			it('should add the following functions', function () {
				var 
					item = {},
					processed = observable(item);
				
				expect(item).toEqual(processed);
				expect(typeof item.addObserver).toEqual('function');
				expect(typeof item.notifyObservers).toEqual('function');
			});//it	should add the following functions
			
			describe('has the following functions,', function () {
				describe('addObserver', function () {
					it('should add an observer to its internal collection', function () {
						var 
							hasRan = false,
							subject = {
								onRegister: function () {
									hasRan = true;
								},
								notify: function (eventName, observable) {
									if (typeof this[eventName] === 'function') {
										try {
											this[eventName](observable);
										} catch (e) {
											// Do nothing
										}
									}
								}
							},
							o = observable({});
						
						o.addObserver(subject);
						expect(hasRan).toBeTruthy();
					});// it should add an observer to its internal collection
					
					it("shouldn't add an observer to its internal collection, because the subject has no notify function", function () {
						var 
							hasntRan = true,
							subject = {
								onRegister: function () {
									hasntRan = false;
								}
							},
							o = observable({});
						
						o.addObserver(subject);
						expect(hasntRan).toBeTruthy();	
					});// it shouldn't add an observer to its internal collection, because the subject has no notify function
					
					it('should surpress any errors', function () {
						var 
							subject = {
								onRegister: function () {
									throw new Error('Surpressed error!!!');
								},
								notify: function (eventName, observable) {
									if (typeof this[eventName] === 'function') {
										try {
											this[eventName](observable);
										} catch (e) {
											// Do nothing
										}
									}
								}
							},
							o = observable({});
						
						try {
							o.addObserver(subject);
							expect(true).toBeTruthy();
							
						} catch (e) {
							expect(false).toBeTruthy();
						}
					});// it should surpress any errors
				});//desc addObserver
				
				describe('notifyObservers', function () {
					it('should add an observer to its internal collection', function () {
						var 
							hasRan = false,
							subject = {
								dance: function () {
									hasRan = true;
								},
								notify: function (eventName, observable) {
									if (typeof this[eventName] === 'function') {
										try {
											this[eventName](observable);
										} catch (e) {
											// Do nothing
										}
									}
								}
							},
							o = observable({});

						o.addObserver(subject);
						expect(hasRan).toBeFalsy();	
						o.notifyObservers('dance');
						expect(hasRan).toBeTruthy();	
					});// it should add an observer to its internal collection
				});//desc notifyObservers
			});// desc has the following functions,
		});// desc observable
	}
);