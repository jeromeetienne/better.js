var recast	= require("recast");

var jsdocParse	= require('./jsdocParse.js')
var jsdocExpr	= require('./jsdocExpression.js')


/**
 * process one file
 * 
 * @param  {String} filename       the filename to process
 * @param  {Object} cmdlineOptions the command line options
 * @return {Object}                output from recast.print()
 */
var processFile	= function processFile(filename, cmdlineOptions, onProcessed){
	var recastOption	= {
		// Options for recast - those are my personal preferences
		tabWidth	: 8,
		useTabs		: true,
	}

	if( cmdlineOptions.generateSourceMap ){
		recastOption.sourceFileName	= filename
		recastOption.sourceMapName	= filename+'.map.json'
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		pre read source file content
	//////////////////////////////////////////////////////////////////////////////////
	// read the content
	// - it is used to parse the jsdoc parts more easily
	var content	= require('fs').readFileSync(filename, 'utf8')
	var contentLines= content.split('\n')


	//////////////////////////////////////////////////////////////////////////////////
	//		recast transformer
	//////////////////////////////////////////////////////////////////////////////////
	var transformer	= function(ast, callback) {
		recast.visit(ast, {
			/**
			 * receive the FunctionExpression node
			 */
			visitFunctionExpression: function(path) {
				// console.log('FunctionExpression', path.value)

				// call the subtree
				// NOTE: must be before path.replace() to avoid reccursive infinite loop (creating function in function)
				this.traverse(path)

				// get jsdocContent for this node
				var lineNumber		= path.value.loc.start.line-1
				var jsdocContent	= jsdocParse.extractJsdocContent(contentLines, lineNumber)
				// if no jsdocContent, do nothing
				if( jsdocContent === null )	return

				// produce the callExpression to replace this node
				var functionExpression	= path.value
				var callExpression	= jsdocExpr.jsContent2CallExpression(jsdocContent, functionExpression, cmdlineOptions)

				// actually replace the node
				path.replace(callExpression)
			},
		});

		// NOTE: disabled this line to avoid display the outputed source
		callback(ast);
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	// parse the file content
	var ast	= recast.parse(content, recastOption)

	// go thru the transformer
	transformer(ast, function(node) {

		// print the outputed node
		var output	= recast.print(node, recastOption);

		onProcessed(output)
	});
}



//////////////////////////////////////////////////////////////////////////////////
//		exports
//////////////////////////////////////////////////////////////////////////////////

// export the module
module.exports	= {
	processOne	: processFile,
}
