var jsdocFunction	= function(originalFct){
	// console.log('prout')
	
	var stackFrame	= Better.stack()[1]
	var jsdocContent= extractJsdoc(stackFrame.url, stackFrame.line)
	// console.log('jsdocContent', jsdocContent)

	var output	= parseJsdoc(jsdocContent)
	// console.log('output')
	// console.log(JSON.stringify(output, null, '\t'))

	var options	= jsdocToBetterFunction(output)
	console.log('options')
	console.dir(options)

	var betterFct	= Better.Function(originalFct, options)

	return betterFct
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
Function.prototype.jsdocFunction	= function(){
	var originalFct	= this

	// console.log('stack', Better.stack())
	// console.log('function', originalFct.toString().split('\n').length)

	var stackFrame	= Better.stack()[1]
	var fctNLines	= originalFct.toString().split('\n').length
	var jsdocContent= extractJsdoc(stackFrame.url, stackFrame.line - fctNLines + 1)


	var jsdocContent= extractJsdoc(stackFrame.url, stackFrame.line)
	// console.log('jsdocContent', jsdocContent)

	var output	= parseJsdoc(jsdocContent)
	// console.log('output')
	console.log(JSON.stringify(output, null, '\t'))

	var options	= jsdocToBetterFunction(output)
	// console.log('options')
	// console.dir(options)

	var betterFct	= Better.Function(originalFct, options)

	return betterFct
}