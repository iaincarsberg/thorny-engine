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
		'thorny!tests/fixtures>entity-system>unique_component_c.component'
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
					});// desc the expand function
				});// desc has the following function,
			});// desc before instantiation
			
			describe('once instantiated', function () {
				it('it should have the following functions', function () {
					var model;
					
					model = new Model();
					
					expect(underscore.isFunction(model.expand)).toBeTruthy();
					expect(underscore.isFunction(model.amendDefaults)).toBeTruthy();// TODO
					expect(underscore.isFunction(model.createEntity)).toBeTruthy();// TODO
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
					
					describe('the amendDefaults function', function () {
						it('it should amend defaults within the template ', function () {
							var BaseModel;
							
							BaseModel = Model.expand(
								{
									component: 'component 1',
									someValue: '123'
								},
								{
									component: 'component 2'
								}
							);
							
							BaseModel.amendDefaults({
								'component 1': {
									someValue: '456'
								},
								'component 2': {
									someOtherValue: 'abc'
								}
							});
							
							expect(BaseModel.data('template')).toEqual([
								{
									component: 'component 1',
									someValue: '456'
								},
								{
									component: 'component 2',
									someOtherValue: 'abc'
								}
							]);
						});// it should amend defaults within the template
					});// desc the amendDefaults function
					
					describe('the createEntity function', function () {
						it('it should create a new entity, and apply a bunch of components', function () {
							var GenericModel, instance;
							
							GenericModel = Model.expand(
								{
									component: 'uniqueComponentA'
								},
								{
									component: 'uniqueComponentB'
								},
								{
									component: 'uniqueComponentC'
								},
								{
									component: 'componentA'
								}
							);
							
							instance = GenericModel.createEntity();
							
							expect(instance instanceof Entity).toBeTruthy();
							expect(instance.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(instance.hasComponent('uniqueComponentB')).toBeTruthy();
							expect(instance.hasComponent('uniqueComponentC')).toBeTruthy();
							expect(instance.hasComponent('componentA')).toBeTruthy();
						});// it should create a new entity, and apply a bunch of components
						
						it('it should alter the models default data if parsed an object', function () {
							var GenericModel, instance;
							
							GenericModel = Model.expand(
								{
									component: 'uniqueComponentA'
								},
								{
									component: 'uniqueComponentB'
								},
								{
									component: 'uniqueComponentC',
									data: [
										false
									]
								}
							);
							
							instance = GenericModel.createEntity({
								uniqueComponentC: {
									0: true
								}
							});
							
							expect(instance instanceof Entity).toBeTruthy();
							expect(instance.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(instance.hasComponent('uniqueComponentB')).toBeTruthy();
							expect(instance.hasComponent('uniqueComponentC')).toBeTruthy();
						});// it should alter the models default data if parsed an object
						
						it('it should allow multiple instances of a specific component to be added', function () {
							var GenericModel, instance;
							
							GenericModel = Model.expand(
								{
									component: 'uniqueComponentA'
								},
								{
									component: 'uniqueComponentB'
								},
								{
									component: 'componentA'
								}
							);
							
							instance = GenericModel.createEntity({
								componentA: [
									{
										0: 'qwertyuiop'
									},
									{
										0: 'asdfghjkl'
									}
								]
							});
							
							expect(instance instanceof Entity).toBeTruthy();
							expect(instance.hasComponent('uniqueComponentA')).toBeTruthy();
							expect(instance.hasComponent('uniqueComponentB')).toBeTruthy();
							expect(instance.hasComponent('componentA')).toBeTruthy();
							expect(instance.getComponent('componentA').length).toEqual(2);
							expect(instance.getComponent('componentA')[0].name).toEqual('element a');
							expect(instance.getComponent('componentA')[1].name).toEqual('element a');
							expect(instance.getComponent('componentA')[0].someUniqueValue).toEqual('qwertyuiop');
							expect(instance.getComponent('componentA')[1].someUniqueValue).toEqual('asdfghjkl');
						});// it should allow multiple instances of a specific component to be added
					});// desc the createEntity function
				});// desc has the following function,
			});// desc once instantiated
		});// desc The Model Base Object
	}
);