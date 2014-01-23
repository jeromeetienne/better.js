/**
 * assert which actually try to stop the excecution
 * if debug.assert.useDebugger is falsy, throw an exception. else trigger the
 * debugger. It default to false. unclear how usefull it is for node.js
 * to overload console.assert just do ```console.assert	= assertWhichStop;```.
 * Based on https://gist.github.com/2651899 done with jensarps.
 *
 * @param {Boolean} condition the condition which is asserted
 * @param {String} message the message which is display is condition is falsy
 * @param {Boolean} [useDebugger] if true, a failled assert will trigger js debugger
*/
var assertWhichStop	= function(condition, message, useDebugger){
	if( condition )	return;
	if( assertWhichStop.useDebugger || useDebugger )	debugger;
	throw new Error(message	|| "Assert Failed");
}

/**
 * if true, a fail assert will trigger js debugger
 * 
 * @type {Boolean}
 */
assertWhichStop.useDebugger	= false;

// export the class in node.js - if running in node.js - unclear how usefull it is in node.js
if( typeof(window) === 'undefined' )	module.exports	= assertWhichStop;

/**
 * Little helper to overload console.assert
 * @api public
 * @todo a .offConsoleAPI() or noConflict() which restore it
 */
assertWhichStop.overloadConsole	= function(){
	console.assert	= assertWhichStop;
}
