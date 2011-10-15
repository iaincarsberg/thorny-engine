/*global define*/
define(
	[
		'compose',
		'thorny',
		'cjs!underscore'
	], 
	function (
		Compose,
		Thorny,
		underscore
	) {
		var 
			components = {},
			entityComponent = {};
		
		/**
		 * Used to allow components to be added to an entity. Components are
		 * used to apply specific functionality to a new Entity().
		 * @param object instance Contains a hook to inject functionality into
		 * each and every new Entity();
		 * @param object system Contains a hook in inject functionality into
		 * the entity-system
		 * @return void
		 */
		return function (instance, system) {
			instance.augment(function (entity) {
				Compose.call(
					entity,
					{
						/**
						 * Used to add components to this entity
						 * @param string name Contains the name of a component that is
						 * to be added to this entity
						 * @param vararg Contains component specific options or a
						 * concrete entity.
						 * @return this Allowing for object chaining
						 */
						addComponent: function (name) {
							var 
								component = components[name],
								options = Array.prototype.slice.call(arguments);

							// Remove the name of the vararg
							options.shift();
							
							if (component === undefined) {
								throw new Error(
									'entity.addComponent(' + name + ', "' + 
									JSON.stringify(options) + '"); is unknown'
								);
							}
							
							// Invoke the new component.
							component = component(entity);
							
							if (component === undefined) {
								throw new Error(
									'entity.addComponent(' + name + ', "' + 
									JSON.stringify(options) + '"); "' + name + 
									'" is not a correctly defined component.'
								);
							}
							
							// If a component is unique then it can only be added once.
							if (component.isUnique !== undefined &&
								component.isUnique && 
								this.hasComponent(name)
							) {
								throw new Error(
									'entity.addComponent(' + name + ', "' + 
									JSON.stringify(options) + '"); is unique, can cannot be added multiple times to one entity'
								);
							}

							// If we're dealing with a template then we don't want to
							// store any additional component data.
							if (this.isTemplate && this.isTemplate()) {
								this.appendTemplate(name, options);
								return this;
							}
							
							// If the component instance has an attach 
							// function, then run it
							if (component.attach) {
								// If the component === false then it means it 
								// wasn't attached to the entity.
								if (component.attach.apply(component, options) === false) {
									throw new Error(
										'entity.addComponent(' + name + ', "' + JSON.stringify(options) + '"); Failed to attach to the entity.'
									);
								}

								// Remove the attach method from the component.
								delete component.attach;
							}

							// If this is the first component to be added to an entity
							// then we need to crate an object for them to be stored
							// inside of.
							if (entityComponent[this.getId()] === undefined) {
								entityComponent[this.getId()] = {};
							}

							// Insert the component into the entities collection;
							if (component.isUnique) {
								// Store the component
								entityComponent[this.getId()][name] = component;

							} else {
								// Check to see if this item exists, if it doesn't 
								// make an empty array, then push the new item into it.
								if (entityComponent[this.getId()][name] === undefined) {
									entityComponent[this.getId()][name] = [];
								}
								entityComponent[this.getId()][name].push(component);
							}

							// object chaining hoooo
							return this;
						},// addComponent
						
						/**
						 * Used to get a component attached to an entity
						 * @param string name Contains the name of a component that is
						 * already attached to an entity, but we want to access
						 * @return object Containing the component
						 */
						getComponent: function (name) {
							if (entityComponent[this.getId()] !== undefined &&
								entityComponent[this.getId()][name] !== undefined
							) {
								var 
									response, 
									data = entityComponent[this.getId()][name];
								
								if (typeof data === 'object' &&
									data.length === undefined
								) {
									response = [data];
									
								} else {
									response = data;
								}
								
								return Compose.call(response, {
									each: function (callback) {
										var i, ii;
										for (i = 0, ii = this.length; i < ii; i += 1) {
											callback(this[i]);
										}
									}
								});
							}
							
							return false;
						},//getComponent
						
						/**
						 * Used to see if a component has a specific entity
						 * @param string name Contains the name of the entity
						 * @return boolean True if the entity has a specific component
						 */
						hasComponent: function (name) {
							return typeof this.getComponent(name) === 'object';
						},// hasComponent
						
						/**
						 * Used to list all attached components for this entity.
						 * @param void
						 * @return array Contains all attached components
						 */
						listComponents: function () {
							var key, 
								list = [], 
								attached = entityComponent[this.getId()];
							
							for (key in attached) {
								if (attached.hasOwnProperty(key)) {
									list.push(key);
								}
							}
							return list;
						}//listComponents
					}
				);
			});
			
			/**
			 * Used to register a component with the component entity-system
			 * @param string name Contains the name of the newly registered 
			 * component
			 * @param object factory Contains code to create a new instance of
			 * a component.
			 * @return this, to allow object chaining
			 */
			system.augment('registerComponent', function (name, factory) {
				if (components[name] !== undefined) {
					throw new Error('Entity.registerComponent failed because "' + name + '" is already set.');
				}
				
				components[name] = factory;
				return this;
			});
			
			/**
			 * Used to search for a list of entities that have the 
			 * required components.
			 * @param vararg Contains the names of components that may be
			 * attached to entities.
			 * @return array of Entities that have the reqested component
			 */
			system.augment('searchByComponents', function () {
				var 
					that = this,
					varargs = underscore.toArray(arguments),
					collection;
				
				// Build a list of entities that contain all of the components.
				collection = underscore
					.map(
						entityComponent,
						function (c, entity_id) {
							return that.getEntity(entity_id);
						})
					.reduce(function (collection, entity, id) {
						var valid = true;
						underscore.each(
							varargs,
							function (requirement) {
								if (! valid) {
									return;
								}
								
								valid = entity.hasComponent(requirement);
							});
						
						if (valid) {
							collection.push(entity);
						}
						
						return collection;
					}, []);
				
				return Compose.call(
					collection,
					{
						/**
						 * Used to allow easy process of attached data.
						 * @param function callback Called on each item 
						 * within the return component list.
						 * @return void
						 */
						each: function (callback) {
							underscore.each(this, function (entity) {
								var params = [], component;
								underscore.each(varargs, function (required) {
									component = entity.getComponent(required);
									if (component.length === 1) {
										component = component[0];
									}
									params.push(component);
								});
								callback.apply(entity, params);
							});
						},

						/**
						 * Used to allow easy access to the first item in
						 * the collection
						 * @param function callback Called on the first 
						 * item within the return component list.
						 * @return void
						 */
						first: function (callback) {
							if (this.length === 0) {
								return;
							}
							
							var params = [], entity = this[0];
							underscore.each(varargs, function (required) {
								component = entity.getComponent(required);
								if (component.length === 1) {
									component = component[0];
								}
								params.push(component);
							});
							callback.apply(entity, params);
						}
					});
			});
			
			/**
			 * Used to find all entities with a specific component.
			 * @param void
			 * @return this, to allow object chaining
			 */
			system.augment('componentExists', function (name) {
				return components[name] !== undefined;
			});
			
			/**
			 * Used to return a list of known components
			 * @param void
			 * @return array Containing a list of registed components
			 */
			system.augment('listRegisteredComponents', function () {
				var key, list = [];
				
				for (key in components) {
					if (components.hasOwnProperty(key)) {
						list.push(key);
					}
				}
				return list;
			});
		};
	}
);