 /**
 * @fileOverview implementation of a log layer on top of console.*
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
	'nothing'	: 99
};

/**
 * default level of severity when no filter matches
 * 
 * @type {Number}
 */
ConsoleLogger.Severity.dfl	= ConsoleLogger.Severity.all;

//////////////////////////////////////////////////////////////////////////////////
//		handle formatters							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * formater which doesnt change anything
 * 
 * @param  {Array} args	the ```arguments``` of the logger funciton
 * @param  {Stacktrace.Frame}	stackFrame the stackframe of the origin 
 * @param  {string} severity	severity of the message
 * @return {Array}		the formated args
 */
ConsoleLogger.formatterIdentity	= function(args, stackFrame, severity){
	return args;
}

/**
 * formater which add a timestamp as prefix to the message - with color if in node
 * 
 * @param  {Array} args	the ```arguments``` of the logger funciton
 * @param  {Stacktrace.Frame}	stackFrame the stackframe of the origin 
 * @param  {string} severity	severity of the message
 * @return {Array}		the formated args
 */
ConsoleLogger.formatterTimeStamp	= function(args, stackFrame, severity){
	// build prefix with time
	var present	= new Date();
	var prefixColor	= ConsoleLogger._formatterSeverityColor(severity);
	var prefix	= prefixColor + pad(present.getHours(),2)
				+ ':'
				+ pad(present.getMinutes(),2)
				+ ':'
				+ pad(present.getSeconds(),2)
				+ ConsoleLogger._formatterColor.reset;
	// convert arguments into actual Array
	args	= Array.prototype.slice.call(args, 0);
	// prepend the prefix
	args.unshift(prefix);
	// return the result
	return args;

	function pad(val, len) {
		val = String(val);
		while(val.length < len) val = "0" + val;
		return val;
	};
};

/**
 * formater which add the origin as prefix to the message - with color if in node
 * 
 * @param  {Array} args	the ```arguments``` of the logger funciton
 * @param  {Stacktrace.Frame}	stackFrame the stackframe of the origin 
 * @param  {string} severity	severity of the message
 * @return {Array}		the formated args
 */
ConsoleLogger.formatterOrigin	= function(args, stackFrame, severity)
{
	// compute prefix
	var prefixColor	= ConsoleLogger._formatterSeverityColor(severity);
	var prefix	= prefixColor + stackFrame.originId() + ConsoleLogger._formatterColor.reset;
	// convert arguments into actual Array
	args		= Array.prototype.slice.call(args, 0);
	// prepend the prefix
	args.unshift(prefix);
	// return the result
	return args;
}

/**
 * flag to know if it is running in node.js or browser
 * @type {Boolean}
 */
ConsoleLogger._inNode	= typeof(window) === 'undefined' ? true : false;
/**
 * Color code for ansi tty
 * @type {String}
 */
ConsoleLogger._formatterColor	= {
	black	: ConsoleLogger._inNode === false ? '' : '\033[30m',
	red	: ConsoleLogger._inNode === false ? '' : '\033[31m',
	green	: ConsoleLogger._inNode === false ? '' : '\033[32m',
	yellow	: ConsoleLogger._inNode === false ? '' : '\033[33m',
	blue	: ConsoleLogger._inNode === false ? '' : '\033[34m',
	purple	: ConsoleLogger._inNode === false ? '' : '\033[35m',
	cyan	: ConsoleLogger._inNode === false ? '' : '\033[36m',
	white	: ConsoleLogger._inNode === false ? '' : '\033[37m',
	reset	: ConsoleLogger._inNode === false ? '' : '\033[0m'
};

/**
 * return ainsi color per intensity
 * @param  {String} severity the severity of the message
 * @return {String} ansi color string
 */
ConsoleLogger._formatterSeverityColor	= function(severity){
	var color	= ConsoleLogger._formatterColor;
	if( severity === 'log' )	return color.red;
	if( severity === 'warn' )	return color.purple;
	return color.green;
}

/**
 * Current message formatter
 */
ConsoleLogger.formatter	= ConsoleLogger.formatterIdentity;

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
	// handle polymorphism
	if( typeof(validFor) === 'string' ){
		var path	= validFor;
		return ConsoleLogger.pushFilter(function(stackFrame, severity){
			return stackFrame.url.lastIndexOf(path) === stackFrame.url.length - path.length ? true : false;
		}, severity);
	}else if( validFor instanceof RegExp ){
		var regexp	= validFor;
		return ConsoleLogger.pushFilter(function(stackFrame, severity){
			return stackFrame.url.match(regexp)	? true : false
		}, severity);		
	}
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

ConsoleLogger._print	= function(severity, args){
	var stackFrame	= Stacktrace.parse()[2];

	if( ConsoleLogger.filter(severity, stackFrame) === false )	return;

	var args	= ConsoleLogger.formatter(args, stackFrame, severity);
	var _console	= ConsoleLogger._origConsole;
	if( severity === 'log' ){
		_console.log.apply(_console.console, args);	
	}else if( severity === 'warn' ){
		_console.warn.apply(_console.console, args);			
	}else if( severity === 'error' ){
		_console.error.apply(_console.console, args);			
	}else console.assert(false, 'invalid severity: '+severity)
};

/**
 * log with a severity of 'log'
 */
ConsoleLogger.log	= function(/* ... */){
	ConsoleLogger._print('log', arguments);
}

/**
 * log with a severity of 'warn'
 */
ConsoleLogger.warn	= function(/* ... */){
	ConsoleLogger._print('warn', arguments);
}

/**
 * log with a severity of 'error'
 */
ConsoleLogger.error	= function(/* ... */){
	ConsoleLogger._print('error', arguments);
}

//////////////////////////////////////////////////////////////////////////////////
//		Helpers								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Overload console.log/warn/error function
 * 
 * @todo provide a noConflict  
 */
ConsoleLogger.overloadConsole	= function(){
	console.log	= ConsoleLogger.log;
	console.warn	= ConsoleLogger.warn;
	console.error	= ConsoleLogger.error;
}
