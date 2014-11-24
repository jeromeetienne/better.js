var JSDOCED	= JSDOCED	|| {}

// /**
//  * it is the same as ```JSDOCED.Function``` but overloaded in Function.prototype
//  */
// Function.prototype.jsdocedFunction	= function(){
// 	var originalFct	= this

// 	// find caller location
// 	var stackFrame	= Better.stack()[1]

// 	// extract jsdoc from called location 
// 	var fctNLines	= originalFct.toString().split('\n').length
// 	var jsdocContent= JSDOCED.extractJsdoc(stackFrame.url, stackFrame.line - fctNLines + 1)

// 	var output	= JSDOCED.parseJsdoc(jsdocContent)

// 	var options	= JSDOCED.jsdocToBetterFunction(output)

// 	var betterFct	= Better.Function(originalFct, options)

// 	return betterFct
// }