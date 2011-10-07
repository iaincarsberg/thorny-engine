/*global console window global jasmine*/
// Node.js
if (typeof window === 'undefined') {
	console.log(" _   _                                               _            ");
	console.log("| |_| |__   ___  _ __ _ __  _   _    ___ _ __   __ _(_)_ __   ___ ");
	console.log("| __| '_ \\ \/ _ \\| '__| '_ \\| | | |  / _ \\ '_ \\ / _` | | '_ \\ / _ \\");
	console.log("| |_| | | | (_) | |  | | | | |_| | |  __/ | | | (_| | | | | |  __/");
	console.log(" \\__|_| |_|\\___/|_|  |_| |_|\\__, |  \\___|_| |_|\\__, |_|_| |_|\\___|");
	console.log("                            |___/              |___/              ");
	console.log('Test Suite');
	var 
		requirejs        = require('./lib/r'),
		fs               = require('fs'),
		jasminePath      = './lib/jasmine-node/lib/jasmine-node/jasmine-2.0.0.rc1',
		jasmineReporter  = './lib/jasmine-amd/consoleJasmineReporter2',
		printedOnRow     = 0,
		findAllUnitTests = function (directory, files) {
			if (files === undefined) {
				files = [];
			}
			
			var path, stats, key, contents = fs.readdirSync(directory);
			
			for (key in contents) {
				if (contents.hasOwnProperty(key)) {
					path = [directory, contents[key]].join('/');
					stats = fs.statSync(path);
					
					if (stats.isDirectory()) {
						findAllUnitTests(path, files);
						
					} else if (
						stats.isFile(path) &&
						path.substr(-8) === '.spec.js'
					) {
						files.push(path);
					}
				}
			}
			
			return files;
		};
	
	requirejs.config({
		nodeRequire: require,
	});
	
	//make define available globally like it is in the browser
	global.define   = require('./lib/r');
	
	//make jasmine available globally like it is in the browser
	global.describe = require(jasminePath).describe;
	global.it       = require(jasminePath).it;
	global.expect   = function (actual) {
		// Fudge in a dot for each assertition.
		printedOnRow += 1;
		process.stdout.write('.');
		
		if (printedOnRow === 66) {
			process.stdout.write("\n");
			printedOnRow = 0;
		}
		
		return require(jasminePath).expect(actual);
	};
	global.waitsFor = require(jasminePath).waitsFor;
	
	//bring in and list all the tests to be run
	requirejs(
		findAllUnitTests('./tests'),
		function (
			ModuleSpec
		) {
			var 
				jasmine = require(jasminePath).jasmine,
				ConsoleJasmineReporter2 = require(jasmineReporter).ConsoleJasmineReporter;
			
			jasmine.getEnv().addReporter(new ConsoleJasmineReporter2());
			jasmine.getEnv().execute();
		}
	);
	
// Browser
} else {
	require(
		[
			'./lib/requirejs/text!./tests/list.php'
		],
		function (list) {
			require(list.split("\n"), function () {
				//run tests
				jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
				jasmine.getEnv().execute();
			});
		}
	);
}