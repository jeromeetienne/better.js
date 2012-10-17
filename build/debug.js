var Stacktrace	= Stacktrace	|| require('../src/stacktrace')

/**
 * @namespace
 */
var allocationTracker	= new Stacktrace.Tracker();

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= allocationTracker;
/**
 * assert which actually try to stop the excecution
 * if debug.assert.useDebugger is falsy, throw an exception. else trigger the
 * debugger. It default to false. unclear how usefull it is for node.js
 * to overload console.assert just do ```console.assert	= assertWhichStop;```

 *
 * @param {Boolean} condition the condition which is asserted
 * @param {String} message the message which is display is condition is falsy
 * @param {Boolean} [useDebugger] the condition which is asserted
*/
assertWhichStop	= function(condition, message, useDebugger){
	if( condition )	return;
	if( assertWhichStop.useDebugger || useDebugger )	debugger;
	throw new Error(message	|| "assert Failed")
}
assertWhichStop.useDebugger	= false;

// export the class in node.js - if running in node.js - unclear how usefull it is in node.js
if( typeof(window) === 'undefined' )	module.exports	= assertWhichStop;

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
//////////////////////////////////////////////////////////////////////////////////
//		Modification							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * change global object function bar(){}.setAttr('bar').end();
 * 
 * @param {string} fnName the name of the function 
 */
Function.prototype.setAttr	= function(fnName){
	return fnAttr(this, fnName)
}


//////////////////////////////////////////////////////////////////////////////////
//		Function Attribute						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Function attribute creator
 * 
 * @return {FnAttrClass} a FnAttrClass builder
*/
var fnAttr	= function(originalFn, fnName){
	return new FnAttrClass(originalFn, fnName)
}

/**
 * Wrap a function between 2 functions
 * 
 * @param {Function} originalFn the original function
 * @param {Function} beforeFn the function to call *before* the original function
 * @param {Function} afterFn the function to call *after* the original function
 * @returns {Function} The modified function
*/
fnAttr.wrapCall	= function(originalFn, beforeFn, afterFn){
	return function(){
		var stopNow	= false;
		// call beforeFn if needed
		if( beforeFn )	stopNow = beforeFn(originalFn, arguments);
		// forward the call to the original function
		var result	= originalFn.apply(this, arguments);
		// call afterFn if needed
		if( afterFn )	afterFn(originalFn, arguments, result);
		// return the result
		return result;
	}
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Internal class to build the attributes on the funciton
 * 
 * @constructor
 * 
 * @param {Function} originalFn the function on which the attributes are set
 * @param {String}   fnName     optional name of the function - default to 'aFunction'
 */
var FnAttrClass	= function(originalFn, fnName){
	this._currentFn	= originalFn;
	this._fnName	= fnName	|| 'aFunction'
}

/**
 * mark the end of the attributes declaration
 * 
 * @return {Function} The actual function with the attributes
*/
FnAttrClass.prototype.done	= function(){
	return this._currentFn;
}

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= fnAttr;


//////////////////////////////////////////////////////////////////////////////////
//		generic								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * display a message with a timestamp every time the function is used
 * @return {string} message optional message to display
 */
FnAttrClass.prototype.timestamp	= function(message){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		console.log(''+ new Date + ': '+this._fnName+' being called');
	}.bind(this));
	return this;	// for chained API
};

/**
 * log a message when the function is call
 * @param  {string} message the message to display
 */
FnAttrClass.prototype.log		= function(message){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		console.log(message);
	});
	return this;	// for chained API
};


//////////////////////////////////////////////////////////////////////////////////
//		support state							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * mark the function as deprecated - aka you can use it but it will disapears soon
 * @param  {string} message the optional message to provide
 */
FnAttrClass.prototype.deprecated	= function(message){
	var used	= false;
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		if( used )	return;
		used	= true;
		console.warn(message || "Deprecated function "+this._fnName+" called. Please update your code.");
	}.bind(this));
	return this;	// for chained API
}

/**
 * mark the function as obsolete
 * @param  {string} message obsolete message to display
 */
FnAttrClass.prototype.obsolete	= function(message){
	var used	= false;
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		if( used )	return;
		used	= true;
		console.assert(false, message || "Obsoleted function "+this._fnName+" called. Please update your code.");
	}.bind(this));
	return this;	// for chained API
}

//////////////////////////////////////////////////////////////////////////////////
//		General hooks								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * hook a function be be caller before the actual function
 * @param  {Function} beforeFn the function to call
 */
FnAttrClass.prototype.before	= function(beforeFn){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, beforeFn, null);
	return this;	// for chained API
};

