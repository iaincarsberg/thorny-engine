/*global define*/
define(
	[
		'require',
		'thorny',
		'thorny!observer/observer',
		'thorny!observer/observable',
		
		'thorny!entity-system>tag',
		'thorny!entity-system>component'
	], 
	function (
		require,
		Thorny,
		observer,
		observable,
		Tag,
		Component
	) {
		var main, entities = [], augments = [], addons = [];
		
		// Add the addons to the list...
		addons.push(Tag);
		addons.push(Component);
		
		main = Thorny.extend(
			function () {
				// Create a unique entity id
				this.data('id', entities.length);
				
				// Make this entity observable
				observable(this);
				
				// Apply the augments to the new entity
				var i, ii;
				for (i = 0, ii = augments.length; i < ii; i += 1) {
					augments[i](this);
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
					this.notifyObservers('entityRemoved');
					entities[this.data('id')] = undefined;
				}
			}
		);
		
		/**
		 * Used to get an entity based on its id from the collection.
		 * @param int entityId Contains an entity id
		 * @return object Containing an entity
		 */
		main.getEntity = function (id) {
			return (entities[id]) ? entities[id] : false;
		};
		
		// Create a closure to handle the addons.
		(function (addons) {/*using arguments*/
			var i, ii, augmentEntity, augmentSystem;
			
			augmentEntity = {
				/**
				 * Used to augment an entity
				 * @param Constructor Mixin Contains the mixin functionality
				 * @return void
				 */
				augment: function (mixin) {
					augments.push(function (entity) {
						mixin(entity);
					});
				}
			};
			
			augmentSystem = {
				/**
				 * Used to augment the system
				 * @param string name Contains the name of the functionality
				 * @param function functionality Contains the functionality
				 * @return void
				 */
				augment: function (name, functionality) {
					if (main[name] !== undefined) {
						throw new Error("Cannot replace existing entity-system functionality, '" + name + "'");
					}
					
					main[name] = functionality;
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
		
		return main;
	}
);