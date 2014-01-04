var BetterJS	= {}
var Bjs		= BetterJS

console.assert(false, 'this code is obsolete')

//////////////////////////////////////////////////////////////////////////////////
//		export all modules						//
//////////////////////////////////////////////////////////////////////////////////

BetterJS.assertWhichStop= assertWhichStop
BetterJS.ConsoleLogger	= ConsoleLogger
BetterJS.FunctionAttr	= FunctionAttr
BetterJS.GcMonitor	= GcMonitor
BetterJS.GlobalDetector	= GlobalDetector
BetterJS.ObjectIcer	= ObjectIcer
BetterJS.PrivateForJS	= PrivateForJS
BetterJS.PropertyAttr	= PropertyAttr
BetterJS.QGetterSetter	= QGetterSetter
BetterJS.Stacktrace	= Stacktrace
BetterJS.TypeCheck	= TypeCheck

// test if we in node.js
if( typeof(window) === 'undefined' ){
	module.exports	= BetterJS
}

//////////////////////////////////////////////////////////////////////////////////
//		assertwhichstop.js						//
//////////////////////////////////////////////////////////////////////////////////

BetterJS.assert			= assertWhichStop
BetterJS.overloadConsoleAssert	= assertWhichStop.overloadConsole

//////////////////////////////////////////////////////////////////////////////////
//		consolelogger.js						//
//////////////////////////////////////////////////////////////////////////////////

BetterJS.iceObjectRead	= ObjectIcer.readProperties
BetterJS.iceObjectWrite	= ObjectIcer.writeProperties
BetterJS.iceObject	= ObjectIcer.rwProperties

//////////////////////////////////////////////////////////////////////////////////
//		qgettersetter.js						//
//////////////////////////////////////////////////////////////////////////////////

BetterJS.defineQGetter	= QGetterSetter.defineGetter
BetterJS.defineQSetter	= QGetterSetter.defineSetter