/**
 * hook a function to be called after the actual function
 * @param  {Function} afterFn the function to be called after
 */
FnAttrClass.prototype.after	= function(afterFn){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, null, afterFn);
	return this;	// for chained API
};

//////////////////////////////////////////////////////////////////////////////////
//		Benchmarking								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Warp the function call in a console.time()
 * 
 * @param  {String} label the label to use for console.time(label)
 */
FnAttrClass.prototype.time	= function(label){
	label	= label !== undefined ? label : this._fnName+".time()-"+Math.floor(Math.random()*9999).toString(36);
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		console.time(label)
	}, function(){
		console.timeEnd(label)
	});
	return this;	// for chained API
};

/**
 * Warp the funciton call in console.profile()/.profileEnd()
 * 
 * @param  {String} label label to use for console.profile()
 */
FnAttrClass.prototype.profile	= function(label){
	label	= label !== undefined ? label : this._fnName+".profile-"+Math.floor(Math.random()*9999).toString(36);
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		console.profile(label)
	}, function(){
		console.profileEnd(label)
	});
	return this;	// for chained API
};


/**
 * Trigger the debugger when the function is called
 *
 * @param {Function} originalFn the original function
 * @param {Function} [conditionFn] this function should return true, when the breakpoint should be triggered. default to function(){ return true; }
 * @returns {Function} The modified function
*/
FnAttrClass.prototype.breakpoint	= function(fn, conditionFn){
	conditionFn	= conditionFn	|| function(){ return true; };
	return function(){
		var stopNow	= conditionFn();
		// if stopNow, trigger debugger
		if( stopNow === true )	debugger;
		// forward the call to the original function
		return fn.apply(this, arguments);
	}
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
	// TODO remove this usedHeapSize variable
	this.usedHeapSize	= usedHeapSize;

	// sanity check - if not available, output a warning
	if( GcMonitor.isAvailable() === false ){
		// open -a "/Applications/Google Chrome.app" --args --enable-memory-info
		console.warn('memory info are unavailable... for chrome use --enable-memory-info. other browsers dont have this feature.')
	}

	/**
	 * Start monitoring periodically
	 * 
	 * @param {Function|undefined} onChange optional function to notify when gc occurs
	 * @param {Number|undefined} period period of the check. default to 50ms
	 */
	this.start	= function(onChange, period){
		period	= period	|| 50;
		onChange= onChange || function(delta){
			function bytesToSize(bytes, nFractDigit) {
				var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				if (bytes == 0) return '0';
				nFractDigit	= nFractDigit !== undefined ? nFractDigit : 2;
				var precision	= Math.pow(10, nFractDigit);
				var i 		= Math.floor(Math.log(bytes) / Math.log(1024));
				return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
			};
			console.warn(new Date + " -- GC occured!!! saved", bytesToSize(delta), ' consuming at ', bytesToSize(burnRate))
		}
		timerid	= setInterval(function(){
			_this.check(onChange);
		}, period);
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

		if( lastUsedHeap === null ){
			lastUsedHeap	= usedHeapSize();
			lastTimestamp	= Date.now();
			return;
		}

		var present	= Date.now();
		var currUsedSize= usedHeapSize();

		// check if the heap size is this cycle is LESS than what we had last
		// cycle; if so, then the garbage collector has kicked in
		var deltaMem	= currUsedSize - lastUsedHeap;
		if( deltaMem < 0 ){
			onChange(-deltaMem, burnRate);		
		}else{
			var deltaTime	= present - lastTimestamp
			var newBurnrate	= deltaMem / (deltaTime/1000);
			// if there is a previous burnRate, smooth with it
			if( burnRate !== null ){
				burnRate	= burnRate * 0.7 + newBurnrate * 0.3;
			}else{
				burnRate	= newBurnrate;
			}
		}

		lastUsedHeap	= currUsedSize;
		lastTimestamp	= Date.now();
	}
	
	/**
	 * getter for the burnRate
	 * @type {Number}
	 */
	this.burnRate	= function(){
		if( burnRate === null )	return 0;
		return burnRate;
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
	var inBrowser	= typeof(window) !== 'undefined'	? true : false
	var _global	= inBrowser	? window	: global;
	var _globalStr	= inBrowser	? 'window'	: 'global';
	// sanity check - a global namespace MUST be found
	console.assert( _global, 'failed to find a global namespace! bailing out!' );
	// init proplist
	_global.proplist = _global.proplist || {};
	// loop on _global _global object
	for(var propname in _global){
		_global.proplist[propname] = true;
	}
	
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
		onChange= onChange || function(newProperty){
			console.warn(new Date + " -- Warning Global Detected!!! "+_globalStr+"['"+newProperty+"'] === ", _global[newProperty])
		}
		timerid	= setInterval(function(){
			_this.check(onChange);
		}, period);
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
	 */
	this.check	= function(onChange){
		// parameter polymorphism
		onChange	= onChange || function(property){}
		// new loop on _global object
	        for(var propname in _global){
			if( _global.proplist[propname] )	continue;
			// if this is already in the ignoreList, continue
			if( GlobalDetector.ignoreList.indexOf(propname) !== -1 )	continue;
			// mark this property as init
			_global.proplist[propname] = true;
			// notify callback
			onChange(propname);
	        }
	}
}

/**
 * list of variables name to ignore. populated at constructor() time
 * @type {String[]}
 */
GlobalDetector.ignoreList	= [];


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= GlobalDetector;
/**
 * Implement a Object Pool
 * 
 * - only track the free objects
 * 
 * @class
 * @param {Function} klass the constructor of the class used in the pool
 */
var ObjectPool = function(klass){
	var _pool	= new Array();
	return {
		reset	: function()	{ _pool = [];		},
		put	: function(obj)	{ _pool.push(obj);	},
		get	: function(){			
			if( _pool.length === 0 )	this.grow();
			return _pool.pop();
		},
		grow	: function(){
			_pool.push(new klass());
		}
	};
};

/**
 * mixin an ObjectPool into a class
 * @param  {Function} klass constructor function of the class
 */
ObjectPool.mixin	= function(klass){
	var pool	= new ObjectPool(klass)
	// ### possible API
	// .create/.destroy
	// .acquire/.release
	// .create/.release
	// 
	// ### events ? onAcquire/onRelease
	// * with microevent.js
	// * where did you get it ?
	// * where have i seen this ?
	// * https://github.com/playcraft/gamecore.js/blob/master/src/pooled.js#L483

	klass.create	= function(){
		var obj	= pool.get();
		klass.prototype.constructor.apply(obj, arguments)
		return obj;
	}
	klass.prototype.destroy	= function(){
		pool.put(this);
	}
};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ObjectPool;
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
(function(){
	/**
	 * Class to implement queueable getter/setter
	 * @param  {Object} baseObject The base object on which we operate
	 * @param  {String} property   The string of property
	 */
	var _QGetterSetter	= function(baseObject, property){
		// sanity check 
		console.assert( typeof(baseObject) === 'object' );
		console.assert( typeof(property) === 'string' );
		// backup the initial value
		var initialValue= baseObject[property];
		// init some local variables
		var _this	= this;
		this._getters	= [];
		this._setters	= [];
		// define the root getter
		baseObject.__defineGetter__(property, function(){
			var value	= baseObject['__'+property];
			for(var i = 0; i < _this._getters.length; i++){
				value	= _this._getters[i](value)
			}
			return value;
		});
		// define the root setter		
		baseObject.__defineSetter__(property, function(value){
			for(var i = 0; i < _this._setters.length; i++){
				value	= _this._setters[i](value)
			}
			baseObject['__'+property] = value;
		});
		// set the initialValue
		baseObject['__'+property]	= initialValue;
	};
	
	//////////////////////////////////////////////////////////////////////////////////
	// Override prototype of global ```Object```
	Object.prototype.__defineQGetter__	= function(property, getterFn){
		var name	= "__dbgGetSet_" + property;
		// init _QGetterSetter for this property if needed
		this[name]	= this[name] || new _QGetterSetter(this, property);
		// setup the new getter
		this[name]._getters.push(getterFn)
	};
	
	Object.prototype.__defineQSetter__	= function(property, setterFn){
		var name	= "__dbgGetSet_" + property;
		// init _QGetterSetter for this property if needed
		this[name]	= this[name] || new _QGetterSetter(this, property);
		// setup the new setter
		this[name]._setters.push(setterFn)
	};
})();

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
//		Stacktrace.parse						//
//										//
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


/**
 * parse the stacktrace of an Error
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
	 */
	function _parserV8(error){
		// start parse the error stack string
		var lines	= error.stack.split("\n").slice(1);
		var stacktrace	= [];
		lines.forEach(function(line){
			if( line.match(/\)$/) ){
				var matches	= line.match(/^\s*at (.+) \((.+):(\d+):(\d+)\)/);
				var result	= {
					fct	: matches[1],
					url	: matches[2],
					line	: parseInt(matches[3], 10),
					column	: parseInt(matches[4], 10)
				};
				stacktrace.push(result);
			}else{
				var matches	= line.match(/^\s*at (.+):(\d+):(\d+)/);
				var result	= {
					url	: matches[1],
					fct	: '<anonymous>',
					line	: parseInt(matches[2], 10),
					column	: parseInt(matches[3], 10)
				};
				stacktrace.push(result);
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
			stacktrace.push({
				fct	: matches[1] === '' ? '<anonymous>' : matches[1],
				url	: matches[2],
				line	: parseInt(matches[3], 10),
				column	: 1
			});
		});
		return stacktrace;
	};
}

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
	stackLevel		= stackLevel !== undefined ? stackLevel : 2;
	// init variable
	var at			= Stacktrace.Track;
	var stackFrame		= Stacktrace.parse()[stackLevel];
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

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

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
	classNameRegExp	= classNameRegExp	|| /./;
	maxNOrigin	= maxNOrigin !== undefined ? maxNOrigin	: 3;
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
		output.push(className+': allocated '+klass.counter+' times');
		
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
		})
	}.bind(this))
	return output.join('\n');
};




