/*global define*/
define(
	[
		'thorny',
		'thorny!observer/observer',
		'thorny!observer/observable'
	], 
	function (
		Thorny,
		observer,
		observable
	) {
		if (Thorny.event) {
			return Thorny.event;
		}
		
		var Event = Thorny.extend(
			function () {
				// Make events observable.
				observable(this);

				// Sometimes you may went to trigger an event before its been 
				// bound this is where belated comes in to the rescue.
				this.data('belated', {});
			},
			{
				/**
				 * Used to bind to an event
				 * @param string|object eventType Contains the type of the event that 
				 * we're expecting to be called, and we want to respond to.
				 * @param function callback Contains the code that is executed when an
				 * event is triggered
				 * @reutrn void
				 */
				bind: function (eventType, callback) {
					var data = {};
					data[eventType] = callback;

					this.addObserver(
						observer(data)
						);

					// Check to see if there is a belated event we need to trigger.
					if (this.data('belated')[eventType]) {
						this.data('belated')[eventType] = undefined;
						this.trigger(eventType);
					}
				},

				/**
				 * Used to trigger an event
				 * @param string eventType Contains the type of event being triggered
				 * @param boolean|undefined belatable True if this event is belatable,
				 *        otherwise False|undefined
				 * @param optional array data Contains event specific data
				 * @param optional object context Contains the object that 
				 *        will be refered to as 'this' from the observer scope.
				 * @return void
				 */
				trigger: function (eventType, belatable, data) {
					var executed = this.notifyObservers(eventType, data);

					// If no events we're triggered then we have a belated event.
					if (belatable === true && executed === 0) {
						this.data('belated')[eventType] = true;
					}
				}
			}
		);
		
		// Create a new instance of the event class, and bind it to the main 
		// thorny class.
		Thorny.event = new Event();
		return Thorny.event;
	}
);