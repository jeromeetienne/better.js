var BetterJS	= {}

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= BetterJS;


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

var Privatize		= Privatize		|| require('../src/privatize.js');
BetterJS.Privatize	= Privatize


//////////////////////////////////////////////////////////////////////////////////
//		typecheck.js							//
//////////////////////////////////////////////////////////////////////////////////

var StrongTyping	= StrongTyping		|| require('../src/strongtyping.js');
BetterJS.StrongTyping	= StrongTyping

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
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Same as __LINE__ in C
*/
QGetterSetter.defineGetter(BetterJS, '__LINE__', function(){
	var stacktrace	= Stacktrace.parse();
	var stackFrame	= stacktrace[2];
	return stackFrame.line
})

/**
 * Same as __FILE__ in C
*/
QGetterSetter.defineGetter(BetterJS, '__FILE__', function(){
	var stacktrace	= Stacktrace.parse();
	var stackFrame	= stacktrace[2];
	return stackFrame.basename();
})

/**
 * Same as __FUNCTION__ in C
*/
QGetterSetter.defineGetter(BetterJS, '__FUNCTION__', function(){
	var stacktrace	= Stacktrace.parse();
	var stackFrame	= stacktrace[2];
	return stackFrame.fct;
})

BetterJS.overloadGlobalLineFileFunction	= function(){
	var _global	= typeof(window) === 'undefined' ? global : window;
	QGetterSetter.defineGetter(_global, '__LINE__', function(){
		return Stacktrace.parse()[2].line
	})
	QGetterSetter.defineGetter(_global, '__FILE__', function(){
		return Stacktrace.parse()[2].basename()
	})
	QGetterSetter.defineGetter(_global, '__FUNCTION__', function(){
		return Stacktrace.parse()[2].fct
	});
}


//////////////////////////////////////////////////////////////////////////////////
//		propertyattr.js							//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var PropertyAttr	= PropertyAttr		|| require('../src/helpers/propertyattr.js');
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
var FunctionAttr	= FunctionAttr		|| require('../src/helpers/functionattr.js');
// export the class
BetterJS.FunctionAttr	= FunctionAttr

BetterJS.fn		= FunctionAttr.define

BetterJS.overloadFunctionAttr	= function(){
	// NOTES should that be a getter ? it would remove the () in .Bjs()
	Function.prototype.attr	= function(){
		return FunctionAttr.define(this)
	}	
}

// //////////////////////////////////////////////////////////////////////////////////
//		stracktrace.js							//
//////////////////////////////////////////////////////////////////////////////////

// get it for node.js
var Stacktrace		= Stacktrace		|| require('../src/stacktrace.js');
// export the class
BetterJS.Stacktrace	= Stacktrace

BetterJS.stack		= Stacktrace.parse

BetterJS.stackFrame	= function(index){
	index	= index !== undefined ? index : 0;
	return Stacktrace.parse()[index]
}

BetterJS.StackFrame	= Stacktrace.Frame
BetterJS.StackTracker	= Stacktrace.Tracker


//////////////////////////////////////////////////////////////////////////////////
//		constructor							//
//////////////////////////////////////////////////////////////////////////////////


// get it for node.js
var ClassAttr	= ClassAttr		|| require('../src/helpers/classattr.js');
BetterJS.Class	= ClassAttr