/**
 * @fileOverview contains TypeCheck class
 * 
 * @todo how to handle getRange
 */

/**
 * @namespace Strong typing for javascript
 */
var TypeCheck	= {};

Object.prototype.__defineQGetter__	|| require('./queueablegettersetter.js')

/**
 * Check type with a object setter
 * 
 * @param  {Object} baseObject the base object which contains the property
 * @param  {String} property   the string of the property name
 * @param  {Array}  types      the allows tipe
 */
TypeCheck.setter	= function(baseObject, property, types){
	// check initial value
	var value	= baseObject[property];
	var isValid	= TypeCheck.value(value, types)
	console.assert(isValid, 'initial value got invalid type');
	// setup the setter
	baseObject.__defineQSetter__(property, function(value){
		// check the value type
		var isValid	= TypeCheck.value(value, types);			
		console.assert(isValid, 'invalid type');
		// return the value
		return value;
	});
};

/**
 * function wrapper to check the type of function parameters and return value
 * @param  {Function} originalFn  the function to wrap
 * @param  {Array}    paramsTypes allowed types for the paramter. array with each item is the allowed types for this parameter.
 * @param  {Array}    returnTypes allowed types for the return value
 * @return {boolean}  return isValid, so true if types matche, false otherwise
 */
TypeCheck.fn	= function(originalFn, paramsTypes, returnTypes){
	return function(){
		// check parameters type
		console.assert(arguments.length <= paramsTypes.length, 'funciton received '+arguments.length+' parameters but recevied only '+returnTypes.length+'!');
		for(var i = 0; i < paramsTypes.length; i++){
			var isValid	= TypeCheck.value(arguments[i], paramsTypes[i]);			
			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', paramsTypes[i], 'It is ===', arguments[i])
		}
		// forward the call to the original function
		var result	= originalFn.apply(this, arguments);
		// check the result type
		var isValid	= TypeCheck.value(result, returnTypes);			
		console.assert(isValid, 'invalid type for returned value. MUST be of type', returnTypes, 'It is ===', result);
		// return the result
		return result;
	}
}

