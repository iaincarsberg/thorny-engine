/*global window define*/
(function () {
	// Setup require.
	require.config({
		// Setup the paths for thirdparty modules used by the engine.
		paths: {
			compose:             'lib/compose/compose',
			underscore:          'lib/underscore/underscore',
			'underscore.string': 'lib/underscore.string/lib/underscore.string',
			cjs:                 'lib/cjs/cjs',
			text:                'lib/requirejs/text',
			jsonw:               'lib/JSON-wrapper/jsonw',
			json:                'lib/JSON-js/json2',
			order:               'lib/requirejs/order'
		}
	});
	
	// Define thorny
	define(
		[
			'compose',
			'cjs!underscore',
			'cjs!underscore.string'
		], 
		function (
			Compose,
			underscore,
			underscoreString
		) {
			var thorny, pathify;
			
			/**
			 * Defines the base thorny class.
			 * @author Iain Carsberg
			 */
			thorny = Compose(
				function () {
					// Automatically run the private function, which will expose
					// the closure safe handle.
					this.data();
				},
				{
					/**
					 * Used to return true, so I can do stuff like 
					 *     if (! object.isThorny) {
					 *       object = Compose.call(object, new Thorny());
					 *     };
					 * @var boolean true
					 */
					isThorny: true,
					
					/**
					 * Used to act as a protected datastore for any object that 
					 * needs one.
					 * @param string hash Containing the hash of the object
					 * @param undefined value Contains the value you wish to store
					 * @return undefined Containing what ever was stored in the 
					 * data store.
					 */
					data: function () {
						// Closure private
						var data = {};

						/**
						 * See parent for param list
						 */
						this.data = function (hash, value) {
							// Stringify an object, incase someone wants to use an
							// object as a uniuqe reference.
							if (typeof hash === 'object' && JSON && JSON.stringify) {
								hash = JSON.stringify(hash);
							}

							if (value !== undefined) {
								data[hash] = value;
							}
							return data[hash];
						};
					}
				}
			);
			
			/**
			 * Used to convert targets into usable paths.
			 * @param string target Containing a coded path
			 * @return string Containing the pathify-ed target
			 */
			pathify = underscore.memoize(function (target) {
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
					// Check to see if the platform has been specified
					if (! underscore.include(platforms, bits[0]) &&
						! underscore.include(platforms, bits[1]) &&
						! underscore.include(platforms, bits[2])
					) {
						// If it hasn't then the 0th element is the project,
						// and the 1st is the module, and the path is the 2nd
						project  = bits[0];
						module   = bits[1];
						platform = 'common';
						path     = bits[2];
						
					} else {
						// If it has been set, then the 0th element is the 
						// module, the 1st is the platform, and the 2nd is the
						// path
						project  = false;
						module   = underscore.include(platforms, bits[0]) ? bits[1] : bits[0];
						platform = underscore.include(platforms, bits[0]) ? bits[0] : bits[1];
						path     = bits[2];
					}
					
				} else if (bits.length === 2) {
					project  = false;
					module   = underscore.include(platforms, bits[0]) ? 'core' : bits[0];
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
				return path.join('/');
			});
			
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
			thorny.load = function (target, require, load) {
				require([pathify(target)], load);
			};
			
			return thorny;
		}
	);
}());