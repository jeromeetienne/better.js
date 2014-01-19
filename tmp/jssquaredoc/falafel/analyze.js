var fs		= require('fs');
var falafel	= require('falafel');

if (process.argv.length < 3) {
	console.log('Usage: analyze.js file.js');
	process.exit(1);
}

var filename	= process.argv[2];
console.log('Reading ' + filename);
var code	= fs.readFileSync(filename, 'utf8');

var output	= falafel(code, function (node) {
	if (node.type === 'ArrayExpression') {
		node.update('fn(' + node.source() + ')');
	}
});


console.log(output);
console.log('Done');