/**
 * Check the type of a value
 * @param  {*} value the value to check
 * @param  {Array.<function>} types the types allowed for this variable
 * @return {boolean} return isValid, so true if types matche, false otherwise
 */
TypeCheck.value	= function(value, types){
	// handle parameter polymorphism
	if( types instanceof Array === false )	types	= [types];
	// go thru each type
	var result	= false;
	for(var i = 0; i < types.length; i++){
		var type	= types[i];
		if( type === Number ){
			var valid	= typeof(value) === 'number';
		}else if( type === String ){
			var valid	= typeof(value) === 'string';			
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonan' ){
			var valid	= value === value;
			if( valid === false )	return false;
			continue;	// continue as it is a validator
		}else if( type instanceof TypeCheck._ValidatorClass ){
			var valid	= type.fn(value);
			if( valid === false )	return false;
			continue;	// continue as it is a validator
		}else {
			var valid	= value instanceof type;
		}
		result	= result || valid;
	}
	// return the just computed result
	return result;
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
TypeCheck.Validator	= function(fn){
	return new TypeCheck._ValidatorClass(fn)
}

/**
 * Internal class to be recognisable by TypeCheck.value()
 * 
 * @param  {Function} fn function which return true if value is valid, false otherwise
 */
TypeCheck._ValidatorClass= function(fn){
	console.assert(fn instanceof Function);
	this.fn	= fn;
}

// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= TypeCheck;


