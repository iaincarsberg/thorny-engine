/*global define*/
/*
Usage:

// Expanding a Template.
var LevelModel = Model.expand(
	['level', {format: 'thorny!math/poly2'}],
	['levelSegment', 'some/default/level.json', {name: 'default'}],
	['pathfindable', 'a*', 'funnel']
);

// Instantiating a Template.
instance = Level.factory(
	['levelSegment'],
	['levelSegment', 'some/cool/level.json', {name: 'first level'}],
	['levelSegment', 'another/cool/level.json', {name: 'second level'}],
	['levelSegment', 'yet/another/cool/level.json', {name: 'third level'}],
	['pathfindable', 'dijkstra']
);

*/
define(
	[
		'thorny',
		'thorny!entity-system>main',
		'cjs!underscore'
	], 
	function (
		Thorny,
		Entity,
		underscore
	) {
		var 
			// Contains the Model Constructor
			Model, 
			
			// Contains all registered Models, used for select/register
			registered = {};
		
		Model = Thorny.extend(
			function (template) {
				var validTemplates = [];
				
				// Default the template to an array
				if (template === undefined) {
					template = [];
				}
				
				// If we we're parsed an object, wrap in it an array
				if (! underscore.isArray(template)) {
					template = [template];
				}
				
				// Makesure only valid enteries get added to the template
				underscore.each(template, function (entry) {
					/*
					Implement the lazy syntax, that allows the following:
					
					Model.expand(
						['componentA', true],
						['componentB', true],
						['componentC', true],
						['levelSegment', 'some/pretty/map.json', {name: 'something cool'}]
					);
					*/
					if (underscore.isArray(entry) &&
						entry.length >= 1
					) {
						entry = {
							component: entry.shift(),
							data: entry
						};
					}
					
					if (! underscore.isObject(entry) ||
						entry.component === undefined
					) {
						return;
					}
					
					validTemplates.push(entry);
				});
				
				// Store the template
				this.data('template', validTemplates);
			},
			{
				/**
				 * Used to expand this Model, allowing users to make 
				 * customised Models which will create customised Entities.
				 * @param vararg Contains a template used to create new 
				 *        instances of the Entity object, which are based
				 *        upon this Model.
				 * @return Model Containing a newly expanded Model that 
				 *         builds upon this Model.
				 */
				expand: function () {
					var template = underscore.toArray(arguments);
					
					return new Model(
						this.data('template').concat(template)
						);
				},
				
				/**
				 * Used to create a new Entity.
				 * @param vararg Contains customisations to be applyed to the 
				 *        template prior to instantiating the Entity.
				 * @return Entity Containing the newly minted Entity, which 
				 *         contains all of the components registered by calls
				 *         to expand.
				 */
				factory: function () {
					var model, entity, container, args;
					
					model = this;
					entity = new Entity();
					args = underscore.toArray(arguments);
					
					// Make a Container for all parsed data.
					container = Model.makeComponentContainer(
						model.data('template'),
						args
					);
					
					// Build the alterations list
					underscore.each(container, function (store, component) {
						var base, alterations;
						
						base = Model.fetchComponentBase(
							component,
							model.data('template')
							);
						
						alterations = Model.fetchComponentAlterations(
							component,
							args
							);
						
						if (alterations.length === 0) {
							store.push(base);
						} else {
							underscore.each(alterations, function (alteration) {
								store.push(
									Model.applyAlteration(base, alteration)
									);
							});
						}
					});
					
					underscore.each(container, function (collection, component) {
						underscore.each(collection, function (data) {
							// Add the component
							entity.addComponent.apply(
								entity, 
								[component].concat(data)
								);
						});
					});
					
					return entity;
				}
			}
		);
		
		/**
		 * Used to expand the Model, allowing users to make customised Models
		 * which will create customised Entities.
		 * @param vararg Contains a template used to create new instances of 
		 *        the Entity object.
		 * @return Model Containing a newly expanded Model
		 */
		Model.expand = function () {
			return new Model(underscore.toArray(arguments));
		};
		
		/**
		 * Used to make a base Entity.
		 * @param void
		 * @return Entity Containing no customisation
		 */
		Model.factory = function () {
			return new Entity();
		};
		
		/**
		 * Used to build an object to house all processed components.
		 * @param Array template Contains the template
		 * @param Array args Contains arguments from the call to factory
		 * return Object that contains a list of all componets.
		 */
		Model.makeComponentContainer = function (template, args) {
			var container = {};
			
			underscore.each(template.concat(args), function (item) {
				item = underscore.clone(item);
				
				if (underscore.isArray(item) &&
					item.length > 0
				) {
					item = {
						component: item.shift(),
						data: item
					};
				}
				
				if (! underscore.isObject(item) ||
					underscore.isUndefined(item.component)
				) {
					return;
				}
				
				container[item.component] = [];
			});
			
			return container;
		};
		
		/**
		 * Used to fetch all data relating to a specific component
		 * @param string component Contains the component we're looking for.
		 * @param Array template Contains the template
		 * return Object that contains a list of all componets.
		 */
		Model.fetchComponentBase = function (component, template) {
			var base = false;
			
			// Find the base component from the template
			underscore.each(template, function (item) {
				// If the base is set, we don't need to find it
				if (base !== false) {
					return;
				}
				
				// Skip over bad data
				if (! underscore.isObject(item) ||
					underscore.isUndefined(item.component)
				) {
					return;
				}
				
				// If the data matches what we're looking for store it in the 
				// base value
				if (item.component === component &&
					underscore.isArray(item.data)
				) {
					base = item.data;
				}
			});
			
			return base;
		};
		
		/**
		 * Used to fetch any alterations relating to a specific component.
		 * @param string component Contains the component we're looking for.
		 * @param Array args Contains arguments from the call to factory
		 * return Object that contains a list of all componets.
		 */
		Model.fetchComponentAlterations = function (component, args) {
			var components = [];
			
			// Find the alterations that affect this component
			underscore.each(args, function (item) {
				var entry = underscore.clone(item);
				
				// Check to see if the component matches the required
				if (entry.shift() !== component) {
					return;
				}
				
				// Append the data
				components.push(entry);
			});
			
			return components;
		};
		
		/**
		 * Used to merge the template data with the factory params.
		 * @param Array template Contains the template data
		 * @param Array factory  Contains the factory data
		 * @return array Containing the applied alteration
		 */
		Model.applyAlteration = function (template, factory) {
			var merged = [], i, ii;

			for (i = 0, ii = Math.max(template.length, factory.length); i < ii; i += 1) {
				merged.push(
					(factory[i] ? factory[i] : template[i])
					);
			}
			
			return merged;
		};
		
		/**
		 * Used to allow models to be loaded into a collection for easy access
		 * @param string name Contains the name of a Model that has need 
		 *        requested for use
		 * @return Model Used to make an Entity
		 */
		Model.select = function (name) {
			return registered[name];
		};
		
		/**
		 * Used to register Models with so they can be accessed via the select 
		 * system above.
		 * @oaram string name Contains the name of the provided model
		 * @param Model model Contains a Model
		 * @return void
		 */
		Model.register = function (name, model) {
			registered[name] = model;
		};
		
		return Model;
	}
);