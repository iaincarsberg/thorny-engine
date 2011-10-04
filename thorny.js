/*global window define*/
require.config({
	// Setup the paths for thirdparty modules used by the engine.
	paths: {
		compose:             'lib/compose/compose',
		underscore:          'lib/underscore/underscore',
		'underscore.string': 'lib/underscore.string/lib/underscore.string',
		cjs:                 'lib/cjs/cjs',
		text:                'lib/requirejs/text'
	}
});
define(
	[
		'cjs!underscore',
		'cjs!underscore.string'
	], 
	function (
		underscore,
		underscoreString
	) {
		return {
			/**
			 * Used to load files into the namespace. This uses memoize to 
			 * speed up the process. Though it requires the use of factories
			 * in the imported modules, otherwise the new whatevers will all 
			 * be one common item.
			 * @param string target Contains the target file we're loading
			 * @param function require Contains the function used to require 
			 *        other files
			 * @param function load Used to trigger load event
			 * @return void
			 */
			load: underscore.memoize(function (target, require, load) {
				var 
					bits = target.split('>'),
					project,
					module,
					platform,
					platforms = ['browser', 'node.js', 'common', '*'],
					path;
				
				// Populate the path details.
				if (bits.length === 4) {
					project  = bits[0];
					module   = bits[1];
					platform = bits[2];
					path     = bits[3];
					
				} else if (bits.length === 3) {
					project  = false;
					module   = underscore.include(platforms, bits[0]) ? bits[1] : bits[0];
					platform = underscore.include(platforms, bits[0]) ? bits[0] : bits[1];
					path     = bits[2];
					
				} else if (bits.length === 2) {
					project  = false;
					module   = 'core';
					platform = underscore.include(platforms, bits[0]) ? bits[0] : 'common';
					path     = bits[1];
					
				} else if (bits.length === 1) {
					project  = false;
					module   = 'core';
					platform = 'common';
					path     = bits[0];
					
				} else {
					throw new Error('Unknown file "', target, '"');
				}
				
				// If the wild card platform is used, then use the domain
				// specific implementation.
				if (platform === '*') {
					platform = (typeof window === 'undefined') ? 'node.js' : 'browser';
				}
				
				// Build the path
				path = [module, platform, path];
				if (project) {
					path.unshift(project);
				}
				
				// And turn it into a string
				path = path.join('/');
				
				// Then require the desired file
				require([path], load);
			})
		};
	}
);