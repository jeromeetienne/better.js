var JSDOCED	= JSDOCED	|| {}

JSDOCED.Function	= function(originalFct){
	// console.log('prout')
	
	var stackFrame	= Better.stack()[1]
	var jsdocContent= JSDOCED.extractJsdoc(stackFrame.url, stackFrame.line)
	// console.log('jsdocContent', jsdocContent)

	var output	= JSDOCED.parseJsdoc(jsdocContent)
	// console.log('output')
	// console.log(JSON.stringify(output, null, '\t'))

	var options	= JSDOCED.jsdocToBetterFunction(output)
	// console.log('options')
	// console.dir(options)

	var betterFct	= Better.Function(originalFct, options)

	return betterFct
}
