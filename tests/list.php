<?php

// I know, I know PHP sucks right...
header("Content-type: text/text");

header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: Wed, 11 Jan 1984 05:00:00 GMT");

function findAllUnitTests ($directory, $files=array()) {
	$contents = scandir($directory);
	
	foreach ($contents as $key) {
		if (in_array($key, array('.', '..'))) {
			continue;
		}
		$path = sprintf('%s/%s', $directory, $key);
		
		if (is_dir($path)) {
			$files = findAllUnitTests($path, $files);
			
		} else if (
			is_file($path) &&
			substr($path, -8) === '.spec.js'
		) {
			$files[] = '/tests' . str_replace(dirname(__FILE__), '', $path);
		}
	}
	
	return $files;
};

foreach (findAllUnitTests(dirname(__FILE__)) as $path) {
	echo $path . "\n";
}