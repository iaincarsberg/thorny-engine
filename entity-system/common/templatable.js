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
		var templates = {}, components = {};
		
		/**
		 * Used to add the ability to create entity templates, allowing for
		 * complex objects to be made in rough, then instantiated as needed.
		 * @param object instance Contains a hook to inject functionality into
		 * each and every new Entity();
		 * @param object system Contains a hook in inject functionality into
		 * the entity-system
		 * @return void
		 */
		return function (instance, system) {
			/**
			 * Contains any defines that need to be applied to the Entity object.
			 * @var object 
			 */
			var defines = {
				template: '0x01',
				concrete: '0x02'
			};
			
			instance.augment(function (entity, Entity) {
				Compose.call(
					entity,
					{
						/**
						 * This will flag an entity as being a template, if useTag is 
						 * called on a none templated entity it will fail.
						 * What this does is bacisally prevents 'addComponent' from
						 * functioning normally, so rarther than adding components
						 * directly to the entity, it builds a list of calls made to
						 * 'addComponent' so they can be replayed when 'concrete' is 
						 * called at a later point.
						 * @param void
						 * @return this Allowing for object chaining
						 */
						makeTemplate: function () {
							templates[this.getId()] = true;
							return this;
						},

						/**
						 * Used to see if an entity is a template
						 * @param void
						 * @return boolean
						 */
						isTemplate: function () {
							if (templates[this.getId()] !== undefined) {
								return templates[this.getId()];
							}
							return false;
						},

						/**
						 * Used to add items to a template.
						 * @param string component Contains the name of a component to
						 * append to this template
						 * @param object options Contains component specific options
						 * @return boolean if template was added
						 */
						appendTemplate: function (component, options) {
							// We only want to append a template if we are a template.
							if (! this.isTemplate()) {
								return false;
							}

							// Makesure instanciate the components list for this 
							// entity.
							if (components[this.getId()] === undefined) {
								components[this.getId()] = [];
							}

							// And append the component
							components[this.getId()].push({
								name: component,
								options: options
							});

							return true;
						},
						
						/**
						 * Returns a list of all attached components on a 
						 * template
						 * @param void
						 * @return array Containing a list of template 
						 * attached components.
						 */
						listTemplate: function () {
							var 
								i, 
								ii = (components[this.getId()]) ? components[this.getId()].length : 0, 
								list = [];
							for (i = 0, ii; i < ii; i += 1) {
								list.push(
									components[this.getId()][i].name
								);
							}
							return list;
						},

						/**
						 * Used to turn a template entity into a real entity.
						 * @param string tag Contains a tag that is linked to a
						 * template entity. 
						 * @return this Allowing for object chaining
						 */
						useTag: function (tag) {
							underscore.include(arguments, defines.concrete);
							
							var 
								//makeConcrete = $.hasDefined('concrete', arguments),
								makeConcrete = underscore.include(arguments, defines.concrete),
								componentToUse = [];
							
							tag = Entity.getTag(tag);

							// If the relationship between the two tags is invalid get
							// us out of here asap.
							//
							//  If the tag doesn't exist it can't be used
							//  ! tag
							//
							//  If the $.defined('concrete') argument is used then the
							//  tag MUST be a template.
							//  (
							//      makeConcrete && 
							//      ! tag.isTemplate()
							//  )
							//
							//  If the $.defined('concrete') ISNT sent, then both this
							//  and the tag MUST be templates.
							//  (
							//      ! makeConcrete && 
							//      (
							//          ! this.isTemplate() || 
							//          ! tag.isTemplate()
							//      )
							//  )
							// )
							if (! tag ||
								(
									makeConcrete && 
									! tag.isTemplate()
								) ||
								(
									! makeConcrete && 
									(
										! this.isTemplate() || 
										! tag.isTemplate()
									)
								)
							) {
								return false;
							}
							
							// Concat the tag components into the local variable
							if (components[tag.getId()] !== undefined) {
								componentToUse = componentToUse.concat(components[tag.getId()]);
							}

							// Concat the this components into the local variable
							if (components[this.getId()] !== undefined) {
								componentToUse = componentToUse.concat(components[this.getId()]);
							}

							// And put the local variable back in the components.
							components[this.getId()] = componentToUse;

							// Make 'this' a concrete entity.
							if (makeConcrete) {
								this.concrete();
							}

							return this;
						},

						/**
						 * This follows on from isTemplate and useTag, once a template
						 * has been created and useTag'ed the entity needs to have the
						 * 'concrete' function called to turn the list of calls to 
						 * 'addComponent' into active components.
						 * @param void
						 * @return this Allowing for object chaining
						 */
						concrete: function () {
							var 
								i, // for loop current
								ii,// for loop limit
								component,
								componentToUse = components[this.getId()];

							// Remove the template tag from this entity.
							templates[this.getId()] = undefined;

							for (i = 0, ii = componentToUse.length; i < ii; i += 1) {
								component = componentToUse[i];
								if (component.name === undefined) {
									continue;
								}

								if (typeof component.options === 'function') {
									this.addComponent(component.name, component.options());

								} else {
									this.addComponent(component.name, component.options);
								}
							}

							return this;
						}
					}
				);
			});// instance.augment
			
			instance.instantiated(function (entity, args, Entity) {
				// If a user calls new Entity(Entity.TEMPLATE); then we need
				// to turn this entity into a template.
				if (underscore.contains(args, Entity.TEMPLATE)) {
					entity.makeTemplate();
				}
			});// instance.instantiated
			
			/*
			We may need to check contants inside the module, and with no 
			reference to the Entity object, we have to localise the data.
			
			This function takes the localised defines variable, and explodes
			it into the Entity object.
			*/ 
			(function () {
				var key;
				for (key in defines) {
					if (defines.hasOwnProperty(key)) {
						system.augment(key.toUpperCase(), defines[key]);
					}
				}
			}());
		};
	}
);