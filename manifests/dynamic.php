<?php 
exit;
header("Content-type: text/cache-manifest");

header("Last-Modified: " . gmdate("D, d M Y H:i:s", 0) . " GMT");
header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: Wed, 11 Jan 1984 05:00:00 GMT");

// I know, I know, PHP in a javascript project, but it makes building dynamic
// manifest files much easier.

?>
CACHE MANIFEST
# rev <?php echo uniqid() . "\n"; ?>
# library files, these are manually inputted
/lib/requirejs/require.js
/lib/compose/compose.js
/lib/cjs/cjs.js
/lib/requirejs/text.js
/lib/underscore/underscore.js
/lib/underscore.string/lib/underscore.string.js

# class files
/thorny.js
/main.js
/core/common/math/vector2.js
/core/common/math/poly2.js
/core/common/observer/observable.js
<?php



?>

# unit tests
/tests/core/common/observer/observer.spec.js
<?php



?>