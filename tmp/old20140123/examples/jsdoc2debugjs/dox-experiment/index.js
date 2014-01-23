

var dox	= require('./dox-master/lib/dox.js');

var filename	= '../cat-examples/cat.js'
var content	= require('fs').readFileSync(filename, 'utf8')
var result	= dox.parseComments(content)

console.log(JSON.stringify(result, null, '\t'))