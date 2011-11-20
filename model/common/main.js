/*global define*/
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
		// WET Composition - http://pastebin.com/8ANuB80x
		// DRY Model Based - http://pastebin.com/Vd6CwiBi
		
		var Model = Thorny.extend(
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
				 * Used to amend the defaults within a Model.
				 * @param object defaults Contains customisations to allow 
				 *        this Model to generate more usful instances of a 
				 *        specific object.
				 * @return this, to allow object chaining
				 */
				amendDefaults: function (defaults) {
					var model = this;
					
					underscore.each(this.data('template'), function (entry, key) {
						if (defaults[entry.component] === undefined) {
							return;
						}
						
						model.data('template')[key] = underscore.extend(
							entry,
							defaults[entry.component]
						);
					});
				},
				
				/**
				 * Used to create an instanted Entity based on this model.
				 * @param object customisations Used to customise the 
				 *        generated Entity
				 * @return Entity Containing a newly instantiated Entity based 
				 *         on the model used to create it.
				 */
				createEntity: function (customisations) {
					var entity, rules;
					
					// Default the data variable to an object.
					if (! underscore.isObject(customisations)) {
						customisations = {};
					}
					
					entity = new Entity();
					underscore.each(this.data('template'), function (entry) {
						var data;
						
						// Makesure the entry looks valid
						if (! underscore.isObject(entry) ||
							underscore.isUndefined(entry.component)
						) {
							return;
						}
						
						// Build the data array
						data = underscore.isArray(entry.data) ? entry.data : [];
						
						// Check to see if there are customisations for this 
						// entry in the template.
						if (customisations[entry.component]) {
							// It is possible for a customisation to create 
							// multiple instances of a specific component, by
							// accepting an array inplace of an object.
							rules = customisations[entry.component];
							
							// Wrap the rules in an array, so we can .each it
							if (! underscore.isArray(rules)) {
								rules = [rules];
							}
							
							underscore.each(rules, function (rule) {
								var localData;
								
								// Customise the template data for this 
								// instance of the component.
								localData = underscore.clone(data);
								underscore.each(
									rule, 
									function (value, key) {
										localData[key] = value;
									}
								);
								
								// Add a component to the entity
								entity.addComponent.apply(entity, [entry.component].concat(localData));
							});
							
						// If there are no customisations for this component, 
						// then just add it.
						} else {
							// Add a component to the entity
							entity.addComponent.apply(entity, [entry.component].concat(data));
						}
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
		
		return Model;
	}
);