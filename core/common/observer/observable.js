/*global define*/
define(
	[
		'thorny',
		'compose'
	], 
	function (
		Thorny,
		Compose
	) {
		/**
		 * Used to make an object observable
		 * @param object subject Contains an object that wants to be observed
		 * @return void
		 */
		return function (subject) {
			// The observable object requires functionality provided Thorny, 
			// so if we're not dealing with an instance, we need to mixin the
			// thorny logic.
			if (! subject.isThorny) {
				subject = Compose.call(subject, new Thorny());
			}
			
			// Make the subject aware of anything observing it
			subject.data('observers', []);
			
			return Compose.call(subject, {
				/**
				 * Used to flag that this object is observable, if another 
				 * object tries to observe an unobservable object, then we 
				 * would need to make that object observable.
				 *     if (! object.isObservable) {
				 *       observable(object);
				 *     }
				 * @var boolean true
				 */
				isObservable: true,
				
				/**
				 * Used to allow other observers to observe us
				 * @param object o Contains an object that is observing us
				 * @return void
				 */
				addObserver: function (o) {
					if ((typeof o === 'function' || typeof o === 'object') && typeof o.notify === 'function') {
						this.data('observers').push(o);

						// Notify the observer that we just added them.
						try {
							o.notify('onRegister', this);

						} catch (e) {
							// Do nothing.
						}
					}
				},

				/**
				 * Used to notify any observers
				 * @param string eventName Contains the type of event that just 
				 * happened.
				 * @return int Containing the number of executed events
				 */
				notifyObservers: function (eventName) {
					var
						executed = 0, // Contains the number of executed observers
						i,			  // Used for loop control
						ii,			  // Used for loop delimiting
						observers = this.data('observers');
						
					for (i = 0, ii = observers.length; i < ii; i += 1) {
						// We dont want any of the observers to break the 
						// chain of update, so we surpress any errors.
						try {
							// Notify the observers
							if (observers[i].notify(eventName, this)) {
								// If something was notified then incroment  
								// the executed counter.
								executed += 1;
							}

						} catch (e) {
							// Do nothing.
						}
					}
					return executed;
				}
			});
		};
	}
);