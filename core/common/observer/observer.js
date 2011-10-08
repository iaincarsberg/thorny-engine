/*global define*/
define(
	[
		'compose',
		'thorny!observer/observable'
	], 
	function (
		Compose,
		makeObservable
	) {
		/**
		 * Allows an object to observe another object
		 * @param object subject Contains an object that wants to observe 
		 * another object
		 * @return void
		 */
		return function (subject) {
			return Compose.call(subject, {
				/**
				 * Used to observe another object.
				 * @param observable observable Contains an observable object
				 * @return this, to allow object chaining
				 */
				observe: function (observable) {
					// If our target isn't observable then make it... 
					//      ...(but only if its actually an object)...
					if (typeof observable === 'object' &&
						! observable.isObservable
					) {
						makeObservable(observable);
					}
					
					observable.addObserver(this);
					return this;
				},
				
				/**
				 * Used to execute an event on the observer
				 * @param string eventName Contains the name of the triggered event
				 * @param object observable Contains the thing we're looking at
				 * @return void
				 */
				notify: function (eventName, observable) {
					// If our target isn't observable then make it... 
					//      ...(but only if its actually an object)...
					if (typeof observable === 'object' &&
						! observable.isObservable
					) {
						makeObservable(observable);
					}
					
					if (typeof this[eventName] === 'function') {
						// We dont want any of the observer to break anything not
						// related to it, so we surpress any errors.
						try {
							this[eventName](observable);
							return true;
						} catch (e) {
							// Surpress any errors that are caused by our
							// handler function.
							try {
								// Check to see if we have a handler to handle
								// any errors that happen, if we do then
								// execute it.
								if (typeof this.notifyHandler === 'function') {
									this.notifyHandler(e);
									return true;
								}

							} catch (ee) {
								// Do nothing.
							}
						}
					}
					return false;
				}
			});
		};
	}
);