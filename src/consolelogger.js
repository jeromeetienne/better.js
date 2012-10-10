
var Stacktrace	= Stacktrace	|| require('./stacktrace.js');


/**
 * @namespace logger compatible with console.* calls
 */
var ConsoleLogger	= {};


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ConsoleLogger;

ConsoleLogger.Severity	= {
	'all'		: 0,
	'log'		: 1,
	'warn'		: 2,
	'error'		: 3,
	'nothing'	: 99,
};

ConsoleLogger.Severity.dfl	= ConsoleLogger.Severity.nothing;

//////////////////////////////////////////////////////////////////////////////////
//		handle filter								//
//////////////////////////////////////////////////////////////////////////////////


ConsoleLogger._filters	= [];

ConsoleLogger.pushFilter	= function(validFor, severity){
	// sanity check - sanity level MUST be defined
	console.assert(Object.keys(ConsoleLogger.Severity).indexOf(severity) !== -1, 'unknown severity level');
	console.log(validFor instanceof Function);
	// push new level
	ConsoleLogger._filters.push({
		validFor	: validFor,
		severity	: ConsoleLogger.Severity[severity]
	});
};

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

ConsoleLogger.log	= function(/* ... */){
	if( ConsoleLogger.filter('log') === false )	return;
	console.log.apply(console, arguments);
}

ConsoleLogger.warn	= function(/* ... */){
	if( ConsoleLogger.filter('warn') === false )	return;
	console.warn.apply(console, arguments);	
}

ConsoleLogger.error	= function(/* ... */){
	if( ConsoleLogger.filter('error') === false )	return;
	console.error.apply(console, arguments);	
}
