/**
 * @fileOverview export all debug.js symbol for node.js
 */

// test if we in node.js
if( typeof(window) === 'undefined' ){
	// export each sub library
	module.exports	= {}
	module.exports.assertWhichStop	= assertWhichStop
	module.exports.ConsoleLogger	= ConsoleLogger
	module.exports.FunctionAttr	= FunctionAttr
	module.exports.GcMonitor	= GcMonitor
	module.exports.GlobalDetector	= GlobalDetector
	module.exports.ObjectIcer	= ObjectIcer
	module.exports.PrivateForJS	= PrivateForJS
	module.exports.PropertyAttr	= PropertyAttr
	module.exports.QGetterSetter	= QGetterSetter
	module.exports.Stacktrace	= Stacktrace
	module.exports.TypeCheck	= TypeCheck
}