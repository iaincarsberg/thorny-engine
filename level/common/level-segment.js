/*global define*/
define(
	[
		'thorny',
		'cjs!underscore'
	], 
	function (
		Thorny,
		underscore
	) {
		var LevelSegment, defaultOptions;
		
		/**
		 * Used to allow a user to customise a level-segment options.
		 * @param object Containing user defined options
		 * @return object Containing options
		 */
		defaultOptions = function (options) {
			return underscore.extend({
				network: 'file'
			}, options);
		};
		
		LevelSegment = Thorny.extend(
			function (data, options) {
				// Merge the options with the default options.
				options = defaultOptions(options);
				
				console.log('new LevelSegment(', data, ',', options, ')');
			},
			{
				a: 'b'
			}
		);
		
		return LevelSegment;
	}
);