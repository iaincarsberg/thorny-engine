/*global define console window describe it expect runs waitsFor*/
define(
	[
		'thorny',
		'thorny!entity-system>main',
		'thorny!event',
		
		// Components
		'thorny!tests/fixtures>entity-system>async.component'
	],
	function (
		Thorny,
		Entity,
		event
	) {	
		describe('The Entity-System Base Object', function () {
			describe('once instantiated', function () {
				it('it should have the following component', function () {
					var e = new Entity();
					e.addComponent('flow-js-handle');
					
					expect(e.listComponents()).toContain('flow-js-handle');
					expect(typeof e.getComponent('flow-js-handle')[0].flowAppend).toEqual('function');
					expect(typeof e.getComponent('flow-js-handle')[0].flowExec).toEqual('function');
				});// it should have the following component
			});// desc once instantiated
			
			describe('using the flow-js-handle component', function () {
				it('it should automatically bind, if another component requires it', function () {
					var e = new Entity();
					
					e.addComponent('async-component');
					e.addComponent('async-component');
					e.addComponent('async-component');
					e.addComponent('async-component');
					
					expect(e.listComponents()).toContain('flow-js-handle');
					expect(e.listComponents()).toContain('async-component');
				});// it should automatically bind, if another component requires it
				
				it('it should execute the async test', function () {
					var ran = false;
					
					new Entity()
						.addComponent('async-component')
						.triggers('require:flow-js:1');
					
					event.bind('require:flow-js:1', function (entity, asyncOppsRan) {
						expect(entity instanceof Entity).toBeTruthy();
						expect(entity.listComponents()).toContain('flow-js-handle');
						expect(entity.listComponents()).toContain('async-component');
						
						ran = true;
					});
					
					waitsFor(function () {
						return ran;
					});
				});// it should execute the async test
				
				it('it should execute the async test component, and process the response', function () {
					var runs = 0;
					
					new Entity()
						.addComponent('async-component')
						.addComponent('async-component')
						.addComponent('async-component')
						.addComponent('async-component')
						.triggers('require:flow-js:2');
					
					event.bind('require:flow-js:2', function (entity, asyncOppsRan) {
						runs = asyncOppsRan;
						
						expect(entity instanceof Entity).toBeTruthy();
						expect(entity.listComponents()).toContain('flow-js-handle');
						expect(entity.listComponents()).toContain('async-component');
					});
					
					waitsFor(function () {
						return runs === 4;
					});
				});// it should execute the async test component, and process the response
			});// desc using the flow-js-handle component
		});// desc The Entity-System Base Object
	}
);