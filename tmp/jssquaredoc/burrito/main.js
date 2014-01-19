var fs		= require('fs');

if (process.argv.length < 3) {
	console.log('Usage: analyze.js file.js');
	process.exit(1);
}

var filename	= process.argv[2];
var code	= fs.readFileSync(filename, 'utf8');

var burrito	= require('burrito');

var modify	= process.argv[3];

if( modify === 'modify' ){
	var onNodeFcts	= []
	onNodeFcts.push(function (node) {
		if( node.name !== 'defun' )	return
		// get jsDoc
		var jsDoc	= getJsdoc(node)
		if( isJsdocConstructor(jsDoc) === false )	return

		var options	= {}
		options['className']	= node.label()

		node.wrap('function '+node.label()+'(){;return Bjs.Class(%s, '+JSON.stringify(options)+');};');
	})
	onNodeFcts.push(function (node) {
		if( node.name !== 'function' )	return
		if( node.parent() === null )	return

		// get jsDoc
		var jsDoc	= getJsdoc(node.parent())
		if( isJsdocConstructor(jsDoc) === false )	return

		var options	= {}
		if( node.parent().label() !== null ){
			options['className']	= node.parent().label()[0]
		}

		if( Object.keys(options).length > 0 ){
			node.wrap('Bjs.Class(%s, '+JSON.stringify(options)+')');		
		}else{
			node.wrap('Bjs.Class(%s);');			
		}
	})
	
	code		= burrito(code, function (node) {
		onNodeFcts.forEach(function(onNodeFct){
			onNodeFct(node)
		})
	});

	console.log(code);	
}else{
	var ast	= burrito.parse(code, false, true)
	console.dir(ast)
	debugger;
}


//////////////////////////////////////////////////////////////////////////////////
//		tools								//
//////////////////////////////////////////////////////////////////////////////////


function getJsdoc(node){
	if( node.start.comments_before.length === 0 )	return null
	var comment	= node.start.comments_before[0]
	if( comment.type !== 'comment2' )		return null
	if( comment.value.substr(0,2) !== '*\n' )	return null
	var jsdoc	= comment.value
	return jsdoc
}

function isJsdocConstructor(jsdoc){
	if( jsdoc === null )	return false
	if( jsdoc.match(/@constructor/) === null )	return false
	return true
}