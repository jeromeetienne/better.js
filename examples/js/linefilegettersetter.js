var Stacktrace	= Stacktrace	|| require('../../src/stacktrace.js');

(function(){
	var _global	= typeof(window) === 'undefined' ? global : window;
	
	/**
	 * Same as __LINE__ in C
	*/
	_global.__defineQGetter__('__LINE__', function(){
		var stacktrace	= Stacktrace.parse();
		var stackFrame	= stacktrace[2];
		return stackFrame.line
	});

	/**
	 * Same as __LINE__ in C
	*/
	_global.__defineQGetter__('__FILE__', function(){
		var stacktrace	= Stacktrace.parse();
		var stackFrame	= stacktrace[2];

		var url		= stackFrame.url;
		var basename	= url.match(/([^/]*)$/)[1]	|| ".";
		//console.log("stacktrace", stacktrace, "url", url, "basename", basename)
		return basename;
	});

	/**
	 * Same as __FUNCTION__ in C
	*/
	_global.__defineQGetter__('__FUNCTION__', function(){
		var stacktrace	= Stacktrace.parse();
		var stackFrame	= stacktrace[2];
		return stackFrame.fct;
	});
})();
