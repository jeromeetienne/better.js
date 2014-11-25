/**
 * @todo do a Function.prototype.version
 * @todo do a jsDoced.Class() to force the generation of Class (instead of relying on @constructor)
 * @todo same for the jsDoced.Function for consistency
 */


var jsDoced	= function(originalFct){
	// console.log('prout')
	
	var stackFrame	= Better.stack()[1]
	var jsdocContent= jsDoced.extractJsdoc(stackFrame.url, stackFrame.line)
	// console.log('jsdocContent', jsdocContent)

	var output	= jsDoced.parseJsdoc(jsdocContent)

	if( output.isClass ){
		var attributes	= jsDoced.jsdocToBetterClass(output)
		var betterClass	= Better.Class(originalFct, attributes)
		return betterClass
	}else{
		var attributes	= jsDoced.jsdocToBetterFunction(output)
		var betterFct	= Better.Function(originalFct, attributes)
		return betterFct
	}
	console.assert(false, 'this point should not be reached')
}

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= jsDoced;


// /**
//  * it is the same as ```jsDoced.Function``` but overloaded in Function.prototype
//  */
// Function.prototype.jsdocedFunction	= function(){
// 	var originalFct	= this

// 	// find caller location
// 	var stackFrame	= Better.stack()[1]

// 	// extract jsdoc from called location 
// 	var fctNLines	= originalFct.toString().split('\n').length
// 	var jsdocContent= jsDoced.extractJsdoc(stackFrame.url, stackFrame.line - fctNLines + 1)

// 	var output	= jsDoced.parseJsdoc(jsdocContent)

// 	var options	= jsDoced.jsdocToBetterFunction(output)

// 	var betterFct	= Better.Function(originalFct, options)

// 	return betterFct
// }