/*global define*/
define(
	[
		'compose',
		'cjs!flow'
	], 
	function (
		Compose,
		flow
	) {
		// Contains all entities with bound chains.
		var chains = {};
		
		return function (instance, system) {
			// We want to register a component that acts as a bridge between
			// and entity and the flow-js implementation.
			system.Entity.registerComponent('flow-js-handle', function (entity) {
				return {
					name: 'flow-js-handle',
					isUnique: true,
					
					/**
					 * Used to attach a flow-js flow.exec chain to an entity.
					 * @param void
					 * return boolean, true is was attached, otherwise false
					 */
					attach: function () {
						if (chains[entity.getId()] === undefined) {
							chains[entity.getId()] = [];
						}
						return true;
					},
					
					/**
					 * Used to append the flow.exec
					 * @param function step Contains a step within the 
					 * callback chain
					 * @return this, allowing object chaining
					 */
					flowAppend: function (step) {
						chains[entity.getId()].push(step);
						return entity;
					},
					
					/**
					 * Used to execute a flow.exec
					 * @param function callback Used to execute code after the
					 * chain has been executed
					 * @return this, allowing object chaining
					 */
					flowExec: function (callback) {
						if (typeof callback === 'function') {
							chains[entity.getId()].push(callback);
						}
						
						// Execute the exec function.
						flow.exec.apply(flow, chains[entity.getId()]);
						
						// Remove the chains
						delete chains[entity.getId()];
						
						return entity;
					}
				};
			});
		};
	}
);