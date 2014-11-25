/**
 * @todo do a Function.prototype.version
 * @todo do a jsDoced.Class() to force the generation of Class (instead of relying on @constructor)
 * @todo same for the jsDoced.Function for consistency
 */


var jsDoced	= function(originalFct){
	// console.log('prout')
	
	var stackFrame	= Better.stack()[1]
	var jsdocContent= JSDOCED.extractJsdoc(stackFrame.url, stackFrame.line)
	// console.log('jsdocContent', jsdocContent)

	var output	= JSDOCED.parseJsdoc(jsdocContent)

	if( output.isClass ){
		var attributes	= JSDOCED.jsdocToBetterClass(output)
		var betterClass	= Better.Class(originalFct, attributes)
		return betterClass
	}else{
		var attributes	= JSDOCED.jsdocToBetterFunction(output)
		var betterFct	= Better.Function(originalFct, attributes)
		return betterFct
	}
	console.assert(false, 'this point should not be reached')
}



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