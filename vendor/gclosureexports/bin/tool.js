#!/usr/bin/env node

var dumpJscode	= true;
var dumpExports	= true;

// parse command line arguments
process.argv.shift();
process.argv.shift();
while(true){
	if(process.argv[0] === '--nodumpjscode'){
		dumpExports	= false;		
		continue;
	}
	console.assert(process.argv.length === 2)
	var jscodeFname	= process.argv[0];
	var exportsFname= process.argv[1];
	break;
}

// include the gclosureexports library itself
var gclosureStr	= require('fs').readFileSync(__dirname+'/../gclosureexports.js', 'utf8');
eval(gclosureStr)

// include js_code
var jscodeStr	= require('fs').readFileSync(jscodeFname, 'utf8');
eval(jscodeStr)

// include js_code exports for gclosureexports
var exportsStr	= require('fs').readFileSync(exportsFname, 'utf8');
eval(exportsStr)

// dump it in google closure compiler format
if( dumpJscode )	console.log(jscodeStr);

// dump it in google closure compiler format
if( dumpExports )	gclosureExports.dump();




