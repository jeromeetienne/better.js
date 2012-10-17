/**
 * @fileoverview
 * - Depends only on console.*
 * - modern browser MUST be supported. other may be supported
 * - TODO is the namespace name properly named
 *
 * Is it possible to detect anonymous function and to make give them a name
*/

/**
 * @namespace
*/
var debug	= {};

Object.prototype.__defineQGetter__	|| require('./queueablegettersetter.js')

//////////////////////////////////////////////////////////////////////////////////
//		misc								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Display a message every time the function is called
 * 
 * @param {Function} fn the original function
 * @param {String} [message] message to display when the function is called. Optional
 * @returns {Function} The modified function
*/
debug.obsolete	= function(originalFn, message){
	return function(){
		console.warn(message || "Obsoleted function called. Please update your code.");
		console.trace();
		// forward the call to the original function
		return fn.apply(this, arguments);
	}
}

/**
 * Wrap a function between 2 functions
 * 
 * @param {Function} originalFn the original function
 * @param {Function} beforeFn the function to call *before* the original function
 * @param {Function} afterFn the function to call *after* the original function
 * @returns {Function} The modified function
*/
debug.wrapCall	= function(originalFn, beforeFn, afterFn){
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

/**
 * Trigger the debugger when the function is called
 *
 * @param {Function} originalFn the original function
 * @param {Function} [conditionFn] this function should return true, when the breakpoint should be triggered. default to function(){ return true; }
 * @returns {Function} The modified function
*/
debug.breakpoint	= function(fn, conditionFn){
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
 * extract a stacktrace. TODO make it work in node.js/chrome/firefox and modern browsers
 * 
 * @param {Integer} [nShift] number of calls to skip in the stacktrace 
 * @returns {Array} array of object like {url: "http://*", line : 42, column: 12};
*/
debug.stacktrace	= function(nShift){
	var createException	= function() {
		try{	this.undef();
		}catch( e ){
			return e;
		}
		return undefined;
	};

	var e		= createException();
	var lines	= e.stack.split('\n');
	var descLine	= lines.shift();
	var locations	= [];
	lines.forEach(function(line){
		var matches	= line.match(/^\s+at\s+(.+):(\d+):(\d+)/);
		console.assert(matches.length === 4, "Parse error in line: "+line)
		locations.push({
			url	: matches[1],
			line	: parseInt(matches[2]),
			column	: parseInt(matches[3])
		});
	});
	// honor nShift
	nShift	= nShift !== undefined ? nShift : 0;
	for(var i = 0; i < nShift+2; i++)	locations.shift();
	// return the result
	return locations;
}

/**
 * assert which actually try to stop the excecution
 * if debug.assert.useDebugger is falsy, throw an exception. else trigger the
 * debugger. It default to false
 *
 * @param {Boolean} condition the condition which is asserted
 * @param {String} message the message which is display is condition is falsy
 * @param {Boolean} [useDebugger] the condition which is asserted
*/
debug.assert	= function(condition, message, useDebugger){
	if( condition )	return;
	if( debug.assert.useDebugger || useDebugger )	debugger;
	throw new Error(message	|| "assert Failed")
}
debug.assert.useDebugger	= false;


/**
 * Same as __LINE__ in C
*/
debug.__defineQGetter__('__LINE__', function(){
	var stacktrace	= debug.stacktrace();
	return stacktrace[2].line
});

/**
 * Same as __LINE__ in C
*/
debug.__defineQGetter__('__FILE__', function(){
	var stacktrace	= debug.stacktrace();
	var url		= stacktrace[2].url;
	var basename	= url.match(/([^/]*)$/)[1]	|| ".";
	//console.log("stacktrace", stacktrace, "url", url, "basename", basename)
	return basename;
});


//////////////////////////////////////////////////////////////////////////////////
//		Function Attribute						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Function attribute builder
*/
debug.fnAttr	= function(originalFn){
	return new debug.FnAttrClass(originalFn)
}

debug.FnAttrClass	= function(originalFn){
	this._currentFn	= originalFn;
}

debug.FnAttrClass.prototype.done	= function(){
	return this._currentFn;
}

debug.FnAttrClass.prototype.obsolete	= function(message){
	this._currentFn	= debug.wrapCall(this._currentFn, function(){
		console.warn(message || "Obsoleted function called. Please update your code.");
		console.trace();
	});
	return this;	// for chained API
}

debug.FnAttrClass.prototype.timestamp	= function(){
	this._currentFn	= debug.wrapCall(this._currentFn, function(){
		console.log("run at "+ new Date);
	});
	return this;	// for chained API
};

debug.FnAttrClass.prototype.log		= function(message){
	this._currentFn	= debug.wrapCall(this._currentFn, function(){
		console.log(new Date+" Function Enter."+message);
	}, function(){
		console.log(new Date+" Function Leave."+message);
	});
	return this;	// for chained API
};

debug.FnAttrClass.prototype.warn	= function(message){
	this._currentFn	= debug.wrapCall(this._currentFn, function(){
		console.warn(new Date+" Function Enter."+message);
	}, function(){
		console.warn(new Date+" Function Leave."+message);
	});
	return this;	// for chained API
};
debug.FnAttrClass.prototype.error	= function(message){
	this._currentFn	= debug.wrapCall(this._currentFn, function(){
		console.error(new Date+" Function Enter."+message);
	}, function(){
		console.error(new Date+" Function Leave."+message);
	});
	return this;	// for chained API
};
debug.FnAttrClass.prototype.time	= function(label){
	label	= label !== undefined ? label : "fnAttr().time()-"+Math.floor(Math.random()*9999).toString(36);
	this._currentFn	= debug.wrapCall(this._currentFn, function(){
		console.time(label)
	}, function(){
		console.timeEnd(label)
	});
	return this;	// for chained API
};
debug.FnAttrClass.prototype.profile	= function(label){
	label	= label !== undefined ? label : "fnAttr().profile()-"+Math.floor(Math.random()*9999).toString(36);
	this._currentFn	= debug.wrapCall(this._currentFn, function(){
		console.profile(label)
	}, function(){
		console.profileEnd(label)
	});
	return this;	// for chained API
};

//////////////////////////////////////////////////////////////////////////////////
//		type checking							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Ensure that the property is never NaN
 * Inspired from http://29a.ch/2011/10/20/javascript-fuck-nan-undefined by @29a_ch
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
*/
debug.noNaN	= function(baseObject, property){
	baseObject.__defineQSetter__(property, function(value){
		console.assert(value === value, "property '"+property+"' is a NaN");
		return value;
	});
}

/**
 * Ensure the type of a variable with typeof() operator
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
 * @param {String} typeofString the exepected result of typeof(property)
*/
debug.checkTypeof	= function(baseObject, property, typeofStr){
	baseObject.__defineQSetter__(property, function(value){
		debug.assert(typeof(value) === typeofStr, "property typeof('"+property+"') === '"+typeof(value)+"' (instead of '"+typeofStr+"')");
		return value;
	});
};

/**
 * Ensure the type of a variable with instanceof
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
 * @param {Object} klass the expected class
*/
debug.checkInstanceof	= function(baseObject, property, klass){
	baseObject.__defineQSetter__(property, function(value){
		// TODO add a link toward the origin error
		debug.assert(value instanceof klass, "property "+property+" not of proper class");
		return value;
	});
};

/**
 * Ensure the type of a variable using typeof or instanceof depending on klass
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
 * @param {Object} klass the expected class
*/
debug.checkType	= function(baseObject, property, klass){
	if( klass === Number ){
		debug.checkTypeof(baseObject, property, 'number');
	}else if( klass === String ){
		debug.checkTypeof(baseObject, property, 'string');
	}else{
		debug.checkInstanceof(baseObject, property, klass);		
	}
};

/**
 * Ensure the type of a variable with typeof() operator
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
 * @param {function} callback the function called the property is set
*/
debug.checkValueRange	= function(baseObject, property, callback){
	baseObject.__defineQSetter__(property, function(value){
		console.assert(callback(value) === true, "property '"+property+"' got invalid value. >"+value+"<");
		return value;
	});
};

// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= debug;
