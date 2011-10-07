/*global console*/
(function () {
	function red(s) {
		return ["\033\[31m", s, "\033\[0m"].join('');
	}
	
	function green(s) {
		return ["\033[32m", s, "\033[0m"].join('');
	}
	
	function cyan(s) {
		return ["\033[36m", s, "\033[0m"].join('');
	}
	
	function yellow(s) {
		return ["\033[33m", s, "\033[0m"].join('');
	}
	
	function blue(s) {
		return ["\033[34m", s, "\033[0m"].join('');
	}
    
	function ConsoleJasmineReporter() {
	
	}

	ConsoleJasmineReporter.prototype.reportRunnerResults = function (runner) {
		var output = [],
			results = runner.results(),
			result,
			specs = runner.specs(),
			msg = [specs.length, 'specs,', results.failedCount, 'failures.'].join(' '),
			i,
			spec,
			items,
			numItems,
			j;
		
		if (results.failedCount > 0) {
			msg = red(msg);
			
		} else {
			msg = green(msg);
		}
		
		output.push(msg);
    
        
		
		for (i = 0; i < specs.length; i += 1) {
			spec = specs[i];
			results = spec.results();
			
			if (results.failedCount > 0) {
				items = results.getItems();
				numItems = items.length;
				
				for (j = 0; j < numItems; j += 1) {
					result = items[j];
					
					if (result.type === 'log') {
						output.push('  LOG: ' + result.toString());
						
					} else if (
						result.type === 'expect' && 
						result.passed && !result.passed()
					) {
						output.push(spec.getFullName());
						output.push('  ' + red(result.message));
						output.push('  ' + red(result.trace.stack));
					}
				}
			}
		}
		console.log('\n' + output.join('\n'));
	};
	
	exports.ConsoleJasmineReporter = ConsoleJasmineReporter;
}());