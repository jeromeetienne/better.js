var fs		= require('fs');
var esprima	= require('esprima');

function analyzeCode(code) {
	var ast	= esprima.parse(code, {
		comment	: true
	});
	console.log(JSON.stringify(ast, null, '\t'))
}

if (process.argv.length < 3) {
	console.log('Usage: analyze.js file.js');
	process.exit(1);
}

var filename	= process.argv[2];
console.log('Reading ' + filename);
var code	= fs.readFileSync(filename);

analyzeCode(code);
console.log('Done');