/**
 * assert which actually try to stop the excecution
 * if debug.assert.useDebugger is falsy, throw an exception. else trigger the
 * debugger. It default to false. unclear how usefull it is for node.js
 * to overload console.assert just do ```console.assert	= assertWhichStop;```
 *
 * @param {Boolean} condition the condition which is asserted
 * @param {String} message the message which is display is condition is falsy
 * @param {Boolean} [useDebugger] the condition which is asserted
*/
assertWhichStop	= function(condition, message, useDebugger){
	if( condition )	return;
	if( assertWhichStop.useDebugger || useDebugger )	debugger;
	throw new Error(message	|| "assert Failed");
}
assertWhichStop.useDebugger	= false;

// export the class in node.js - if running in node.js - unclear how usefull it is in node.js
if( typeof(window) === 'undefined' )	module.exports	= assertWhichStop;

/**
 * Little helper to overload console.assert
 */
assertWhichStop.onConsoleAPI	= function(){
	console.assert	= assertWhichStop;
}

