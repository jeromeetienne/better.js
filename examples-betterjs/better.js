var BetterJS	= {}
var Bjs		= BetterJS

// test if we in node.js
if( typeof(window) === 'undefined' ){
	module.exports	= BetterJS
}

//////////////////////////////////////////////////////////////////////////////////
//		export all modules						//
//////////////////////////////////////////////////////////////////////////////////

var GcMonitor		= GcMonitor		|| require('../src/gcmonitor.js');
BetterJS.GcMonitor	= GcMonitor

var GlobalDetector	= GlobalDetector	|| require('../src/globaldetector.js');
BetterJS.GlobalDetector	= GlobalDetector

//////////////////////////////////////////////////////////////////////////////////
//		privateforjs.js							//
//////////////////////////////////////////////////////////////////////////////////

var PrivateForJS	= PrivateForJS		|| require('../src/privateforjs.js');
BetterJS.PrivateForJS	= PrivateForJS


//////////////////////////////////////////////////////////////////////////////////
//		typecheck.js							//
//////////////////////////////////////////////////////////////////////////////////

var TypeCheck		= TypeCheck		|| require('../src/typecheck.js');
BetterJS.TypeCheck	= TypeCheck

//////////////////////////////////////////////////////////////////////////////////
//		assertwhichstop.js						//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var assertWhichStop	= assertWhichStop		|| require('../src/assertwhichstop.js');
// export the class
BetterJS.assertWhichStop	= assertWhichStop

BetterJS.assert			= assertWhichStop
BetterJS.overloadConsoleAssert	= assertWhichStop.overloadConsole

//////////////////////////////////////////////////////////////////////////////////
//		consolelogger.js						//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var ConsoleLogger	= ConsoleLogger		|| require('../src/consolelogger.js');
// export the class
BetterJS.ConsoleLogger	= ConsoleLogger
// add some alias
BetterJS.log		= ConsoleLogger.log
BetterJS.warn		= ConsoleLogger.warn
BetterJS.error		= ConsoleLogger.error
BetterJS.pushLogFilter	= ConsoleLogger.pushFilter
BetterJS.overloadConsoleLog	= ConsoleLogger.overloadConsole

// Setup a default ConsoleLogger formatter
// ConsoleLogger.formatter	= ConsoleLogger.formatterOrigin;
ConsoleLogger.formatter	= ConsoleLogger.formatterTimeStamp;

//////////////////////////////////////////////////////////////////////////////////
//		consolelogger.js						//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var ObjectIcer		= ObjectIcer		|| require('../src/objecticer.js');
// export the class
BetterJS.ObjectIcer	= ObjectIcer

BetterJS.iceRead	= ObjectIcer.readProperties
BetterJS.iceWrite	= ObjectIcer.writeProperties
BetterJS.ice		= ObjectIcer.rwProperties


//////////////////////////////////////////////////////////////////////////////////
//		qgettersetter.js						//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var QGetterSetter	= QGetterSetter		|| require('../src/qgettersetter.js');
// export the class
BetterJS.QGetterSetter	= QGetterSetter

BetterJS.qGetter	= QGetterSetter.defineGetter
BetterJS.qSetter	= QGetterSetter.defineSetter

//////////////////////////////////////////////////////////////////////////////////
//		propertyattr.js							//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var PropertyAttr	= PropertyAttr		|| require('../src/propertyattr.js');
// export the class
BetterJS.PropertyAttr	= PropertyAttr
BetterJS.property	= PropertyAttr.define


BetterJS.propertiesType	= function(baseObject, properties){
	Object.keys(properties).forEach(function(property){
		var allowedType	= properties[property]
		PropertyAttr
			.define(baseObject, property)
			.typeCheck(allowedType)
	})
	return BetterJS
}

//////////////////////////////////////////////////////////////////////////////////
//		functionattr.js							//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var FunctionAttr	= FunctionAttr		|| require('../src/functionattr.js');
// export the class
BetterJS.FunctionAttr	= FunctionAttr

BetterJS.fn		= FunctionAttr.define

BetterJS.overloadFunctionAttr	= function(){
	// NOTES should that be a getter ? it would remove the () in .Bjs()
	Function.prototype.Bjs	= function(){
		return FunctionAttr.define(this)
	}	
}


// API to support
// * add	= Bjs.fn(add)
// 	.accept(Number, Number)
// 	.return(Number)
// 	.done()
// * 2 noises to remove. the add = and the .done()

// Vector	= Bjs.ctor(Vector).privatize()
// 		.accept(Number, Number)
// 		.properties({
// 			x	: [Number, 'nonan'],
// 			y	: [Number, 'nonan'],	
// 		})

// Vector	= Bjs.Class(Vector, {
// 	accept		: [Number, Number],
// 	privatize	: true,	// assume any name starting with _ is private
// 	properties	: {
// 		x	: [Number, 'nonan'],
// 		y	: [Number, 'nonan'],	
// 	}
// })


// //////////////////////////////////////////////////////////////////////////////////
//		stracktrace.js							//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var StackTrace		= StackTrace		|| require('../src/stacktrace.js');
// export the class
BetterJS.StackTrace	= StackTrace

BetterJS.stack		= StackTrace.parse

BetterJS.stackFrame	= function(index){
	index	= index !== undefined ? index : 0;
	return StackTrace.parse()[index]
}

BetterJS.StackFrame	= StackTrace.Frame
BetterJS.StackTracker	= StackTrace.Tracker



