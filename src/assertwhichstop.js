/**
 * assert which actually try to stop the excecution
 * if debug.assert.useDebugger is falsy, throw an exception. else trigger the
 * debugger. It default to false
 *
 * @param {Boolean} condition the condition which is asserted
 * @param {String} message the message which is display is condition is falsy
 * @param {Boolean} [useDebugger] the condition which is asserted
*/
assertWichStop	= function(condition, message, useDebugger){
	if( condition )	return;
	if( debug.assert.useDebugger || useDebugger )	debugger;
	throw new Error(message	|| "assert Failed")
}
debug.assert.assertWichStop	= false;
