var fs		= require('fs');

if (process.argv.length < 3) {
	console.log('Usage: analyze.js file.js');
	process.exit(1);
}

var filename	= process.argv[2];
console.log('Reading ' + filename);
var code	= fs.readFileSync(filename, 'utf8');

var UglifyJS	= require("uglify-js");
var toplevel	= UglifyJS.parse(code, {
	filename	: filename,
	toplevel	: toplevel,	
});

// VERY VERY IMPORTANT
// http://stackoverflow.com/questions/19054803/using-uglifyjs-on-the-whole-node-project

toplevel.figure_out_scope()

debugger;


console.log(toplevel)

var codeOutput = toplevel.print_to_string({
	comments	: function(){
		return true
	}
});

console.log('Done');
console.log(codeOutput);