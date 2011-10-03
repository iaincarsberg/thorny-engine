/*global define*/
require.config({
	paths: {
		compose: 'lib/compose/compose',
		underscore: 'lib/underscore/underscore',
		'underscore.string': 'lib/underscore.string/lib/underscore.string',
		cjs: 'lib/cjs/cjs',
		text: 'lib/requirejs/text'
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
			load: function (target, require, load) {
				var 
					bits = target.split('>'),
					project,
					module,
					platform,
					platforms = ['browser', 'node.js', 'common'],
					path;
				
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
					module   = underscore.include(platforms, bits[0]) ? bits[0] : 'core';
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
				
				path = [module, platform, path];
				if (project) {
					path.unshift(project);
				}
				
				path = path.join('/');
				
				console.log(path);
				
				/*
				entity-system/common/base.js
				core/common/math/vector2.js
				core/common/math/poly2.js
				*/
				
				require([path], load);
			}
		};
	}
);