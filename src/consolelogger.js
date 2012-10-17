/**
 * @fileOverview implementation of a log layer on top of console.*
 * 
 * * TODO how to overload the usual console.log/warn/error function
 *   * done ?
 * * TODO put a prefix 
 * * TODO write tests
 * * TODO write examples
*/


var Stacktrace	= Stacktrace	|| require('./stacktrace.js');

/**
 * @namespace logger compatible with console.* calls
 */
var ConsoleLogger	= {};

/**
 * the previous instance of console object
*/
ConsoleLogger._origConsole	= {
	console	: console,
	log	: console.log,
	warn	: console.warn,
	error	: console.error
};


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ConsoleLogger;

/**
 * Des ription of the various level of severity
 * @type {Object}
 */
ConsoleLogger.Severity	= {
	'all'		: 0,
	'log'		: 1,
	'warn'		: 2,
	'error'		: 3,
	'nothing'	: 99,
};

/**
 * default level of severity when no filter matches
 * 
 * @type {Number}
 */
ConsoleLogger.Severity.dfl	= ConsoleLogger.Severity.all;

//////////////////////////////////////////////////////////////////////////////////
//		handle filters							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Store all the filters
 * @type {Array}
 */
ConsoleLogger._filters	= [];

/**
 * push a new filter - stackFrame 
 * 
 * @param  {Function(stackFrame)} validFor function which determine which stackFrame is valid 
 * @param  {[type]} severity [description]
 * @return {[type]}          [description]
 */
ConsoleLogger.pushFilter	= function(validFor, severity){
	// sanity check - sanity level MUST be defined
	console.assert(Object.keys(ConsoleLogger.Severity).indexOf(severity) !== -1, 'unknown severity level');
	console.assert(validFor instanceof Function);
	// push new level
	ConsoleLogger._filters.push({
		validFor	: validFor,
		severity	: ConsoleLogger.Severity[severity]
	});
};

/**
 * test if a given instance of severity and stackframe is valid for ConsoleLogger
 * @param  {string} severity   Severity to test
 * @param  {Object} stackFrame stackframe to test (in stacktrace.js format)
 * @return {Boolean}           true if the filter is valid, false otherwise
 */
ConsoleLogger.filter	= function(severity, stackFrame){
	stackFrame	= stackFrame	|| Stacktrace.parse()[2];
	// sanity check - sanity level MUST be defined
	console.assert(Object.keys(ConsoleLogger.Severity).indexOf(severity) !== -1, 'unknown severity level');
	// go thru all the filters
	var filters	= ConsoleLogger._filters;
	for(var i = 0; i < filters.length; i++){
		var filter	= filters[i];
		if( filter.validFor(stackFrame) === false )	continue;
		return ConsoleLogger.Severity[severity] >= filter.severity ? true : false;
	}
	// if this point is reach, check with Severity.dfl
	return ConsoleLogger.Severity[severity] >= ConsoleLogger.Severity.dfl ? true : false;
}

//////////////////////////////////////////////////////////////////////////////////
//		handle log functions						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * log with a severity of 'log'
 */
ConsoleLogger.log	= function(/* ... */){
	if( ConsoleLogger.filter('log') === false )	return;
	var _console	= ConsoleLogger._origConsole;
	_console.log.apply(_console.console, arguments);	
}

/**
 * log with a severity of 'warn'
 */
ConsoleLogger.warn	= function(/* ... */){
	if( ConsoleLogger.filter('warn') === false )	return;
	var _console	= ConsoleLogger._origConsole;
	_console.warn.apply(_console.console, arguments);	
}

/**
 * log with a severity of 'error'
 */
ConsoleLogger.error	= function(/* ... */){
	if( ConsoleLogger.filter('error') === false )	return;
	var _console	= ConsoleLogger._origConsole;
	_console.error.apply(_console.console, arguments);	
}

//////////////////////////////////////////////////////////////////////////////////
//		Helpers								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Overload console.log/warn/error function
 */
ConsoleLogger.overloadConsole	= function(){
	console.log	= ConsoleLogger.log;
	console.warn	= ConsoleLogger.warn;
	console.error	= ConsoleLogger.error;
}
