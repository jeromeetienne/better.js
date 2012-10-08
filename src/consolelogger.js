/**
 * @namespace logger compatible with console.* calls
 */
var ConsoleLogger	= {};

var parseStacktrace	= parseStacktrace	|| require('./parsestacktrace.js');

ConsoleLogger.Severity	= {
	'none'	: 0,
	'log'	: 1,
	'warn'	: 2,
	'error'	: 3
};

ConsoleLogger.Severity.dflLevel	= ConsoleLogger.Severity.warn;

ConsoleLogger._filter	= function(stackFrame, severity){
	var stacktrace	= parseStacktrace();
	var stackFrame	= stacktrace[2];
	console.log('url', stackFrame.url)
	//var keepIt	= ConsoleLogger._filter(stackFrame, ConsoleLogger.SEVERITY_LOG)
	
	return true;
}

ConsoleLogger.log	= function(/* ... */){
	if( ConsoleLogger._filter('log') === false )	return;
	console.log.apply(console, arguments);
}

ConsoleLogger.warn	= function(/* ... */){
	if( ConsoleLogger._filter('warn') === false )	return;
	console.warn.apply(console, arguments);	
}

ConsoleLogger.error	= function(/* ... */){
	if( ConsoleLogger._filter('error') === false )	return;
	console.error.apply(console, arguments);	
}

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ConsoleLogger;

