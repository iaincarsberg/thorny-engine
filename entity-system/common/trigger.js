/*global define*/
define(
	[
		'compose',
		'thorny',
		'thorny!event',
		'cjs!underscore'
	], 
	function (
		Compose,
		Thorny,
		event,
		underscore
	) {
		var postponeTrigger = {};
		
		/**
		 * Used to allow entities to be tagged, and retived via the applied 
		 * access tag.
		 * @param object instance Contains a hook to inject functionality into
		 * each and every new Entity();
		 * @param object system Contains a hook in inject functionality into
		 * the entity-system
		 * @return void
		 */
		return function (instance, system) {
			/**
			 * Used to create a system to tag entities, allowing easy and 
			 * quick recall.
			 * @param Entity entity Contains an entity.
			 */
			instance.augment(function (entity) {
				Compose.call(
					entity,
					{
						/**
						 * Used to trigger an event once async operations have been 
						 * completed.
						 * @param string varargs Contains the event names we're 
						 * wanting to trigger once a chain of operations has completed.
						 * @return this to allow object chaining
						 */
						triggers: function () {
							underscore.each(underscore.toArray(arguments), function (arg) {
								event.trigger(arg, true);
							});
							return this;
							
							/*
							// The code below is possibly a remenent of the 
							// old way of doing things, I've kept in here in
							// case it isn't.
							// Basically this code was used to trigger a 
							// belated event when an entity needs to preform
							// multiple chains async operations.
							// Using a promise library "should" make this void
							var
								i,
								ii,
								events, 
								args = underscore.toArray(arguments);
							
							if (postponeTrigger[this.getId()] === undefined ||
								postponeTrigger[this.getId()].count === 0
							) {
								// Trigger the realtime event
								underscore.each(args, function (arg) {
									event.trigger(arg, true);
								});

							} else {
								events = postponeTrigger[this.getId()].events;

								// Store the belatable event
								underscore.each(args, function (arg) {
									if (! underscore.include(events, arg)) {
										events.push(arg);
									}
								});
							}

							return this;
							*/
						}// triggers
					}
				);
			});
		};
	}
);