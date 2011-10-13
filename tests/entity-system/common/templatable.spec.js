/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!entity-system>main'
	],
	function (
		Thorny,
		Entity
	) {
		describe('The Entity-System Base Object', function () {
			describe('before instantiation', function () {
				it('it should have the following flags', function () {
					expect(Entity.TEMPLATE).toEqual('0x01');
					expect(Entity.CONCRETE).toEqual('0x02');
				});// it should have the following flags
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should have the following functions', function () {
					var entity = new Entity();
					
					expect(typeof entity.makeTemplate).toEqual('function');
					expect(typeof entity.isTemplate).toEqual('function');
					expect(typeof entity.appendTemplate).toEqual('function');
					expect(typeof entity.useTag).toEqual('function');
					expect(typeof entity.concrete).toEqual('function');
					
					entity.useTag(Entity.CONCRETE);
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('makeTemplate', function () {
						it('should allow entities to be made into templates', function () {
							var
								e1 = new Entity(),
								e2 = new Entity(),
								e3 = new Entity(),
								e4 = new Entity(),
								e5 = new Entity();

							e1.makeTemplate();
							e2.makeTemplate();
							e3.makeTemplate();
							
							expect(e1.isTemplate()).toBeTruthy();
							expect(e2.isTemplate()).toBeTruthy();
							expect(e3.isTemplate()).toBeTruthy();
							expect(e4.isTemplate()).toBeFalsy();
							expect(e5.isTemplate()).toBeFalsy();
						});//it should allow entities to be made into templates
					});// desc makeTemplate
					
					describe('isTemplate', function () {
						it('it should tell if an entity is a template', function () {
							var
								e1 = new Entity(),
								e2 = new Entity(),
								e3 = new Entity(),
								e4 = new Entity(),
								e5 = new Entity(),
								e6 = new Entity(Entity.TEMPLATE),
								e7 = new Entity(Entity.TEMPLATE),
								e8 = new Entity(Entity.TEMPLATE);

							e1.makeTemplate();
							e2.makeTemplate();
							e3.makeTemplate();

							expect(e1.isTemplate()).toBeTruthy();
							expect(e2.isTemplate()).toBeTruthy();
							expect(e3.isTemplate()).toBeTruthy();
							expect(e4.isTemplate()).toBeFalsy();
							expect(e5.isTemplate()).toBeFalsy();
							expect(e6.isTemplate()).toBeTruthy();
							expect(e7.isTemplate()).toBeTruthy();
							expect(e8.isTemplate()).toBeTruthy();
						});// it should tell if an entity is a template
					});// desc isTemplate

					describe('appendTemplate', function () {
						it("should store the components name in the stored object", function () {
							var
								hello = new Entity(Entity.TEMPLATE)
									.tag('hello'),
								world = new Entity(Entity.TEMPLATE)
									.tag('world'),
								e1 = new Entity(Entity.TEMPLATE),
								e2 = new Entity(Entity.TEMPLATE),
								e3 = new Entity(),
								e4 = new Entity(),
								e5 = new Entity();

							e3.makeTemplate();
							
							Entity.registerComponent('appendTemplate:storing:hello', function () {});
							Entity.registerComponent('appendTemplate:storing:world', function () {});
							
							expect(e1.appendTemplate('appendTemplate:storing:hello')).toBeTruthy();
							expect(e2.appendTemplate('appendTemplate:storing:world')).toBeTruthy();
							expect(e3.appendTemplate('appendTemplate:storing:hello')).toBeTruthy();
							expect(e4.appendTemplate('appendTemplate:storing:world')).toBeFalsy();
							expect(e5.appendTemplate('appendTemplate:storing:hello')).toBeFalsy();
							
							expect(e1.listTemplate().length).toEqual(1);
							expect(e2.listTemplate().length).toEqual(1);
							expect(e3.listTemplate().length).toEqual(1);
							expect(e4.listTemplate().length).toEqual(0);
							expect(e5.listTemplate().length).toEqual(0);
							
							expect(e1.listTemplate()).toContain('appendTemplate:storing:hello');
							expect(e2.listTemplate()).toContain('appendTemplate:storing:world');
							expect(e3.listTemplate()).toContain('appendTemplate:storing:hello');
						});//it should store the components name in the stored object
					});// desc appendTemplate

					describe('useTag', function () {
						it('should only be possible to add the following input permutations', function () {
							var
								e1 = new Entity(Entity.TEMPLATE),
								e2 = new Entity(),
								e3 = new Entity(Entity.TEMPLATE),
								e4 = new Entity(),
								e5 = new Entity(Entity.TEMPLATE),
								e6 = new Entity(),
								e7 = new Entity(Entity.TEMPLATE),
								e8 = new Entity();

							// Define us some entities to use.
							new Entity(Entity.TEMPLATE).tag('use');
							new Entity().tag('dont-use');

							// Templates can use other templates
							expect(e1.useTag('use')).toBeTruthy();
							expect(e2.useTag('use')).toBeFalsy();

							// Nothing can use a non-template
							expect(e3.useTag('dont-use')).toBeFalsy();
							expect(e4.useTag('dont-use')).toBeFalsy();

							// Templates can use templates, as can non-templates
							expect(e5.useTag('use', Entity.CONCRETE)).toBeTruthy();
							expect(e6.useTag('use', Entity.CONCRETE)).toBeTruthy();

							// Nothing can use a non-template
							expect(e7.useTag('dont-use', Entity.CONCRETE)).toBeFalsy();
							expect(e8.useTag('dont-use', Entity.CONCRETE)).toBeFalsy();
						});//it should only be possible to add the following input permutations

						it('should allow templates that extends other templates to concat a list of used components', function () {
							Entity.registerComponent('useTag:a', function () {
								return {
									isUnique: true
								};
							});	
							Entity.registerComponent('useTag:b', function () {
								return {
									isUnique: true
								};
							});	
							Entity.registerComponent('useTag:c', function () {
								return {
									isUnique: true
								};
							});	
							Entity.registerComponent('useTag:d', function () {
								return {
									isUnique: true
								};
							});	
							Entity.registerComponent('useTag:e', function () {
								return {
									isUnique: true
								};
							});
							Entity.registerComponent('useTag:f', function () {
								return {
									isUnique: true
								};
							});
							
							new Entity(Entity.TEMPLATE)
								.tag('first')
								.addComponent('useTag:a')
								.addComponent('useTag:c')
								.addComponent('useTag:e');
							
							new Entity(Entity.TEMPLATE)
								.useTag('first')
								.tag('second')
								.addComponent('useTag:b')
								.addComponent('useTag:d')
								.addComponent('useTag:f');

							var e = Entity.getTag('second').concrete();
							
							expect(e.hasComponent('useTag:a')).toBeTruthy();
							expect(e.hasComponent('useTag:b')).toBeTruthy();
							expect(e.hasComponent('useTag:c')).toBeTruthy();
							expect(e.hasComponent('useTag:d')).toBeTruthy();
							expect(e.hasComponent('useTag:e')).toBeTruthy();
							expect(e.hasComponent('useTag:f')).toBeTruthy();
						});// it should allow template extentions to concat a list of used components
					});// desc useTag
				});// it should have the following functions
			});// desc once instantiated
		});// desc The Entity-System Base Object
	}
);