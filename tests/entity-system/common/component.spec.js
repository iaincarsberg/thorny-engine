/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!entity-system>main',
		'cjs!underscore',
		
		// Add some fixture componets to make testing possible.
		'thorny!tests/fixtures>entity-system>helloworld.component',
		'thorny!tests/fixtures>entity-system>generic.component',
		'thorny!tests/fixtures>entity-system>unique_component_a.component',
		'thorny!tests/fixtures>entity-system>unique_component_b.component',
		'thorny!tests/fixtures>entity-system>unique_component_c.component',
		'thorny!tests/fixtures>entity-system>component_a.component'
	],
	function (
		Thorny,
		Entity,
		underscore
	) {
		describe('The Entity-System Base Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					expect(typeof Entity.registerComponent).toEqual('function');
					expect(typeof Entity.searchByComponents).toEqual('function');
					expect(typeof Entity.componentExists).toEqual('function');
					expect(typeof Entity.listRegisteredComponents).toEqual('function');
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('registerComponent', function () {
						it('should add a component to the component list', function () {
							Entity.registerComponent('registerComponent:add:a', function () {});
							Entity.registerComponent('registerComponent:add:b', function () {});
							Entity.registerComponent('registerComponent:add:c', function () {});
							
							var list = Entity.listRegisteredComponents();
							
							expect(list).toContain('registerComponent:add:a');
							expect(list).toContain('registerComponent:add:b');
							expect(list).toContain('registerComponent:add:c');
							expect(list).toNotContain('registerComponent:add:d');
							expect(list).toNotContain('registerComponent:add:e');
							expect(list).toNotContain('registerComponent:add:f');
						});// it should add a component to the component list

						it('should contain the following functions', function () {
							Entity.registerComponent('registerComponent:contains:a', function () {
								return {
									hello: 'world',
									isUnique: true
								};
							});

							var entity = new Entity();
							entity.addComponent('registerComponent:contains:a');
							
							expect(entity.hasComponent('registerComponent:contains:a')).toBeTruthy();
							expect(typeof entity.getComponent('registerComponent:contains:a')[0]).toEqual('object');
							expect(typeof entity.getComponent('registerComponent:contains:a')[0].hello).toEqual('string');
							expect(entity.getComponent('registerComponent:contains:a')[0].hello).toEqual('world');
						});// should contain the following functions

						it("shouldn't allow a component to be registered with the same name", function () {
							Entity.registerComponent('registerComponent:unique:a', function () {});

							try {
								Entity.registerComponent('registerComponent:unique:a', function () {});
								expect(false).toBeTruthy();

							} catch (e) {
								expect(e.message).toEqual('Entity.registerComponent failed because "registerComponent:unique:a" is already set.');
								expect(true).toBeTruthy();
							}
						});// it shouldn't allow a component to be registered with the same name
					});// desc registerComponent
					
					describe('searchByComponents', function () {
						it('should have the following functions', function () {
							Entity.registerComponent('searchByComponents:1', function (entity) {
								return {
									name: 'searchByComponents:1',
									isUnique: true,
									attach: function (pass) {
										return true;
									}
								};
							});
							
							new Entity().addComponent('searchByComponents:1');
							
							expect(Entity.searchByComponents('searchByComponents:1') instanceof Array).toBeTruthy();
							expect(typeof Entity.searchByComponents('searchByComponents:1')).toEqual('object');
							expect(typeof Entity.searchByComponents('searchByComponents:1').length).toEqual('number');
							expect(typeof Entity.searchByComponents('searchByComponents:1').each).toEqual('function');
							expect(typeof Entity.searchByComponents('searchByComponents:1').first).toEqual('function');
						});//it should have the following functions

						it("should preform a simple map operation and return the result", function () {
							Entity.registerComponent('searchByComponents:2', function (entity) {
								return {
									name: 'searchByComponents:2',
									isUnique: true,
									attach: function (pass) {
										return true;
									}
								};
							});
							
							var 
								i,	// Used for loop control
								ii,	// Used for loop control as a limit
								results,
								e01 = new Entity().addComponent('searchByComponents:2'),
								e02 = new Entity().addComponent('searchByComponents:2'),
								e03 = new Entity().addComponent('searchByComponents:2'),
								e04 = new Entity().addComponent('searchByComponents:2'),
								e05 = new Entity().addComponent('searchByComponents:2'),
								e06 = new Entity().addComponent('searchByComponents:2'),
								e07 = new Entity().addComponent('searchByComponents:2'),
								e08 = new Entity().addComponent('searchByComponents:2'),
								e09 = new Entity().addComponent('searchByComponents:2'),
								e10 = new Entity().addComponent('searchByComponents:2');
							
							results = Entity.searchByComponents('searchByComponents:2');

							// Makesure there are 10 results
							expect(results.length).toMatch(10);
							
							expect(results[0]).toMatch(e01);
							expect(results[1]).toMatch(e02);
							expect(results[2]).toMatch(e03);
							expect(results[3]).toMatch(e04);
							expect(results[4]).toMatch(e05);
							expect(results[5]).toMatch(e06);
							expect(results[6]).toMatch(e07);
							expect(results[7]).toMatch(e08);
							expect(results[8]).toMatch(e09);
							expect(results[9]).toMatch(e10);
						});// it should preform a simple map operation and return the result

						it("should preform a more complex map operation and return the result", function () {
							underscore.each(['a', 'b', 'c'], function (key) {
								Entity.registerComponent('searchByComponents:3:' + key, function (entity) {
									return {
										name: 'searchByComponents:3:' + key,
										isUnique: true,
										attach: function (pass) {
											return true;
										}
									};
								});
							});
							
							var
								entityA = new Entity()
									.addComponent('searchByComponents:3:a'),
								entityAB = new Entity()
									.addComponent('searchByComponents:3:a')
									.addComponent('searchByComponents:3:b'),
								entityABC = new Entity()
									.addComponent('searchByComponents:3:a')
									.addComponent('searchByComponents:3:b')
									.addComponent('searchByComponents:3:c'),
								entityBC = new Entity()
									.addComponent('searchByComponents:3:b')
									.addComponent('searchByComponents:3:c'),
								entityC = new Entity()
									.addComponent('searchByComponents:3:c');

							expect(Entity.searchByComponents('searchByComponents:3:a').length)
								.toMatch(3);
							expect(Entity.searchByComponents('searchByComponents:3:b').length)
								.toMatch(3);
							expect(Entity.searchByComponents('searchByComponents:3:c').length)
								.toMatch(3);
							expect(Entity.searchByComponents('searchByComponents:3:a', 'searchByComponents:3:b').length)
								.toMatch(2);
							expect(Entity.searchByComponents('searchByComponents:3:b', 'searchByComponents:3:a').length)
								.toMatch(2);
							expect(Entity.searchByComponents('searchByComponents:3:a', 'searchByComponents:3:c').length)
								.toMatch(1);
							expect(Entity.searchByComponents('searchByComponents:3:c', 'searchByComponents:3:a').length)
								.toMatch(1);
							expect(Entity.searchByComponents('searchByComponents:3:b', 'searchByComponents:3:c').length)
								.toMatch(2);
							expect(Entity.searchByComponents('searchByComponents:3:c', 'searchByComponents:3:b').length)
								.toMatch(2);
							expect(Entity.searchByComponents('searchByComponents:3:a', 'searchByComponents:3:b', 'searchByComponents:3:c').length)
								.toMatch(1);
							expect(Entity.searchByComponents('searchByComponents:3:b', 'searchByComponents:3:a', 'searchByComponents:3:c').length)
								.toMatch(1);
							expect(Entity.searchByComponents('searchByComponents:3:c', 'searchByComponents:3:b', 'searchByComponents:3:a').length)
								.toMatch(1);
						});// it should preform a more complex map operation and return the result

						describe('has an each function', function () {
							it("should map the required compoents into the each callback, testing with only unique componets", function () {
								underscore.each(['a', 'b', 'c'], function (key) {
									Entity.registerComponent('searchByComponents:each:unique:' + key, function (entity) {
										return {
											name: 'component ' + key,
											isUnique: true,
											attach: function (pass) {
												return true;
											}
										};
									});
								});
								
								var entites, e1, e2;
								e1 = new Entity()
									.tag('entity 1')
									.addComponent('searchByComponents:each:unique:a')
									.addComponent('searchByComponents:each:unique:b')
									.addComponent('searchByComponents:each:unique:c');
								e2 = new Entity()
									.tag('entity 2')
									.addComponent('searchByComponents:each:unique:a')
									.addComponent('searchByComponents:each:unique:b')
									.addComponent('searchByComponents:each:unique:c');
									
								entites = ['entity 1', 'entity 2'];
								Entity
									.searchByComponents('searchByComponents:each:unique:a')
									.each(function (a) {
										expect(Entity.getTag(entites.shift()).id)
											.toEqual(this.id);

										expect(a.name)
											.toEqual('component a');
									});
									
								entites = ['entity 1', 'entity 2'];
								Entity
									.searchByComponents('searchByComponents:each:unique:a', 'searchByComponents:each:unique:b')
									.each(function (a, b) {
										expect(Entity.getTag(entites.shift()).id)
											.toEqual(this.id);

										expect(a.name)
											.toEqual('component a');
										expect(b.name)
											.toEqual('component b');
									});

								entites = ['entity 1', 'entity 2'];
								Entity
									.searchByComponents('searchByComponents:each:unique:a', 'searchByComponents:each:unique:b', 'searchByComponents:each:unique:c')
									.each(function (a, b, c) {
										expect(Entity.getTag(entites.shift()).id)
											.toEqual(this.id);

										expect(a.name)
											.toEqual('component a');
										expect(b.name)
											.toEqual('component b');
										expect(c.name)
											.toEqual('component c');
									});
							});// should map the required compoents into the each callback, testing with only unique componets
							
							it("should map the required compoents into the each callback, testing with only non-unique componets", function () {
								underscore.each(['a', 'b', 'c'], function (key) {
									Entity.registerComponent('searchByComponents:each:non-unique:' + key, function (entity) {
										return {
											name: 'component ' + key,
											isUnique: false,
											attach: function (pass) {
												return true;
											}
										};
									});
								});
								
								var entites, tag, e1, e2;
								e1 = new Entity()
									.tag('entity 1')
									.addComponent('searchByComponents:each:non-unique:a')
									.addComponent('searchByComponents:each:non-unique:a')
									.addComponent('searchByComponents:each:non-unique:b')
									.addComponent('searchByComponents:each:non-unique:b')
									.addComponent('searchByComponents:each:non-unique:c')
									.addComponent('searchByComponents:each:non-unique:c');
								e2 = new Entity()
									.tag('entity 2')
									.addComponent('searchByComponents:each:non-unique:a')
									.addComponent('searchByComponents:each:non-unique:a')
									.addComponent('searchByComponents:each:non-unique:a')
									.addComponent('searchByComponents:each:non-unique:b')
									.addComponent('searchByComponents:each:non-unique:b')
									.addComponent('searchByComponents:each:non-unique:b')
									.addComponent('searchByComponents:each:non-unique:c')
									.addComponent('searchByComponents:each:non-unique:c')
									.addComponent('searchByComponents:each:non-unique:c');
									
								entites = [{name: 'entity 1', count: 2}, {name: 'entity 2', count: 3}];
								Entity
									.searchByComponents('searchByComponents:each:non-unique:a')
									.each(function (a) {
										tag = entites.shift();
										expect(Entity.getTag(tag.name).id)
											.toEqual(this.id);

										expect(a.length).toEqual(tag.count);
										expect(typeof a.each).toEqual('function');
										
										a.each(function (comp) {
											expect(comp.name).toEqual('component a');
										});
									});
									
								entites = [{name: 'entity 1', count: 2}, {name: 'entity 2', count: 3}];
								Entity
									.searchByComponents('searchByComponents:each:non-unique:a', 'searchByComponents:each:non-unique:b')
									.each(function (a, b) {
										tag = entites.shift();
										expect(Entity.getTag(tag.name).id)
											.toEqual(this.id);

										expect(a.length).toEqual(tag.count);
										expect(b.length).toEqual(tag.count);
										expect(typeof a.each).toEqual('function');
										expect(typeof b.each).toEqual('function');
										
										a.each(function (comp) {
											expect(comp.name).toEqual('component a');
										});
										b.each(function (comp) {
											expect(comp.name).toEqual('component b');
										});
									});

								entites = [{name: 'entity 1', count: 2}, {name: 'entity 2', count: 3}];
								Entity
									.searchByComponents('searchByComponents:each:non-unique:a', 'searchByComponents:each:non-unique:b', 'searchByComponents:each:non-unique:c')
									.each(function (a, b, c) {
										tag = entites.shift();
										expect(Entity.getTag(tag.name).id)
											.toEqual(this.id);

										expect(a.length).toEqual(tag.count);
										expect(b.length).toEqual(tag.count);
										expect(c.length).toEqual(tag.count);
										expect(typeof a.each).toEqual('function');
										expect(typeof b.each).toEqual('function');
										expect(typeof c.each).toEqual('function');
										
										a.each(function (comp) {
											expect(comp.name).toEqual('component a');
										});
										b.each(function (comp) {
											expect(comp.name).toEqual('component b');
										});
										c.each(function (comp) {
											expect(comp.name).toEqual('component c');
										});
									});
							});// should map the required compoents into the each callback, testing with only non-unique componets
						});// desc has an each function

						describe('has a first function', function () {
							it("should map the required compoents into the each callback", function () {
								underscore.each(['a', 'b', 'c'], function (key) {
									Entity.registerComponent('searchByComponents:first:' + key, function (entity) {
										return {
											name: 'component ' + key,
											isUnique: true,
											attach: function (pass) {
												return true;
											}
										};
									});
								});
								
								var runs = 0;
								new Entity()
									.tag('entity 1')
									.addComponent('searchByComponents:first:a')
									.addComponent('searchByComponents:first:b')
									.addComponent('searchByComponents:first:c');
								new Entity()
									.tag('entity 2')
									.addComponent('searchByComponents:first:a')
									.addComponent('searchByComponents:first:b')
									.addComponent('searchByComponents:first:c');

								Entity
									.searchByComponents('searchByComponents:first:a')
									.first(function (a) {
										expect(Entity.getTag('entity 1').id)
											.toEqual(this.id);
										expect(a.name)
											.toEqual('component a');

										runs += 1;
									});
								
								expect(runs).toEqual(1);
							});// it should preform a more complex map operation and return the result
						});// desc has an each function
					});// desc searchByComponents
					
					describe('componentExists', function () {
						it('it return true, only if a component exists', function () {
							Entity.registerComponent('componentExists:a', function () {});
							Entity.registerComponent('componentExists:b', function () {});
							Entity.registerComponent('componentExists:c', function () {});

							expect(Entity.componentExists('componentExists:a')).toBeTruthy();
							expect(Entity.componentExists('componentExists:b')).toBeTruthy();
							expect(Entity.componentExists('componentExists:c')).toBeTruthy();
							expect(Entity.componentExists('componentExists:d')).toBeFalsy();
							expect(Entity.componentExists('componentExists:e')).toBeFalsy();
							expect(Entity.componentExists('componentExists:f')).toBeFalsy();
						});// it return true, only if a component exists
					});// desc componentExists
					
					describe('listRegisteredComponents', function () {
						it('it should return a list of components that exist', function () {
							Entity.registerComponent('listRegisteredComponents:a', function () {});
							Entity.registerComponent('listRegisteredComponents:b', function () {});
							Entity.registerComponent('listRegisteredComponents:c', function () {});

							var list = Entity.listRegisteredComponents();

							expect(list).toContain('listRegisteredComponents:a');
							expect(list).toContain('listRegisteredComponents:b');
							expect(list).toContain('listRegisteredComponents:c');
							expect(list).toNotContain('listRegisteredComponents:d');
							expect(list).toNotContain('listRegisteredComponents:e');
							expect(list).toNotContain('listRegisteredComponents:f');
						});// it should return a list of components that exist
					});// desc listRegisteredComponents
				});
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should add the following functions to the entity', function () {
					expect(typeof new Entity().addComponent).toEqual('function');
					expect(typeof new Entity().getComponent).toEqual('function');
					expect(typeof new Entity().hasComponent).toEqual('function');
					expect(typeof new Entity().listComponents).toEqual('function');
				});// it should add the following functions to the entity
				
				describe('has the following function,', function () {
					describe('addComponent', function () {
						it('should add an entry in the local entities object the first time an entity has a component added', function () {
							var entity = new Entity();
							entity.addComponent('generic');
							
							expect(entity.hasComponent('generic')).toBeTruthy();
							expect(typeof entity.getComponent('generic')[0]).toEqual('object');
							expect(typeof entity.getComponent('generic')[0].dance).toEqual('function');
							expect(entity.getComponent('generic')[0].attach).toBeUndefined();
							expect(entity.getComponent('generic')[0].dance()).toEqual('put your left leg in, take your left leg out, in, out, in, out, shake it all about');
							expect(entity.getComponent('generic')[0].name).toEqual('generic component');
						});//it should add an entry in the local entities object the first time an entity has a component added

						it('should add a new known component', function () {
							var entity = new Entity();
							
							// Add component a to the entity
							entity.addComponent('uniqueComponentA');
							expect(entity.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(entity.hasComponent('uniqueComponentB')).toBeFalsy();
							expect(entity.hasComponent('uniqueComponentC')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentA')[0].name).toEqual('component a');
							expect(entity.getComponent('uniqueComponentB')[0]).toBeFalsy();
							expect(entity.getComponent('uniqueComponentC')[0]).toBeFalsy();
							
							// Add component b to the entity
							entity.addComponent('uniqueComponentB');
							expect(entity.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(entity.hasComponent('uniqueComponentB')).toBeTruthy();
							expect(entity.hasComponent('uniqueComponentC')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentA')[0].name).toEqual('component a');
							expect(entity.getComponent('uniqueComponentB')[0].name).toEqual('component b');
							expect(entity.getComponent('uniqueComponentC')[0]).toBeFalsy();

							// Add component c to the entity
							entity.addComponent('uniqueComponentC');
							expect(entity.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(entity.hasComponent('uniqueComponentB')).toBeTruthy();
							expect(entity.hasComponent('uniqueComponentC')).toBeTruthy();
							expect(entity.getComponent('uniqueComponentA')[0].name).toEqual('component a');
							expect(entity.getComponent('uniqueComponentB')[0].name).toEqual('component b');
							expect(entity.getComponent('uniqueComponentC')[0].name).toEqual('component c');
						});//it should add a new known component

						it("shouldn't allow an 'isUnique' component to be added multiple times", function () {
							var entity = new Entity();
							
							// Add component a to the entity
							entity.addComponent('uniqueComponentA');
							expect(entity.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(entity.getComponent('uniqueComponentA')[0].name).toEqual('component a');

							// Try to add a second unique a...
							try {
								entity.addComponent('uniqueComponentA');
								expect(false).toBeTruthy();

							} catch (e) {
								expect(e.message).toEqual('entity.addComponent(uniqueComponentA, "[]"); is unique, can cannot be added multiple times to one entity');
								expect(true).toBeTruthy();
							}
						});// it shouldn't allow an 'isUnique' component to be added multiple times

						it("should allow an '!isUnique' component to be added multiple times", function () {
							var entity = new Entity();
							
							// Add component a to the entity
							entity.addComponent('componentA');
							entity.addComponent('componentA');
							entity.addComponent('componentA');
							
							expect(entity.hasComponent('componentA')).toBeTruthy();
							expect(typeof entity.getComponent('componentA')).toEqual('object');
							expect(entity.getComponent('componentA').length).toEqual(3);
							expect(entity.getComponent('componentA')[0].name).toEqual('element a');
							expect(entity.getComponent('componentA')[1].name).toEqual('element a');
							expect(entity.getComponent('componentA')[2].name).toEqual('element a');
						});// it should allow an '!isUnique' component to be added multiple times

						it("should wrap an 'inUnique' component in an array at the 0th index", function () {
							var entity = new Entity();
							
							// Add component a to the entity
							entity.addComponent('uniqueComponentA');
							expect(entity.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(typeof entity.getComponent('uniqueComponentA')).toEqual('object');
							expect(entity.getComponent('uniqueComponentA').length).toEqual(1);
							expect(entity.getComponent('uniqueComponentA')[0].name).toEqual('component a');
						});// it should wrap an 'inUnique' component in an array at the 0th index
						
						it("should append '!inUnique' components at the correct incromenting index", function () {
							var 
								i,	// Used for loop control
								entity = new Entity();
								
							// Add component a to the entity
							for (i = 1; i <= 3; i += 1) {
								entity.addComponent('componentA');
								
								expect(entity.hasComponent('componentA')).toBeTruthy();
								expect(typeof entity.getComponent('componentA')).toEqual('object');
								expect(entity.getComponent('componentA').length).toEqual(i);
								expect(entity.getComponent('componentA')[i - 1].name).toEqual('element a');
							}
						});// it should append '!inUnique' components at the correct incromenting index
						
						it("should't add a new component to the entity if the entity is marked as a template", function () {
							var entity = new Entity(Entity.TEMPLATE)
								.addComponent('uniqueComponentA')
								.addComponent('uniqueComponentB')
								.addComponent('uniqueComponentC')
								.addComponent('componentA')
								.addComponent('componentA')
								.addComponent('componentA');
							
							expect(entity.listComponents().length).toEqual(0);
							expect(entity.listTemplate().length).toEqual(6);
						});// it should't add a new componet to the entity if the entity is marked as a template
					});// desc addComponent
					
					describe('getComponent', function () {
						it('it should return an instance of Array', function () {
							var entity = new Entity()
								.addComponent('componentA')
								.addComponent('uniqueComponentA');
							
							expect(entity.getComponent('componentA') instanceof Array).toBeTruthy();
							expect(entity.getComponent('uniqueComponentA') instanceof Array).toBeTruthy();
						});// it should return an instance of Array
						
						it("should return the attached unique component in an array on length 1", function () {
							var entity = new Entity()
								.addComponent('uniqueComponentA')
								.addComponent('uniqueComponentB')
								.addComponent('uniqueComponentC');

							expect(typeof entity.getComponent('uniqueComponentA')).toEqual('object');
							expect(typeof entity.getComponent('uniqueComponentA')[0]).toEqual('object');
							expect(typeof entity.getComponent('uniqueComponentB')[0]).toEqual('object');
							expect(typeof entity.getComponent('uniqueComponentC')[0]).toEqual('object');
							
							expect(entity.getComponent('uniqueComponentA').length).toEqual(1);
							expect(entity.getComponent('uniqueComponentB').length).toEqual(1);
							expect(entity.getComponent('uniqueComponentC').length).toEqual(1);
							
							expect(entity.getComponent('uniqueComponentA')[0].name).toEqual('component a');
							expect(entity.getComponent('uniqueComponentB')[0].name).toEqual('component b');
							expect(entity.getComponent('uniqueComponentC')[0].name).toEqual('component c');
							
							expect(entity.getComponent('uniqueComponentD')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentD').data).toBeFalsy();
							
							expect(entity.getComponent('uniqueComponentE')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentE').data).toBeFalsy();
						});// it should return the attached unique component in an array on length 1

						it("should return multiple non-unique components of the same type", function () {
							var entity = new Entity()
								.addComponent('componentA')
								.addComponent('componentA')
								.addComponent('componentA');

							expect(typeof entity.getComponent('componentA')).toEqual('object');
							expect(entity.getComponent('componentA').length).toEqual(3);
							expect(entity.getComponent('uniqueComponentA')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentB')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentC')).toBeFalsy();
						});// it should return multiple non-unique components of the same type.

						it("should return false when there are no components of the requested type attached", function () {
							var entity = new Entity();

							expect(entity.getComponent('componentA')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentA')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentB')).toBeFalsy();
							expect(entity.getComponent('uniqueComponentC')).toBeFalsy();
						});// it should return false when there are no components of the requested type attached

						it('should return an each function, that allows us to iterate over the collection easily', function () {
							var 
								ran = 0,
								entity = new Entity()
									.addComponent('componentA', 0)
									.addComponent('componentA', 1)
									.addComponent('componentA', 2);
							
							entity
								.getComponent('componentA')
								.each(function (item) {
									expect(item.name).toEqual('element a');
									expect(item.someUniqueValue).toMatch(ran);
									
									ran += 1;
								});
							
							expect(ran).toMatch(3);
						});// it should return an each function, that allows us to iterate over the collection easily
					});// desc getComponent
					
					describe('hasComponent', function () {
						it("should return true when a module has a specific component", function () {
							var entity = new Entity()
								.addComponent('uniqueComponentA')
								.addComponent('uniqueComponentB')
								.addComponent('uniqueComponentC')
								.addComponent('componentA')
								.addComponent('componentA')
								.addComponent('componentA');

							expect(entity.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(entity.hasComponent('uniqueComponentB')).toBeTruthy();
							expect(entity.hasComponent('uniqueComponentC')).toBeTruthy();
							expect(entity.hasComponent('componentA')).toBeTruthy();
						});// it should return true when a module has a specific component

						it("should return false when a module isn't attached to an entity", function () {
							var entity = new Entity();

							expect(entity.hasComponent('uniqueComponentA')).toBeFalsy();
							expect(entity.hasComponent('uniqueComponentB')).toBeFalsy();
							expect(entity.hasComponent('uniqueComponentC')).toBeFalsy();
							expect(entity.hasComponent('componentA')).toBeFalsy();
						});// it should return false when a module isn't attached to an entity
					});// desc hasComponent
					
					describe('listComponents', function () {
						it('it should return a list of attached components', function () {
							var entity = new Entity(), list;
							
							entity.addComponent('componentA');
							entity.addComponent('uniqueComponentA');
							entity.addComponent('uniqueComponentB');
							entity.addComponent('uniqueComponentC');
							
							list = entity.listComponents();
							
							expect(list).toContain('componentA');
							expect(list).toContain('uniqueComponentA');
							expect(list).toContain('uniqueComponentB');
							expect(list).toContain('uniqueComponentC');
						});// it should return a list of attached components
						
						it('it should return a list of attached components', function () {
							var entity = new Entity(), list;
							
							entity.addComponent('componentA');
							entity.addComponent('componentA');
							entity.addComponent('componentA');
							entity.addComponent('componentA');
							entity.addComponent('uniqueComponentA');
							
							list = entity.listComponents();
							
							expect(list).toContain('componentA');
							expect(list).toContain('uniqueComponentA');
							expect(list).toNotContain('uniqueComponentB');
							expect(list).toNotContain('uniqueComponentC');
						});// it should return a list of attached components
					});// desc hasComponent
				});// desc has the following function
			});// desc once instantiated
		});// desc The Entity-System Base Object
	}
);