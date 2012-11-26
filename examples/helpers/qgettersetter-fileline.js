var Stacktrace		= Stacktrace	|| require('../../src/stacktrace.js');
var QGetterSetter	= QGetterSetter	|| require('../../src/qgettersetter.js');

(function(){
	var _global	= typeof(window) === 'undefined' ? global : window;
	
	/**
	 * Same as __LINE__ in C
	*/
	QGetterSetter.defineGetter(_global, '__LINE__', function(){
		var stacktrace	= Stacktrace.parse();
		var stackFrame	= stacktrace[2];
		return stackFrame.line
	});

	/**
	 * Same as __LINE__ in C
	*/
	QGetterSetter.defineGetter(_global, '__FILE__', function(){
		var stacktrace	= Stacktrace.parse();
		var stackFrame	= stacktrace[2];
		return stackFrame.basename();
	});

	/**
	 * Same as __FUNCTION__ in C
	*/
	QGetterSetter.defineGetter(_global, '__FUNCTION__', function(){
		var stacktrace	= Stacktrace.parse();
		var stackFrame	= stacktrace[2];
		return stackFrame.fct;
	});
})();
