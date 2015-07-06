
// better.js preffix - begining of the better.js bundle
var BetterJS = (function(){
// ...
//////////////////////////////////////////////////////////////////////////////////
//		Implement queuable getter setter				//
//////////////////////////////////////////////////////////////////////////////////

/**
 * by default __defineGetter__ support only one function. Same for __defineSetter
 * This is a annoying limitation. This little library declares 2 functions
 * Object.__defineQGetter__ and Object.__defineQGetter__.
 * They behave the same as their native sibling but support multiple functions.
 * Those functions are called in the same order they got registered.
 * 
 * (I have no idea of the reasoning behind this limitation to one function. It seems
 *  useless to me. This remind me of onclick of the DOM instead of a proper .addEventListener) 
*/


/**
 * Class to implement queueable getter/setter
 * @param  {Object} baseObject The base object on which we operate
 * @param  {String} property   The string of property
 */
var QGetterSetter	= {};

/**
 * Define a getter/setter for a property
 * 
 * @param {Object} baseObject the base object which is used
 * @param {String} property   the name of the property
 */
QGetterSetter._Property	= function(baseObject, property){
	// sanity check 
	console.assert( typeof(baseObject) === 'object' || typeof(baseObject) === 'function' );
	console.assert( typeof(property) === 'string' );
	// backup the initial value
	var originValue	= baseObject[property];
	// init some local variables
	var _this	= this;
	this._getters	= [];
	this._setters	= [];
	// the storage value
	Object.defineProperty(baseObject, '__' + property, {
	        enumerable	: false,
	        writable	: true,
	        value		: baseObject[property],
	})
	// the accessed value
	Object.defineProperty(baseObject, property, {
	        enumerable	: true,
		get		: function getterHandler(){
			var value	= baseObject['__'+property];
			for(var i = 0; i < _this._getters.length; i++){
				value	= _this._getters[i](value, getterHandler.caller, property)
			}
			return value;
		},
		set		: function setterHandler(value){
			for(var i = 0; i < _this._setters.length; i++){
				value	= _this._setters[i](value)
			}
			baseObject['__'+property] = value;
		},
	})
};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= QGetterSetter;

/**
 * init baseObject to be able to ahndle qGetterSetter
 * @param  {Object} baseObject the base object to modify
 * @param  {String} property   the property which is handled
 * @return {String}            the created property name
 */
QGetterSetter._initObjectIfNeeded	= function(baseObject, property){
	var name	= "__bjsGetSet_" + property;
	// define the property to store all the getters/setter
	if( baseObject[name] === undefined ){
		Object.defineProperty(baseObject, name, {
		        enumerable	: false,
		        value		: new QGetterSetter._Property(baseObject, property)
		});
	}
	return name
}

/**
 * define a getter 
 * 
 * @param  {Obejct} baseObject the object containing the property
 * @param  {string} property   the property name which gonna get the getter
 * @param  {Function} getterFn   function which handle the getter
 */
QGetterSetter.defineGetter	= function(baseObject, property, getterFn){
	// init QGetterSetter on this property if needed
	var name	= QGetterSetter._initObjectIfNeeded(baseObject, property)
	// setup the new getter
	baseObject[name]._getters.push(getterFn)
}

/**
 * define a setter 
 * 
 * @param  {Object} baseObject the object containing the property
 * @param  {string} property   the property name which gonna get the setter
 * @param  {Function} setterFn   function which handle the setter
 */
QGetterSetter.defineSetter	= function(baseObject, property, setterFn){
	// init QGetterSetter on this property if needed
	var name	= QGetterSetter._initObjectIfNeeded(baseObject, property)
	// setup the new setter
	baseObject[name]._setters.push(setterFn)
}

//////////////////////////////////////////////////////////////////////////////////
//		.overloadObjectPrototype()					//
//////////////////////////////////////////////////////////////////////////////////

/**
 * overload the Object.prototype with .__defineQGetter__ and .__defineQSetter__
 * 
 * TODO put that in example/js ?
 */
QGetterSetter.overloadObjectPrototype	= function(){	
	Object.prototype.__defineQGetter__	= function(property, getterFn){
		QGetterSetter.defineGetter(this, property, getterFn);
	};
	Object.prototype.__defineQSetter__	= function(property, setterFn){
		QGetterSetter.defineSetter(this, property, setterFn);
	};
}
/**
 * @namespace
 */
var Stacktrace	= {};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= Stacktrace;

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//										//
//		Stacktrace.parse()						//
//										//
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


/**
 * parse the stacktrace of an Error.
 *
 * @param  {Error|undefined} error optional error to parse. if not provided, generate one.
 * @return {Array.<Object>}	parsed stacktrace
 */
Stacktrace.parse	= function(nShift, error){
	// handle polymorphism
	nShift	= nShift !== undefined ? nShift	: 0;
	error	= error	|| new Error();
	// sanity check
	console.assert(error instanceof Error);
	// call the proper parser depending on the usage
	if( typeof(window) === 'undefined' ){
		var stacktrace	= _parserV8(error)
	}else if( navigator.userAgent.match('Chrome/') ){
		var stacktrace	= _parserV8(error)
	}else if( navigator.userAgent.match('Firefox/') ){
		var stacktrace	= _parserFirefox(error)
	}else{
		console.assert(false, 'Stacktrace.parse() not yet implemented for', navigator.userAgent)
		return [];
	}
	// add one to remove the parser*() function
	nShift	+= 1;
	console.assert(stacktrace.length >= nShift, 'stacktrace length not large enougth to shift '+nShift)
	return stacktrace.slice(nShift);

	//////////////////////////////////////////////////////////////////////////
	//									//
	//////////////////////////////////////////////////////////////////////////

	/**
	 * parse stacktrace for v8 - works in node.js and chrome
	 *
	 * Official definition of v8 stackformat
	 * https://code.google.com/p/v8-wiki/wiki/JavaScriptStackTraceApi#Appendix:_Stack_trace_format
	 */
	function _parserV8(error){
		// start parse the error stack string
		var lines	= error.stack.split("\n").slice(1);
		var stacktrace	= [];
		lines.forEach(function(line){
			if( line.match(/\(native\)$/) ){
				var matches	= line.match(/^\s*at (.+) \(native\)/);
				stacktrace.push(new Stacktrace.Frame({
					fct	: matches[1],
					url	: 'native',
					line	: 1,
					column	: 1
				}));
			}else if( line.match(/\)$/) ){
				var matches	= line.match(/^\s*at (.+) \((.+):(\d+):(\d+)\)/);
				stacktrace.push(new Stacktrace.Frame({
					fct	: matches[1],
					url	: matches[2],
					line	: parseInt(matches[3], 10),
					column	: parseInt(matches[4], 10)
				}));
			}else{
				var matches	= line.match(/^\s*at (.+):(\d+):(\d+)/);
				stacktrace.push(new Stacktrace.Frame({
					url	: matches[1],
					fct	: '<anonymous>',
					line	: parseInt(matches[2], 10),
					column	: parseInt(matches[3], 10)
				}));
			}
		});
		return stacktrace;
	};

	/**
	 * parse the stacktrace from firefox
	 */
	function _parserFirefox(error){
		// start parse the error stack string
		var lines	= error.stack.split("\n").slice(0, -1);
		var stacktrace	= [];
		lines.forEach(function(line){
			var matches	= line.match(/^(.*)@(.+):(\d+)$/);
			stacktrace.push(new Stacktrace.Frame({
				fct	: matches[1] === '' ? '<anonymous>' : matches[1],
				url	: matches[2],
				line	: parseInt(matches[3], 10),
				column	: 1
			}));
		});
		return stacktrace;
	};
}

//////////////////////////////////////////////////////////////////////////////////
//		Stacktrace.Frame						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * handle stack frame
 *
 * TODO do a .fromOriginId()
 */
Stacktrace.Frame	= function(opts){
	this.url	= opts.url;
	this.fct	= opts.fct;
	this.line	= opts.line;
	this.column	= opts.column;
};

/**
 * return the origin String
 * @return {String} the origin of the stackframe
 */
Stacktrace.Frame.prototype.originId	= function(){
	var str	= this.fct + '@' + this.url + ':' + this.line + ':' + this.column;
	return str;
};

/**
 * return a String for this object
 * @return {String} the human readable string
 */
Stacktrace.Frame.prototype.toString	= function(){
	return this.originId();
};

/**
 * get the basename of the url
 * @return {string}
 */
Stacktrace.Frame.prototype.basename	= function(){
	return this.url.match(/([^/]*)$/)[1]	|| ".";
};

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//										//
//		Stacktrace.Track						//
//										//
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

/**
 * Tracker of stacktrace
 */
Stacktrace.Tracker	= function(){
	this._klasses	= {};
}

/**
 * record an allocation of a class
 * @param  {String} className The class name under which this record is made
 */
Stacktrace.Tracker.prototype.record	= function(className, stackLevel){
	stackLevel		= stackLevel !== undefined ? stackLevel : 0;
	// init variable
	var at			= Stacktrace.Track;
	var stackFrame		= Stacktrace.parse()[stackLevel+2];
	// init Stacktrace.Track._klasses entry if needed
	this._klasses[className]= this._klasses[className]	|| {
		counter		: 0,
		perOrigins	: {}
	}
	// increase the counter
	var klass		= this._klasses[className];
	klass.counter		+= 1;
	// build the originId from stackFrame
	var originId		= stackFrame.fct + '@' + stackFrame.url + ':' + stackFrame.line;
	// update counters for this originId
	var perOrigins		= klass.perOrigins;
	perOrigins[originId]	= perOrigins[originId] !== undefined ? perOrigins[originId]  : 0;
	perOrigins[originId]	+= 1;
}

/**
 * reset all counters kepts by Stacktrace.Track
 */
Stacktrace.Tracker.prototype.reset	= function(){
	this._klasses	= {};
}

/**
 * getter for the results
 */
Stacktrace.Tracker.prototype.klasses	= function(){
	return this._klasses;
}
//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Dump current state of the tracker in console.log().
 *
 * @see Stacktrace.Tracker.reportString()
 */
Stacktrace.Tracker.prototype.dump	= function(){
	var report	= this.reportString.apply(this, arguments)
	console.log(report);
}

/**
 * Reporter in a String
 *
 * @param  {RegExp} classNameRegExp regexp of the classname to keep
 * @param  {Number} maxNOrigin      nb origin to display per class
 */
Stacktrace.Tracker.prototype.reportString	= function(classNameRegExp, maxNOrigin){
	// handle polymorphism
	classNameRegExp	= classNameRegExp	|| /./;
	maxNOrigin	= maxNOrigin !== undefined ? maxNOrigin	: 3;
	// define local variable
	var output	= [];
	var classNames	= Object.keys(this._klasses);
	// sort classes by descending .counter
	classNames.sort(function(a, b){
		return this._klasses[b].counter - this._klasses[a].counter;
	}.bind(this));
	// filter by classname
	classNames	= classNames.filter(function(className){
		return className.match(classNameRegExp) ? true : false
	});
	// display the rest
	classNames.forEach(function(className){
		var klass	= this._klasses[className];
		output.push(className+': total '+klass.counter+' times');

		var perOrigins	= klass.perOrigins;

		var ranks	= Object.keys(perOrigins);
		ranks.sort(function(a, b){
			return perOrigins[b] - perOrigins[a];
		});

		//console.dir(aClass._newCounters)
		//console.log('ranks', ranks)

		ranks.slice(0, maxNOrigin).forEach(function(originId){
			var perOrigin	= perOrigins[originId];
			output.push('\t'+originId+' - '+perOrigin+' times')
			//console.log(counters[origin], "new aClass at ", origin);
		});
	}.bind(this));
	return output.join('\n');
};
/**
 * assert which actually try to stop the excecution
 * if debug.assert.useDebugger is falsy, throw an exception. else trigger the
 * debugger. It default to false. unclear how usefull it is for node.js
 * to overload console.assert just do ```console.assert	= assertWhichStop;```.
 * Based on https://gist.github.com/2651899 done with jensarps.
 *
 * @param {Boolean} condition the condition which is asserted
 * @param {String} message the message which is display is condition is falsy
 * @param {Boolean} [useDebugger] if true, a failled assert will trigger js debugger
*/
var assertWhichStop	= function(condition, message, useDebugger){
	if( condition )	return
	if( assertWhichStop.useDebugger || useDebugger )	debugger;
	throw new Error(message	|| "Assert Failed");
}

/**
 * if true, a fail assert will trigger js debugger
 * 
 * @type {Boolean}
 */
assertWhichStop.useDebugger	= false;

// export the class in node.js - if running in node.js - unclear how usefull it is in node.js
if( typeof(window) === 'undefined' )	module.exports	= assertWhichStop;

/**
 * Little helper to overload console.assert
 * @api public
 * @todo a .offConsoleAPI() or noConflict() which restore it
 */
assertWhichStop.overloadConsole	= function(){
	console.assert	= assertWhichStop;
}
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
/**
 * detect gabarge collector occurance. Require v8 for now, so chrome or node.js.
 * typical usage: <code>new GcMonitor().start();</code>
 * 
 * @class monitor gabage collector activities
 * 
 * see details in http://buildnewgames.com/garbage-collector-friendly-code/
 */
var GcMonitor	= function(){
	// init a timer
	var _this	= this;
	var timerid	= null;
	// define function to return used heap size
	var inNode	= typeof(window) === 'undefined' ? true : false;
	var usedHeapSize= inNode ? function(){
		return process.memoryUsage().heapUsed;	
	} : function(){
		if( !window.performance || !window.performance.memory )	return 0;
		return window.performance.memory.usedJSHeapSize;	
	};

	// sanity check - if not available, output a warning
	if( GcMonitor.isAvailable() === false ){
		// open -a "/Applications/Google Chrome.app" --args --enable-memory-info
		console.warn('memory info are unavailable... for chrome, use --enable-memory-info. Other browsers dont have this feature.')
	}

	/**
	 * Start monitoring periodically
	 * 
	 * @param {Function|undefined} onChange optional function to notify when gc occurs
	 * @param {Number|undefined} period period of the check. default to 50ms
	 */
	this.start	= function(onChange, period){
		period	= period	|| 1000/60;
		onChange= onChange	|| function(delta){
			function bytesToSize(bytes, nFractDigit) {
				var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				if (bytes == 0) return '0';
				nFractDigit	= nFractDigit !== undefined ? nFractDigit : 2;
				var precision	= Math.pow(10, nFractDigit);
				var i 		= Math.floor(Math.log(bytes) / Math.log(1024));
				return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
			};
			console.warn(new Date + " -- GC occured! saved", bytesToSize(delta), 'consuming at', bytesToSize(burnRate), 'per second')
		}
		timerid	= setInterval(function(){
			_this.check(onChange);
		}, period);
		return this;	// for chained api
	};
	/**
	 * Stop monitoring periodically
	 */
	this.stop	= function(){
		cancelInterval(timerid);	
	};
	
	var lastUsedHeap	= null;
	var lastTimestamp	= null;
	var burnRate		= null;	
	/**
	 * Check if currently used memory is less than previous check. If so it 
	 * is assume a GC occured
	 * 
	 * @param  {Function|undefined} onChange callback notified synchronously if gc occured
	 */
	this.check	= function(onChange){
		// parameter polymorphism
		onChange	= onChange || function(property){}

		var present	= Date.now();//console.log('present', (present - lastTimestamp)/1000)
		var currUsedSize= usedHeapSize();

		if( lastUsedHeap === null ){
			lastUsedHeap	= currUsedSize;
			lastTimestamp	= present;
			return;
		}

		// check if the heap size in this cycle is LESS than what we had last
		// cycle; if so, then the garbage collector has kicked in
		var deltaMem	= currUsedSize - lastUsedHeap;
		if( deltaMem < 0 ){
			onChange(-deltaMem, burnRate);		
		}else{
			var deltaTime	= present - lastTimestamp
			var newBurnrate	= deltaMem / (deltaTime/1000);
			if( burnRate === null )	burnRate	= newBurnrate;
			var friction	= 0.99;
			burnRate	= burnRate * friction + newBurnrate * (1-friction);
		}

		lastUsedHeap	= currUsedSize;
		lastTimestamp	= present;
	}
	
	/**
	 * getter for the burnRate
	 * @type {Number}
	 */
	this.burnRate	= function(){
		if( burnRate === null )	return 0;
		return burnRate;
	}
	
	/**
	 * getter for the usedHeapSize
	 * @return {Number} used heap size in byte
	 */
	this.usedHeapSize	= function(){
		return usedHeapSize();
	}
}

/**
 * check if it is available on the plateform it runs on 
 * 
 * @return {Boolean} true if it is available, false otherwise
 */
GcMonitor.isAvailable	= function(){
	var inNode	= typeof(window) === 'undefined' ? true : false;
	if( inNode )	return true;
	if( !window.performance	)	return false;
	if( !window.performance.memory)	return false;
	return true;	
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= GcMonitor;
/**
 * Used to detect globals. works in node.js and browser
 * 
 * from http://stackoverflow.com/questions/5088203/how-to-detect-creation-of-new-global-variables
 * 
 * @class detect globals
 */
var GlobalDetector	= function(){
	// take the namespace for global
	var inBrowser 	= typeof(window) !== 'undefined'	? true : false
	var _global	= inBrowser ?  window :  global;
	// sanity check - a global namespace MUST be found
	console.assert( _global, 'failed to find a global namespace! bailing out!' );
	// init initialGlobals
	var initialGlobals	= {};
	// loop on _global object
	for(var propname in _global){
		initialGlobals[propname] = true;
	}
	// init foundGlobals
	var foundGlobals= {};
	
	// init a timer
	var _this	= this;
	var timerid	= null;
	
	/**
	 * Start periodically monitoring
	 * @param  {Function+}	onChange optional callback called when a new global is found
	 * @param  {Number+}	period   period at which it is checked
	 */
	this.start	= function(onChange, period){
		period	= period	|| 1000;
		onChange= onChange	|| function(newProperty){
			var str	= new Date + " -- Warning Global Detected!!! "
			str	+= (inBrowser ? 'window': 'global');
			str	+= "['"+newProperty+"'] === " + _global[newProperty];
			console.warn(str)
		};
		timerid	= setInterval(function(){
			_this.check(onChange);
		}, period);
		return this;	// for chained API
	};
	/**
	 * Stop periodically monitoring
	 */
	this.stop	= function(){
		cancelInterval(_timerid);	
	};
	/**
	 * Check if any new global has been declared
	 * @param  {Function+} onChange optional callback called synchronously if a new global is found
	 * @return {Boolean} true if some new globals have been detected, false otherwise
	 */
	this.check	= function(onChange){
		var newGlobal	= false;
		// parameter polymorphism
		onChange	= onChange || function(property){}
		// new loop on _global object
	        for(var property in _global){
	        	// if it is in the initialGlobals, goto the next
			if( initialGlobals[property] )	continue;
			// if this is already in the ignoreList, goto the next
			if( GlobalDetector.ignoreList.indexOf(property) !== -1 )	continue;
	        	// if it already found, goto the next
			if( foundGlobals[property] )	continue;
			// mark this property as init
			foundGlobals[property]	= true;
			// mark newGlobal
			newGlobal	= true;
			// notify callback
			onChange(property);
	        }
	        return newGlobal;
	};
	/**
	 * getter for the foundGlobals up to now
	 * @return {Object} object with keys as property names
	 */
	this.foundGlobals	= function(){
		return foundGlobals;
	};
};

/**
 * list of variables name to ignore. populated at constructor() time
 * @type {String[]}
 */
GlobalDetector.ignoreList	= [];


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= GlobalDetector;
/**
 * ensure private property/method stays private
 *
 * @namespace Strong typing for javascript
 */
var Privatize	= {};

// include dependancies
var Stacktrace		= Stacktrace	|| require('./stacktrace.js');
var QGetterSetter	= QGetterSetter|| require('./qgettersetter.js')


// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= Privatize;

//////////////////////////////////////////////////////////////////////////////////
//		Handle PrivateOKFn						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * determine which function is considered private for klass 
 * 
 * @param  {function} klass  the constructor of the class
 * @param  {function} privateFn 	private function to add
 */
Privatize.pushPrivateOkFn	= function(instance, privateFn){
	// init if needed
	Privatize.init(instance);
	// actually add the function
	instance._privateOkFn.push(privateFn)
}


Privatize.init	= function(instance){
	// create the storage value if needed - with non enumerable
	if( instance._privateOkFn === undefined ){
		Object.defineProperty(instance, '_privateOkFn', {
		        enumerable	: false,
		        writable	: true,
		        value		: [],
		})
	}	
}

//////////////////////////////////////////////////////////////////////////////////
//		core								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * define a private property on a given instance of a object class
 * @param  {Object} instance	the object instance
 * @param  {String} property	the property name
 * @return {undefined}		nothing
 */
Privatize.property	= function(instance, property){
	// init if needed
	Privatize.init(instance);
	// check private in the getter
	QGetterSetter.defineGetter(instance, property, function aFunction(value, caller, property){
// console.log('check getter property', property, instance._privateOkFn)
		// if caller not privateOK, notify the caller
		if( instance._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[2]
			// log the event
			console.assert(false, 'access to private property "'+property+'" from '+stackFrame)
		}
		// actually return the value
		return value;
	});
	// check private in the setter
	QGetterSetter.defineSetter(instance, property, function aFunction(value, caller, property){
// console.log('check setter property', property)
		// if caller not privateOK, notify the caller
		if( instance._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[2]
			// log the event
			console.assert(false, 'access to private property "'+property+'" from '+stackFrame)
		}
		// actually return the value
		return value;
	});
};


/**
 * define a private function
 * @param  {Object} instance	the object instance
 * @param  {Function} fn    the function to overload
 * @return {Function}       the overloaded function
 */
Privatize.function	= function(instance, fn){
	var functionName= fn.name || 'anonymous'
	return function _checkFunction(){
		// get caller
		var caller	= _checkFunction.caller;
		// if caller not privateOK, notify the caller
// console.log('check function', functionName)
		if( instance._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[1]
			// log the event
			console.assert(false, 'access to private function "'+functionName+'" from '+stackFrame)
		}
		// forward the call to the original function
		return fn.apply(this, arguments);
	};
};

//////////////////////////////////////////////////////////////////////////////////
//		Helpers								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * get all the functions of the instance, and declare them privateOK
 * 
 * @param  {Object} instance [description]
 */
Privatize.prepare	= function(instance){
	// init if needed
	Privatize.init(instance);
	// populate the ._privateOkFn with the .prototype function which start by '_'
	for(var property in instance){
		// TODO should i do a .hasOwnProperty on a .prototype ?
		if( typeof(instance[property]) !== 'function')	continue;
		// console.log('PrivateOKFn', property)
		Privatize.pushPrivateOkFn(instance, instance[property])
	}	
}


/**
 * declare any property/functions starting with '_' as private
 * 
 * @param  {object} instance	the instance of the object
 */
Privatize.privatize	= function(instance, selectorRegexp){
	selectorRegexp	= selectorRegexp	|| /^_.*/
	// init if needed
	Privatize.init(instance);
	// declare any property/functions starting with '_' as private	
	for(var property in instance){
		if( property.match(selectorRegexp) === null )		continue;
		if( typeof(instance[property]) === 'function' ){
			// console.log('declare', property, 'as private function')
			instance[property] = Privatize.function(instance, instance[property])
		}else{
			// console.log('declare', property, 'as private property')
			Privatize.property(instance, property);		
		}
	}
};

/**
 * @fileOverview contains StrongTyping class
 * 
 * if input of type in text see 
 * * https://developers.google.com/closure/compiler/docs/js-for-compiler
 * * use same format
 * * autogenerate function parameter check
 */

/**
 * @namespace Strong typing for javascript
 */
var StrongTyping	= {};

// dependancy
var QGetterSetter	= QGetterSetter	|| require('../src/qgettersetter.js')

// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= StrongTyping;


/**
 * Check type with a object setter
 * 
 * @param  {Object} baseObject the base object which contains the property
 * @param  {String} property   the string of the property name
 * @param  {Array}  allowedTypes      the allows tipe
 */
StrongTyping.setter	= function(baseObject, property, allowedTypes){
	// check initial value
	var value	= baseObject[property];
	var isValid	= StrongTyping.value(value, allowedTypes)
	console.assert(isValid, 'initial value got invalid type');
	// setup the setter
	QGetterSetter.defineSetter(baseObject, property, function(value){
		// check the value type
		var isValid	= StrongTyping.value(value, allowedTypes);

		console.assert(isValid, 'Invalid type. MUST be a'
			, StrongTyping.allowedTypesToString(allowedTypes)
			, 'and it is'
			, StrongTyping.valueTypeToString(value))

		// return the value
		return value;
	});
};

/**
 * function wrapper to check the type of function parameters and return value
 * 
 * @param  {Function} originalFn  the function to wrap
 * @param  {Array}    paramsTypes allowed types for the paramter. array with each item is the allowed types for this parameter.
 * @param  {Array}    returnTypes allowed types for the return value
 * @return {boolean}  return isValid, so true if types matche, false otherwise
 */
StrongTyping.fn	= function(originalFn, paramsTypes, returnTypes){
// TODO is this usefull ? isnt that a duplicate with propertyAttr2

	return function StrongTyping_fn(){
		// check arguments type
		console.assert(arguments.length <= paramsTypes.length, 'function received '+arguments.length+' parameters but allows only '+paramsTypes.length+'!');
		for(var i = 0; i < paramsTypes.length; i++){
			var isValid	= StrongTyping.value(arguments[i], paramsTypes[i]);			
			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', StrongTyping.allowedTypesToString(paramsTypes[i]), 'It is ===', arguments[i])
		}
		// forward the call to the original function
		var result	= originalFn.apply(this, arguments);
		// check the result type
		var isValid	= StrongTyping.value(result, returnTypes);			
		console.assert(isValid, 'invalid type for returned value. MUST be of type', StrongTyping.allowedTypesToString(returnTypes), 'It is ===', result);
		// return the result
		return result;
	}
}



//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * Check the type of a value
 * 
 * @param  {*} value the value to check
 * @param  {Array.<function>} types the types allowed for this variable
 * @return {boolean} return isValid, so true if types matche, false otherwise
 */
StrongTyping.value	= function(value, types){
	// handle parameter polymorphism
	if( types instanceof Array === false )	types	= [types];
	// if types array is empty, default to ['always'], return true as in valid
	if( types.length === 0 )	return true;
	// go thru each type
        var result      = false
	for(var i = 0; i < types.length; i++){
		var type	= types[i];
		var match	= testTypeMatchesValue(type, value)
                // if match is 'NEVER', it will 
                if( match === 'NEVER')  return false;
                console.assert(match === true || match === false)
                
                result	= result || match;
	}
	// return the just computed result
	return result;


        /**
         * test if a type matches a value
         * @param {*} type  - the type
         * @param {*} value - the value
         * @return {Boolean|String} - true if they matches, false if they dont match, 'NEVER' to declare the value 
         * will never match
         */
        function testTypeMatchesValue(type, value){
                // PRIMITIVE TYPE
		if( type === Number ){
			return typeof(value) === 'number';
		}else if( type === String ){
			return typeof(value) === 'string';
		}else if( type === Boolean ){
			return typeof(value) === 'boolean'
		}else if( type === Function ){
			return value instanceof Function;
		}else if( type === undefined ){
			return typeof(value) === 'undefined';
		}else if( type === null ){
			return value === null;

                // CUSTOM TYPE
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'any' ){
			return true
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'never' ){
			return false;

                // VALIDATORS
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonnull' ){
			if( value === null )	return 'NEVER'
			return false;	// continue as it is a validator
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonan' ){
			if( isNaN(value) === true )	return 'NEVER';
			return false;	// continue as it is a validator
		}else if( type instanceof StrongTyping._ValidatorClass ){
			var isValid	= type.fn(value);
			if( isValid === false )	return 'NEVER';
 			return false;	// continue as it is a validator
                
                // HANDLE 'TYPE-IN-STRING' case
		}else if( typeof(type) === 'string' ){
                        // this mean type is a string containing a type, so we eval it and test it
			return testTypeMatchesValue(eval(type), value)

                // INSTANCEOF
                }else{
                        // here type is supposedly a contructor function() so we use instanceof
        		return value instanceof type;                        
                }
        }
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Validator creator. a Validator is a function which is used to validate .value().
 * All the validators MUST be true for the checked value to be valid. 
 * 
 * @param {Function(value)} fn function which return true if value is valid, false otherwise
 */
StrongTyping.Validator	= function(fn){
	return new StrongTyping._ValidatorClass(fn)
}

/**
 * Internal class to be recognisable by StrongTyping.value()
 * 
 * @param  {Function} fn function which return true if value is valid, false otherwise
 */
StrongTyping._ValidatorClass= function(fn){
	console.assert(fn instanceof Function);
	this.fn	= fn;
}


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * Convert allowed types into String
 * @param  {Array} allowedTypes - allowed types
 * @return {String}       the just-built string
 */
StrongTyping.allowedTypesToString	= function(allowedTypes){
	// handle parameter polymorphism
	if( allowedTypes instanceof Array === false ){
		return typeToString(allowedTypes)
	}

	var output = '['
	for(var i = 0; i < allowedTypes.length; i++){
		if( i > 0 )	output += ', '
		output += typeToString(allowedTypes[i])
	}
	output += ']'
	return output

	/**
	 * convert one allowed type to a string
	 * 
	 * @param  {any} allowedType - the allowed type
	 * @return {String}          - the string for this type
	 */
	function typeToString(allowedType){
		if( allowedType === Number )	return 'Number'
		if( allowedType === String )	return 'String'
		if( allowedType === Object )	return 'Object'
		return allowedType.toString()
	}
}

/**
 * get the type of a value and return it as a String
 * 
 * @param  {any} value - allowed types
 * @return {String}       the just-built string
 */
StrongTyping.valueTypeToString	= function(value){
	if( typeof(value) === 'string' )	return 'String'
	if( typeof(value) === 'number' )	return 'Number'
	if( typeof(value) === 'object' )	return 'Object'

	return typeof(value)
}
/**
 * use Proxy API to freeze access and creation of unexisting property.
 * After this, if you read a unexisting property, you will get an exception, instead of the usual undefined.
 * After this, if you write on a unexisting property, you will get an exception, instead of a new property.
 * 
 * @param  {Object} target the object to protect
 * @param  {String} permission 'read' to protect only read, 'write' for write only, 'rw' for both
 * @return {Object} the protected object
 */
var ObjectIcer	= function(target, permission){
	console.assert(ObjectIcer.isAvailable, 'harmony Proxy not enable. try chrome://flags or node --harmony')
	permission	= permission	|| 'rw'
	console.assert(permission === 'rw' || permission === 'write' || permission === 'read', 'permission argument is invalid')
	var checkRead	= permission === 'read'	|| permission === 'rw'
	var checkWrite	= permission === 'write'|| permission === 'rw'
	// use old proxy API because v8 doesnt have the new API, firefox got it tho
	return Proxy.create({
		get	: function(receiver, name){
			if( checkRead && (name in target) === false ){
				console.assert((name in target) === true, 'reading unexisting property '+name)			
			}
			return target[name]
		},
		set	: function(receiver, name, value){
			if( checkWrite && (name in target) === false ){
				console.assert((name in target) === true, 'setting unexisting property '+name)
			}
			target[name]	= value
			return true
		},
		// without this one, i receive errors ?
		has	: function (name) {
			return name in target ? true : false
		},
	})
}

/**
 * check if the feature is available or not
 * @type {Boolean}
 */
ObjectIcer.isAvailable        = typeof(Proxy) !== 'undefined' && typeof(Proxy.create) === 'function'

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ObjectIcer;
/**
 * @fileOverview definition of PropertyAttr - based on other core libraries
 */

var StrongTyping= StrongTyping	|| require('../strongtyping.js');
var Privatize	= Privatize	|| require('../privatize.js');

/** 
 * plugin system
 * * seem cool, but you loose all the shortness of closure
 * * so not now
 */
// FunctionAttr.plugins	= {}
// FunctionAttr.plugins['arguments']	= {
// 	onBefore	: function(){
// 		var allowedTypes	= attributes.arguments
// 		console.assert(args.length <= allowedTypes.length, 'function received '+args.length+' parameters but allows only '+allowedTypes.length+'!');
// 		for(var i = 0; i < allowedTypes.length; i++){
// 			var isValid	= StrongTyping.value(args[i], allowedTypes[i]);
// 			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', allowedTypes[i], 'It is ===', arguments[i])
// 		}		
// 	}
// }
// FunctionAttr.plugins['return']	= {
// 	onAfter		: function(instance, args, returnedValue){
// 		var allowedTypes= attributes.return
// // console.log('blabla', arguments)
// 		var isValid	= StrongTyping.value(returnedValue, allowedTypes)
// 		console.assert(isValid, 'invalid type for returned value. MUST be of type', allowedTypes, 'It is ===', returnedValue)			
// 	}
// }

/**
 * [FunctionAttr description]
 * 
 * @param {Object} baseObject the base object
 * @param {String} property   the property name
 * @param {Object} attributes the attributes for this property
 */
var FunctionAttr	= function(originalFn, attributes){
	var functionName= attributes.name	|| originalFn.name
	
	// to honor .private
	var privateDone	= false

	return wrapFunction(originalFn, functionName, function(instance, args){
		// honor .private
		// TODO to change, this wait for the first call.... this is crappy
		// make it such as 'instance' MUST be provided by the caller
		if( privateDone === false && attributes.private === true ){
			Privatize.pushPrivateOkFn(instance, originalFn)
			privateDone	= true
		}

		// honor .arguments - check arguments type
		if( attributes.arguments !== undefined ){
			var allowedTypes	= attributes.arguments
			console.assert(args.length <= allowedTypes.length, 'function received '+args.length+' parameters but allows only '+allowedTypes.length+'!');
			for(var i = 0; i < allowedTypes.length; i++){
				var isValid	= StrongTyping.value(args[i], allowedTypes[i]);
				console.assert(isValid, 'argument['+i+'] type is invalid. MUST be a'
					, StrongTyping.allowedTypesToString(allowedTypes[i])
					, 'and it is'
					, StrongTyping.valueTypeToString(args[i]))
			}			
		}
	}, function(returnedValue, instance, args){
		// honor .return - check the result type
		if( attributes.return !== undefined ){
			var allowedTypes= attributes.return
			var isValid	= StrongTyping.value(returnedValue, allowedTypes)
			console.assert(isValid, 'invalid type for returned value. MUST be a'
				, StrongTyping.allowedTypesToString(allowedTypes)
				, 'and it is'
				, StrongTyping.valueTypeToString(returnedValue))
		}
	})
	
	return
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	function wrapFunction(originalFn, functionName, onBefore, onAfter){
		// arguments default
		onBefore= onBefore	|| function(/* ... */){}
		onAfter	= onAfter	|| function(/* ... */){}
		var fn	= function SuperName(){
			// notify onBefore
			onBefore(this, arguments)
			// forward the call to original contructor
			var returnedValue	= originalFn.apply(this, arguments);
			// notify onAfter				
			onAfter(returnedValue, this, arguments)
			// actually return the value
			return returnedValue;
		}
		// mechanism to get fn with the propername
		// - see https://github.com/jeromeetienne/creatorpattern.js
		var jsCode	= fn.toString().replace(/SuperName/g, functionName) 
		eval('fn = '+jsCode+';')
		// return the just built function
		return fn
	}
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= FunctionAttr;


/**
 * @fileOverview definition of PropertyAttr - based on other core libraries
 */

var StrongTyping= StrongTyping	|| require('../strongtyping.js');
var Privatize	= Privatize	|| require('../privatize.js');

/**
 * [PropertyAttr description]
 * 
 * @param {Object} baseObject the base object
 * @param {String} property   the property name
 * @param {Object} attributes the attributes for this property
 */
var PropertyAttr	= function(baseObject, property, attributes){
	// honor .value
	if( attributes.value ){
		baseObject[property]	= attributes.value
	}

	// honor .type	
	if( attributes.type ){
		var allowedType	= attributes.type
		StrongTyping.setter(baseObject, property, allowedType)
	}

	// honor .private
	if( attributes.private ){
		Privatize.property(baseObject, property)
	}
	
	// honor .value
	if( attributes.value ){
		return attributes.value
	}
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PropertyAttr;
/**
 * @fileOverview definition of ClassAttr - based on other core libraries
 * 
 * ## useful links
 * * object constructor https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
 */

/*
var MyClass	= ClassAttr(ctor, {
	ice		: true,	// to prevent read/write non existing properties
				// 'all' or true
				// 'none' or false
				// 'read'
				// 'write'

	name	: 'myClass',	// the name of the class, name the ctor function

	obsolete: 'obsolete since v1.0',	// log once this message on usage, then throw an exception
	deprecated: 'deprecated since v1.0',	// long once this message on usage


	privatize	: true;	// privatize functions and property
				// false
				// 'functions'	for later
				// 'properties'	for later
	arguments	: allowedTypeForFn,
	properties	: {
		'yourProp'	: [String, Number]
	}
})
*/

var StrongTyping= StrongTyping	|| require('../strongtyping.js');
var Privatize	= Privatize	|| require('../privatize.js');

var ClassAttr	= function(originalCtor, attributes){
	// handle arguments default values
	attributes	= attributes	|| ClassAttr.defaultAttributes
	
	// arguments parameter checks
	console.assert(originalCtor instanceof Function, 'invalid parameter type')

	var className	= attributes.name	|| originalCtor.name
	var onBefore	= attributes.onBefore	|| function(instance, args){}
	var onAfter	= attributes.onAfter	|| function(instance, args){}
	
	return wrapCtor(originalCtor, className, function(instance, args){
		// honor .arguments
		if( attributes.arguments ){
			var allowedTypes	= attributes.arguments
			for(var i = 0; i < allowedTypes.length; i++){
				var isValid	= StrongTyping.value(args[i], allowedTypes[i]);			
				console.assert(isValid, 'argument['+i+'] type is invalid. MUST be a'
					, StrongTyping.allowedTypesToString(allowedTypes[i])
					, 'and it is'
					, StrongTyping.valueTypeToString(args[i]))
			}
		}

		// honor onBefore
		onBefore(instance, args)
	}, function(instance, args){
		// honor .properties
		if( attributes.properties ){
			Object.keys(attributes.properties).forEach(function(property){
				var allowedTypes	= attributes.properties[property]
				StrongTyping.setter(instance, property, allowedTypes)
			})
		}


		// honor .ice
		// console.log('ice', attributes.ice, ObjectIcer.isAvailable)

		// if( attributes.ice && ObjectIcer.isAvailable === true ){
		// 	instance	= ObjectIcer(instance)
		// }

		// honor onAfter
		onAfter(instance, args)
		
		// honor .privatize
		if( attributes.privatize ){
			Privatize.prepare (instance)
			Privatize.privatize(instance)
		}

		return instance
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
		
	function wrapCtor(originalCtor, className, onBefore, onAfter){
		// arguments default
		onBefore= onBefore	|| function(instance, args){}
		onAfter	= onAfter	|| function(instance, args){}
		var fn	= function SuperName(){
			// notify onBefore
			onBefore(this, arguments)
			// forward the call to original contructor
			originalCtor.apply(this, arguments);
			// notify onAfter				
			onAfter(this, arguments)
		}
		// mechanism to get fn with the propername
		// - see https://github.com/jeromeetienne/creatorpattern.js
		var jsCode	= fn.toString().replace(/SuperName/g, className) 
		eval('fn = '+jsCode+';')
		// inherit from original prototype
		// - reference or copy with Object.Create() ?
		// - this is the old three.js to inherit
		fn.prototype	= originalCtor.prototype
		fn.prototype.constructor = originalCtor;
		// return the just built function
		return fn
	}
}

/**
 * default attributes value to use if not provided
 * 
 * @type {Object}
 */
ClassAttr.defaultAttributes	= {};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ClassAttr;


//////////////////////////////////////////////////////////////////////////////////
//		Helpers								//
//////////////////////////////////////////////////////////////////////////////////

/**
 *  overload global ```Function``` prototype to add ClassAttr
 *  
 *  ```
 *  var Cat = function(name){
 *  }.classAttr({ privatize : true })
 *  ```
 */
ClassAttr.overloadFunctionPrototype	= function(){
	Function.prototype.classAttr	= function(attributes){
		return ClassAttr(this, attributes)
	}
}
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

BetterJS.Property	= PropertyAttr

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
BetterJS.Function	= FunctionAttr

// TODO to remove this - uselessly kludgy
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


	// End of Better.js
	return BetterJS
})();

// shorter Alias for Better.js - optional
var Better	= BetterJS;
