/*global define*/
define(
	[
		'require',
		'thorny',
		'thorny!observer/observer',
		'thorny!observer/observable',
		'cjs!underscore',
		
		// Addons
		'thorny!entity-system>tag',
		'thorny!entity-system>component',
		'thorny!entity-system>templatable',
		'thorny!entity-system>trigger',
		
		// Components
		'thorny!entity-system>flow-js-handle.component'
	], 
	function (
		require,
		Thorny,
		observer,
		observable,
		underscore
	) {
		var i, ii, Main, entities = [], augments = [], completers = [], addons = [];
		
		// Catch all the addon arguments
		for (i = 5, ii = arguments.length; i < ii; i += 1) {
			addons.push(arguments[i]);
		}
		
		// Produce the main object
		Main = Thorny.extend(
			function () {
				// Create a unique entity id
				this.data('id', entities.length);
				
				// Make this entity observable
				observable(this);
				
				// Apply the augments to the new entity
				var i, ii, args = underscore.toArray(arguments);
				for (i = 0, ii = augments.length; i < ii; i += 1) {
					augments[i](this);
				}
				
				// Apply any completion checks, these, are called after an 
				// entity has been augmented, allowing the system to check for
				// specific internal states, and run required code against 
				// them. Was designed to manage stuff like 
				//   new Entity(Entity.TEMPLATE)
				// which should execute code to make this entity a template 
				// automatically, and without further involvement.
				for (i = 0, ii = completers.length; i < ii; i += 1) {
					completers[i](this, args);
				}
				
				// Store a reference of this entity in the private store.
				entities.push(this);
			},
			{
				/**
				 * Used to expose the entites id
				 * @param void
				 * @return int Containing the unique entity id
				 */
				getId: function () {
					return this.data('id');
				},
				
				/**
				 * Used to remove an entity.
				 * @param void
				 * @return void
				 * @triggers entityRemoved
				 */
				delete: function () {
					this.notifyObservers('entityRemoved', entities[this.data('id')]);
					
					delete entities[this.data('id')];
				}
			}
		);
		
		/**
		 * Used to get an entity based on its id from the collection.
		 * @param int entityId Contains an entity id
		 * @return object Containing an entity
		 */
		Main.getEntity = function (id) {
			return (entities[id]) ? entities[id] : false;
		};
		
		// Create a closure to handle the addons.
		(function (addons) {
			var i, ii, augmentEntity, augmentSystem;
			
			/**
			 * Utility object, to make a nice and tidy api for the component 
			 * system's implementation
			 */
			augmentEntity = {
				/**
				 * Used to augment an entity
				 * @param Constructor Mixin Contains the mixin functionality
				 * @return void
				 */
				augment: function (mixin) {
					augments.push(function (entity) {
						mixin(entity, Main);
					});
				},
				
				/**
				 * Called when an object is instantiated
				 * @param function callback, called upon instantiation
				 * @return void
				 */
				instantiated: function (callback) {
					completers.push(function (entity, args) {
						callback(entity, args, Main);
					});
				},
				
				/**
				 * Used to bind a callback, that listens to the deletion of an
				 * entity within the system
				 * @param function callback, called upon deletion
				 * @return void
				 */
				delete: function (callback) {
					completers.push(function (entity) {
						// Create a new observer, and bind the callback into 
						// it, then observe the entity.
						observer({
							entityRemoved: callback
						}).observe(entity);
					});
				}
			};
			
			/**
			 * Utility object, to make a nice and tidy api for the component 
			 * system's implementation
			 */
			augmentSystem = {
				// Drop the whole entity into the system augmenter, encase we
				// need direct access to it ever.
				Entity: Main,
				
				/**
				 * Used to augment the system
				 * @param string name Contains the name of the functionality
				 * @param function functionality Contains the functionality
				 * @return void
				 */
				augment: function (name, functionality) {
					if (Main[name] !== undefined) {
						throw new Error("Cannot replace existing entity-system functionality, '" + name + "'");
					}
					
					Main[name] = functionality;
				}
			};
			
			// Loop over all of the files that reside within files.js
			for (i = 0, ii = addons.length; i < ii; i += 1) {
				addons[i](
					augmentEntity,
					augmentSystem
					);
			}
		}(addons));
		
		return Main;
	}
);