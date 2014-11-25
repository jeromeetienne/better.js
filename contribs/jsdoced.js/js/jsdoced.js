/**
 * @todo do a Function.prototype.version
 * @todo do a jsDoced.Class() to force the generation of Class (instead of relying on @constructor)
 * @todo same for the jsDoced.Function for consistency
 */


var jsDoced	= function(originalFct, options){
	// default value for arguments
	options	= options	|| {}

	// console.log('prout')

	var jsdocJSON	= options.jsdocJSON
	if( jsdocJSON === undefined ){
		// find caller location and extract jsdoc from it
		var stackFrame	= Better.stack()[1]

		// TODO isstackFrame.url === 'repl'
		// the jsdoced is run inside the node.js interpreter
		// there is nothing to download
		// handle this case

		var jsdocContent= jsDoced.extractJsdoc(stackFrame.url, stackFrame.line)
		var jsdocJSON	= jsDoced.parseJsdoc(jsdocContent)
	}

	if( jsdocJSON.isClass ){
		var attributes	= jsDoced.jsdocToBetterClass(jsdocJSON)
		var betterClass	= Better.Class(originalFct, attributes)
		return betterClass
	}

	var attributes	= jsDoced.jsdocToBetterFunction(jsdocJSON)
	var betterFct	= Better.Function(originalFct, attributes)
	return betterFct
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= jsDoced;

if( typeof(window) === 'undefined' )	var Better	= require('../../../build/better.js')


//////////////////////////////////////////////////////////////////////////////////
//		Helpers
//////////////////////////////////////////////////////////////////////////////////

// /**
//  * it is the same as ```jsDoced.Function``` but overloaded in Function.prototype
//  */
// Function.prototype.jsDoced	= function(){
// 	var originalFct	= this

// 	// find caller location
// 	var stackFrame	= Better.stack()[1]

// 	// extract jsdoc from called location 
// 	var fctNLines	= originalFct.toString().split('\n').length
// 	var jsdocContent= jsDoced.extractJsdoc(stackFrame.url, stackFrame.line - fctNLines + 1)
// 	var jsdocJSON	= jsDoced.parseJsdoc(jsdocContent)

// 	// call the actual jsDoced()
// 	var newFct	= jsDoced(originalFct, {
// 		jsdocJSON	: jsdocJSON
// 	})
// 	// return the jsdoced function
// 	return newFct
// }

