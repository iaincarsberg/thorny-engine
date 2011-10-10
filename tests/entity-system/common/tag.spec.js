/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!entity-system>main',
		'thorny!observer/observer'
	],
	function (
		Thorny,
		Entity,
		observer
	) {	
		describe('The Entity-System Base Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					expect(typeof Entity.getTag).toEqual('function');
				});// it should have the following functions
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should add the following functions to the entity', function () {
					expect(typeof new Entity().tag).toEqual('function');
					expect(typeof new Entity().listTags).toEqual('function');
					expect(typeof new Entity().removeTag).toEqual('function');
				});// it should add the following functions to the entity
				
				describe('has the following function,', function () {
					describe('tag', function () {
						it('it should allow an entity to be tagged', function () {
							var
								entity1 = new Entity(),
								entity2 = new Entity(),
								entity3 = new Entity();
							
							entity1
								.tag('the')
								.tag('cake');
								
							entity2
								.tag('is');
								
							entity3	
								.tag('a')
								.tag('lie');
							
							expect(entity1 instanceof Entity).toBeTruthy();
							expect(entity2 instanceof Entity).toBeTruthy();
							expect(entity3 instanceof Entity).toBeTruthy();
						});// it should allow an entity to be tagged
						
						it('it should allow a tag to be recalled', function () {
							var
								entity1 = new Entity(),
								entity2 = new Entity(),
								entity3 = new Entity();
							
							entity1
								.tag('the')
								.tag('cake');
								
							entity2
								.tag('is');
								
							entity3	
								.tag('a')
								.tag('lie');
								
							expect(Entity.getTag('the')).toEqual(entity1);
							expect(Entity.getTag('cake')).toEqual(entity1);
							expect(Entity.getTag('is')).toEqual(entity2);
							expect(Entity.getTag('a')).toEqual(entity3);
							expect(Entity.getTag('lie')).toEqual(entity3);
							
							expect(entity1.listTags()).toEqual(['the', 'cake']);
							expect(entity2.listTags()).toEqual(['is']);
							expect(entity3.listTags()).toEqual(['a', 'lie']);
						});// it should allow a tag to be recalled
						
						it('it should allow a tag to be replaced with another entity', function () {
							var
								entity1 = new Entity(),
								entity2 = new Entity();
							
							entity1.tag('find-me');
							entity2.tag('find-me');
							
							expect(Entity.getTag('find-me')).toEqual(entity2);
							expect(entity1.listTags()).toEqual([]);
							expect(entity2.listTags()).toEqual(['find-me']);
							
						});// it should allow a tag to be replaced with another entity
					});// desc tag
					
					describe('listTags', function () {
						it('it should list attached tags', function () {
							var entity = new Entity();
							
							entity
								.tag('Lorem')
								.tag('ipsum')
								.tag('dolor')
								.tag('sit')
								.tag('amet')
								.tag('consectetur')
								.tag('adipisicing')
								.tag('elit');
							
							expect(entity.listTags().join(' '))
								.toEqual('Lorem ipsum dolor sit amet consectetur adipisicing elit');
						});// it should list attached tags
						
						it('it should list attached tags, once a view have been reapplied to another entity', function () {
							var entity = new Entity(), anotherEntity = new Entity();
							
							entity
								.tag('Lorem')
								.tag('ipsum')
								.tag('dolor')
								.tag('sit')
								.tag('amet')
								.tag('consectetur')
								.tag('adipisicing')
								.tag('elit');
							
							anotherEntity
								.tag('ipsum')
								.tag('sit')
								.tag('elit');
							
							expect(entity.listTags().join(' '))
								.toEqual('Lorem dolor amet consectetur adipisicing');
							
							expect(anotherEntity.listTags().join(' '))
								.toEqual('ipsum sit elit');
						});// it should list attached tags, once a view have been reapplied to another entity
					});// desc listTags
					
					describe('removeTag', function () {
						it('it should list attached tags, once a view have been removed', function () {
							var entity = new Entity();
							
							entity
								.tag('Lorem')
								.tag('ipsum')
								.tag('dolor')
								.tag('sit')
								.tag('amet')
								.tag('consectetur')
								.tag('adipisicing')
								.tag('elit');
							
							entity
								.removeTag('ipsum')
								.removeTag('sit')
								.removeTag('elit');
							
							expect(entity.listTags().join(' '))
								.toEqual('Lorem dolor amet consectetur adipisicing');
						});// it should list attached tags, once a view have been removed
					});// desc removeTag
				});// desc has the following function
			});// desc once instantiated
		});// desc The Entity-System Base Object
	}
);