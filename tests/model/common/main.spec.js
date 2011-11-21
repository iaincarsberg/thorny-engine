/*global define window describe it expect runs waitsFor*/
define(
	[
		'thorny!model>main',
		'thorny!entity-system>main',
		'cjs!underscore',
		
		// Components
		'thorny!tests/fixtures>entity-system>component_a.component',
		'thorny!tests/fixtures>entity-system>unique_component_a.component',
		'thorny!tests/fixtures>entity-system>unique_component_b.component',
		'thorny!tests/fixtures>entity-system>unique_component_c.component',
		'thorny!tests/fixtures>model>commonOne.component',
		'thorny!tests/fixtures>model>commonTwo.component',
		'thorny!tests/fixtures>model>commonThree.component'
	],
	function (
		Model,
		Entity,
		underscore
	) {	
		describe('The Model Base Object', function () {
			describe('before instantiation', function () {
				it('it should have the following functions', function () {
					expect(underscore.isFunction(Model.expand)).toBeTruthy();
					expect(underscore.isFunction(Model.factory)).toBeTruthy();
					expect(underscore.isFunction(Model.makeComponentContainer)).toBeTruthy();
					expect(underscore.isFunction(Model.fetchComponentBase)).toBeTruthy();
					expect(underscore.isFunction(Model.fetchComponentAlterations)).toBeTruthy();
					expect(underscore.isFunction(Model.applyAlteration)).toBeTruthy();
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('the expand function', function () {
						it('it should return an instance of Model', function () {
							expect(Model.expand() instanceof Model).toBeTruthy();
						});// it should return an instance of Model
						
						it('it should store the template in the Models data', function () {
							var BaseModel;
							
							BaseModel = Model.expand(
								{
									component: 'sprite'
								},
								{
									component: 'rendererable'
								}
							);
							
							expect(BaseModel.data('template')).toEqual([
								{
									component: 'sprite'
								},
								{
									component: 'rendererable'
								}
							]);
						});// it should store the template in the Models data
						
						it('it should only add enteries with a valid "component" value into the template', function () {
							var BaseModel;
							
							BaseModel = Model.expand(
								{
									aBroken: 'component'
								}
							);
							
							expect(BaseModel.data('template')).toEqual([]);
						});// it should only add enteries with a valid "component" value into the template
						
						it('it should expand the template when using the lazy syntax', function () {
							var BaseModel = Model.expand(
								['componentA', true],
								['componentB', true],
								['componentC'],
								['componentD']
							);
							
							expect(BaseModel.data('template')).toEqual([
								{
									component: 'componentA',
									data: [true]
								},
								{
									component: 'componentB',
									data: [true]
								},
								{
									component: 'componentC',
									data: []
								},
								{
									component: 'componentD',
									data: []
								}
							]);
						});// it should expand the template when using the lazy syntax
						
						it('it should expand the template multiple times when using the lazy syntax', function () {
							var BaseModel, ExtendedModel;
							
							BaseModel = Model.expand(
								['componentA', true],
								['componentC']
							);
							
							ExtendedModel = BaseModel.expand(
								['componentB', true],
								['componentD']
							);
							
							expect(BaseModel.data('template')).toEqual([
								{
									component: 'componentA',
									data: [true]
								},
								{
									component: 'componentC',
									data: []
								}
							]);
							
							expect(ExtendedModel.data('template')).toEqual([
								{
									component: 'componentA',
									data: [true]
								},
								{
									component: 'componentC',
									data: []
								},
								{
									component: 'componentB',
									data: [true]
								},
								{
									component: 'componentD',
									data: []
								}
							]);
						});// it should expand the template multiple times when using the lazy syntax
					});// desc the expand function
					
					describe('the factory function', function () {
						it('it should return an empty entity', function () {
							var instance;
							
							instance = Model.factory();
							
							expect(instance instanceof Entity).toBeTruthy();
							expect(instance.listComponents()).toEqual([]);
						});// it should return an empty entity
					});// desc the factory function
					
					describe('the makeComponentContainer function', function () {
						it('it should make an object to store the data used to make new Components', function () {
							var list;
							
							list = Model.makeComponentContainer(
								[
									{component: 'the'},
									{component: 'cake'},
									{component: 'is'}
								],
								[
									{component: 'a'},
									{component: 'lie'}
								]
							);
							
							expect(list).toEqual({
								the: [],
								cake: [],
								is: [],
								a: [],
								lie: []
							});
						});// it should make an object to store the data used to make new Components
					});// desc the makeComponentContainer function
					
					describe('the fetchComponentBase function', function () {
						it('it should return the correct data', function () {
							var data = [
								{component: 'one', data: [1, 2, 3]},
								{component: 'two', data: [4, 5, 6]},
								{component: 'three', data: [7, 8, 9]}
							];
							
							expect(Model.fetchComponentBase('one', data)).toEqual([1, 2, 3]);
							expect(Model.fetchComponentBase('two', data)).toEqual([4, 5, 6]);
							expect(Model.fetchComponentBase('three', data)).toEqual([7, 8, 9]);
						});// it should return the correct data
					});// desc the fetchComponentBase function
					
					describe('the fetchComponentAlterations function', function () {
						it('it should find all instances of a specific component within the parsed data', function () {
							var data = [
								['componentA', 1, 2, 3],
								['componentA', 4, 5, 6],
								['componentA', 7, 8, 9],
								['componentB', 0, 1, 2],
								['componentB', 3, 4, 5],
								['componentB', 6, 7, 8],
								['componentC', 9, 0, 1],
								['componentC', 2, 3, 4],
								['componentC', 5, 6, 7],
								['componentA', 8, 9, 0]
							];
							
							expect(Model.fetchComponentAlterations('componentA', data)).toEqual([
								[1, 2, 3],
								[4, 5, 6],
								[7, 8, 9],
								[8, 9, 0]
							]);
							expect(Model.fetchComponentAlterations('componentB', data)).toEqual([
								[0, 1, 2],
								[3, 4, 5],
								[6, 7, 8]
							]);
							expect(Model.fetchComponentAlterations('componentC', data)).toEqual([
								[9, 0, 1],
								[2, 3, 4],
								[5, 6, 7]
							]);
							
						});// it should find all instances of a specific component within the parsed data
					});// desc the fetchComponentAlterations function
					
					describe('the applyAlteration function', function () {
						it('it should merge two blocks of data together', function () {
							expect(
								Model.applyAlteration(
									['hello', 'world'],
									['goodbye']
								)
							).toEqual([
								'goodbye', 'world'
							]);
							
							expect(
								Model.applyAlteration(
									['a', 'b', 'c', 'd'],
									[undefined, undefined, undefined, undefined, 'e']
								)
							).toEqual([
								'a', 'b', 'c', 'd', 'e'
							]);
							
							expect(
								Model.applyAlteration(
									['a', 'b', 'c', 'd'],
									[1, 2, 3, 4, 5]
								)
							).toEqual([
								1, 2, 3, 4, 5
							]);
							
							expect(
								Model.applyAlteration(
									['a', 'b', 'c', 'd'],
									[1, undefined, 3, undefined, 5]
								)
							).toEqual([
								1, 'b', 3, 'd', 5
							]);
						});// it should merge two blocks of data together
					});// desc the applyAlteration function
				});// desc has the following function,
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should have the following functions', function () {
					var model;
					
					model = new Model();
					
					expect(underscore.isFunction(model.expand)).toBeTruthy();
					expect(underscore.isFunction(model.factory)).toBeTruthy();
				});// it should have the following functions
				
				describe('has the following function,', function () {
					describe('the expand function', function () {
						it('it should merge the parsed template, with the parent NULL Models template', function () {
							var BaseModel, ExpandedModel;
							
							BaseModel = new Model();
							ExpandedModel = BaseModel.expand(
								{
									component: 'sprite'
								},
								{
									component: 'rendererable'
								}
							);
							
							expect(BaseModel.data('template')).toEqual([]);
							expect(ExpandedModel.data('template')).toEqual([
								{
									component: 'sprite'
								},
								{
									component: 'rendererable'
								}
							]);
							
						});// it should merge the parsed template, with the parent NULL Models template
						
						it('it should merge the parsed template, with the parent Models template', function () {
							var BaseModel, ExpandedModel;
							
							BaseModel = Model.expand(
								{
									component: 'component 1'
								},
								{
									component: 'component 2'
								}
							);
							ExpandedModel = BaseModel.expand(
								{
									component: 'component 3'
								},
								{
									component: 'component 4'
								}
							);
							
							expect(BaseModel.data('template')).toEqual([
								{
									component: 'component 1'
								},
								{
									component: 'component 2'
								}
							]);
							expect(ExpandedModel.data('template')).toEqual([
								{
									component: 'component 1'
								},
								{
									component: 'component 2'
								},
								{
									component: 'component 3'
								},
								{
									component: 'component 4'
								}
							]);
						});// it should merge the parsed template, with the parent Models template
						
						it('it should only add enteries with a valid "component" value into the template', function () {
							var BaseModel;
							
							BaseModel = Model.expand(
								{
									aBroken: 'component'
								}
							);
							
							expect(BaseModel.data('template')).toEqual([]);
						});// it should only add enteries with a valid "component" value into the template
					});// desc the expand function
					
					describe('the factory function', function () {
						it('it should return a raw Entity with no commonents if called on the raw Model', function () {
							var instance;
							
							instance = Model.factory();
							
							expect(instance instanceof Entity).toBeTruthy();
							expect(instance.listComponents()).toEqual([]);
						});// it should return a raw Entity with no commonents if called on the raw Model
						
						it('it should create a new instance of the desired Model, using no customisation', function () {
							var instance, BaseModel;
							
							BaseModel = Model.expand(
								['commonOne', {format: 'thorny!math/poly2'}],
								['commonTwo', 'some/default/level.json', {name: 'default'}],
								['commonThree', 'a', 'b', 'c']
							);
							
							instance = BaseModel.factory();
							
							expect(instance instanceof Entity).toBeTruthy();
							expect(instance.getComponent('commonOne').length).toEqual(1);
							expect(instance.getComponent('commonOne')[0].param1).toEqual({format: 'thorny!math/poly2'});
							expect(instance.getComponent('commonOne')[0].param2).toBeFalsy();
							expect(instance.getComponent('commonOne')[0].param3).toBeFalsy();
							
							expect(instance.getComponent('commonTwo').length).toEqual(1);
							expect(instance.getComponent('commonTwo')[0].param1).toEqual('some/default/level.json');
							expect(instance.getComponent('commonTwo')[0].param2).toEqual({name: 'default'});
							expect(instance.getComponent('commonTwo')[0].param3).toBeFalsy();
							
							expect(instance.getComponent('commonThree').length).toEqual(1);
							expect(instance.getComponent('commonThree')[0].param1).toEqual('a');
							expect(instance.getComponent('commonThree')[0].param2).toEqual('b');
							expect(instance.getComponent('commonThree')[0].param3).toEqual('c');
						});// it should create a new instance of the desired Model, using no customisation
						
						it('it should create a new instance of the desired Model, using minor customisations', function () {
							var instance, BaseModel;
							
							BaseModel = Model.expand(
								['commonOne', {format: 'thorny!math/poly2'}],
								['commonTwo', 'some/default/level.json', {name: 'default'}],
								['commonThree', 'a', 'b', 'c']
							);
							
							instance = BaseModel.factory(
								['commonOne', {format: 'thorny!math/tile2'}],
								['commonTwo', 'some/custom/level.json', {name: 'custom'}],
								['commonThree', 'd', 'e']
							);
							
							expect(instance instanceof Entity).toBeTruthy();
							expect(instance.getComponent('commonOne').length).toEqual(1);
							expect(instance.getComponent('commonOne')[0].param1).toEqual({format: 'thorny!math/tile2'});
							expect(instance.getComponent('commonOne')[0].param2).toBeFalsy();
							expect(instance.getComponent('commonOne')[0].param3).toBeFalsy();
							
							expect(instance.getComponent('commonTwo').length).toEqual(1);
							expect(instance.getComponent('commonTwo')[0].param1).toEqual('some/custom/level.json');
							expect(instance.getComponent('commonTwo')[0].param2).toEqual({name: 'custom'});
							expect(instance.getComponent('commonTwo')[0].param3).toBeFalsy();
							
							expect(instance.getComponent('commonThree').length).toEqual(1);
							expect(instance.getComponent('commonThree')[0].param1).toEqual('d');
							expect(instance.getComponent('commonThree')[0].param2).toEqual('e');
							expect(instance.getComponent('commonThree')[0].param3).toEqual('c');
						});// it should create a new instance of the desired Model, using minor customisations
						
						it('it should create a new instance of the desired model, using complex customisations', function () {
							var instance, BaseModel;
							
							BaseModel = Model.expand(
								['commonOne', {format: 'thorny!math/poly2'}],
								['commonTwo', 'some/default/level.json', {name: 'default'}],
								['commonThree', 'a', 'b', 'c']
							);
							
							instance = BaseModel.factory(
								['commonOne', {format: 'thorny!math/tile2'}],
								['commonOne', {format: 'thorny!math/poly3'}, 'cake'],
								['commonTwo', 'some/custom/level/one.json', {name: 'custom-one'}],
								['commonTwo', 'some/custom/level/two.json', {name: 'custom-two'}],
								['commonTwo', 'some/custom/level/three.json'],
								['commonTwo', 'some/custom/level/four.json'],
								['commonThree', 'd', 'e'],
								['commonThree', 'f', 'g'],
								['commonThree', 'h', 'i'],
								['commonThree', 'j', 'k'],
								['commonThree', 'l', 'm']
							);
							
							expect(instance instanceof Entity).toBeTruthy();
							expect(instance.getComponent('commonOne').length).toEqual(2);
							expect(instance.getComponent('commonOne')[0].param1).toEqual({format: 'thorny!math/tile2'});
							expect(instance.getComponent('commonOne')[0].param2).toBeFalsy();
							expect(instance.getComponent('commonOne')[0].param3).toBeFalsy();
							expect(instance.getComponent('commonOne')[1].param1).toEqual({format: 'thorny!math/poly3'});
							expect(instance.getComponent('commonOne')[1].param2).toEqual('cake');
							expect(instance.getComponent('commonOne')[1].param3).toBeFalsy();
							
							expect(instance.getComponent('commonTwo').length).toEqual(4);
							expect(instance.getComponent('commonTwo')[0].param1).toEqual('some/custom/level/one.json');
							expect(instance.getComponent('commonTwo')[0].param2).toEqual({name: 'custom-one'});
							expect(instance.getComponent('commonTwo')[0].param3).toBeFalsy();
							
							expect(instance.getComponent('commonTwo')[1].param1).toEqual('some/custom/level/two.json');
							expect(instance.getComponent('commonTwo')[1].param2).toEqual({name: 'custom-two'});
							expect(instance.getComponent('commonTwo')[1].param3).toBeFalsy();
							
							expect(instance.getComponent('commonTwo')[2].param1).toEqual('some/custom/level/three.json');
							expect(instance.getComponent('commonTwo')[2].param2).toEqual({name: 'default'});
							expect(instance.getComponent('commonTwo')[2].param3).toBeFalsy();
							
							expect(instance.getComponent('commonTwo')[3].param1).toEqual('some/custom/level/four.json');
							expect(instance.getComponent('commonTwo')[3].param2).toEqual({name: 'default'});
							expect(instance.getComponent('commonTwo')[3].param3).toBeFalsy();
							
							expect(instance.getComponent('commonThree').length).toEqual(5);
							expect(instance.getComponent('commonThree')[0].param1).toEqual('d');
							expect(instance.getComponent('commonThree')[0].param2).toEqual('e');
							expect(instance.getComponent('commonThree')[0].param3).toEqual('c');
							expect(instance.getComponent('commonThree')[1].param1).toEqual('f');
							expect(instance.getComponent('commonThree')[1].param2).toEqual('g');
							expect(instance.getComponent('commonThree')[1].param3).toEqual('c');
							expect(instance.getComponent('commonThree')[2].param1).toEqual('h');
							expect(instance.getComponent('commonThree')[2].param2).toEqual('i');
							expect(instance.getComponent('commonThree')[2].param3).toEqual('c');
							expect(instance.getComponent('commonThree')[3].param1).toEqual('j');
							expect(instance.getComponent('commonThree')[3].param2).toEqual('k');
							expect(instance.getComponent('commonThree')[3].param3).toEqual('c');
							expect(instance.getComponent('commonThree')[4].param1).toEqual('l');
							expect(instance.getComponent('commonThree')[4].param2).toEqual('m');
							expect(instance.getComponent('commonThree')[4].param3).toEqual('c');
						});// it should create a new instance of the desired model, using complex customisations
					});// the factory function
				});// desc has the following function,
			});// desc once instantiated
		});// desc The Model Base Object
	}
);