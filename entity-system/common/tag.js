/*global define*/
define(
	[
		'compose',
		'thorny'
	], 
	function (
		Compose,
		Thorny
	) {
		var
			tagEntity = {},
			entityTag = {};
		
		/**
		 * Used to allow entities to be tagged, and retived via the applied 
		 * access tag.
		 * @param object instance Contains a hook to inject functionality into
		 * each and every new Entity();
		 * @param object system Contains a hook in inject functionality into
		 * the entity-system
		 * @return void
		 */
		return function (instance, system) {
			/**
			 * Used to create a system to tag entities, allowing easy and 
			 * quick recall.
			 * @param Entity entity Contains an entity.
			 */
			instance.augment(function (entity) {
				Compose.call(
					entity,
					{
						/**
						 * Used to tag an entity.
						 * @param string tag Contains a tag to lexically make this 
						 * entity unique.
						 * @return this, to allow object chaining
						 */
						tag: function (tag) {
							// If a specific tag has already been used, then 
							// we need to remove it from the prior owner.
							if (tagEntity[tag] !== undefined) {
								entityTag[tagEntity[tag].getId()][tag] = false;
							}
							
							tagEntity[tag] = this;
							
							if (entityTag[this.getId()] === undefined) {
								entityTag[this.getId()] = {};
							}
							entityTag[this.getId()][tag] = true;
							
							return this;
						},
						
						/**
						 * Used to return a list of attached tags.
						 * @param void
						 * @return array Containing attached tags
						 */
						listTags: function () {
							if (entityTag[this.getId()] !== undefined) {
								var tags = [], owned = entityTag[this.getId()], key;
								
								for (key in owned) {
									if (owned.hasOwnProperty(key)) {
										if (owned[key]) {
											tags.push(key);
										}
									}
								}
								return tags;
							}
							return [];
						},
						
						/**
						 * Used to remove a tag from an entity
						 * @param string tag Contains a tag we're removing
						 * @return this, to allow object chaining
						 */
						removeTag: function (tag) {
							if (tagEntity[tag] === this) {
								tagEntity[tag] = undefined;
								entityTag[this.getId()][tag] = false;
							}
							
							return this;
						}
					}
				);
			});
			
			/**
			 * Used to fetch tagged entities.
			 * @param string tag Contains a tag that someone is looking for
			 * @reutrn Entity Contains an entity, or false
			 */
			system.augment('getTag', function (tag) {
				return (tagEntity[tag]) ? tagEntity[tag] : false;
			});
		};
	}
);