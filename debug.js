/**
 * @fileoverview
 * - Depends only on console.*
 * - modern browser MUST be supported. other may be supported
 * - TODO is the namespace name properly named
 *
 * 
 * debug.checkType(property, Klass) - check that the property is of this class. work with typeof/instanceof depending on the Klass
 * debug.stack() - return the current stack to the caller
 * debug.checkValidValue(foo, 'bar', function(value){ return value < 40; })
 * 
 * debug.filterGetter(foo, 'bar', function(value){ return value+1; });
 * debug.filterSetter(foo, 'bar', function(value){ return value+1; });
 * 
 * debug.defineGetter(foo, 'bar', function(){ return value; }) queable setter
 * debug.defineSetter(foo, 'bar', function(value){ return value; }) queuable getter
 *
 * Is it possible to detect anonymous function and to make give them a name
*/


/**
 * @namespace
*/
var debug	= {};

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
 * assert which actually try to stop the excecution
 * if debug.assert.useDebugger is falsy, throw an exception. else trigger the
 * debugger. It default to false
 * @param {Boolean} condition the condition which is asserted
 * @param {String} message the message which is display is condition is falsy
 * @param {?Boolean} useDebuggercondition the condition which is asserted
*/
debug.assert	= function(condition, message, useDebugger){
	if( condition )	return;
	if( debug.assert.useDebugger || useDebugger )	debugger;
	throw new Error(message	|| "assert Failed")
}
debug.assert.useDebugger	= true;

/**
 * Ensure that the property is never NaN
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
*/
debug.noNaN	= function(baseObject, property){
	var initialValue= baseObject[property];
	baseObject.__defineGetter__(property, function(){
		return baseObject['__'+property];
	});
	baseObject.__defineSetter__(property, function(value){
		// NaN is the only value where "NaN === NaN" is always false
		console.assert( value === value, "property '"+property+"' is a NaN");
		baseObject['__'+property] = value;
	});
	// set the initialValue
	baseObject['__'+property]	= initialValue;
};

/**
 * Ensure the type of a variable with typeof() operator
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
 * @param {String} typeofString the exepected result of typeof(property)
*/
debug.checkTypeof	= function(baseObject, property, typeofStr){
	var initialValue= baseObject[property];
	baseObject.__defineGetter__(property, function(){
		return baseObject['__'+property];
	});
	baseObject.__defineSetter__(property, function(value){
		var result	= typeof(value);
		debug.assert(result === typeofStr, "property typeof('"+property+"') === '"+result+"' (instead of '"+typeofStr+"')");
		baseObject['__'+property] = value;
	});
	// set the initialValue
	baseObject['__'+property]	= initialValue;
};

/**
 * Ensure the type of a variable with instanceof
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
 * @param {Object} klass the expected class
*/
debug.checkInstanceof	= function(baseObject, property, klass){
	var initialValue= baseObject[property];
	baseObject.__defineGetter__(property, function(){
		return baseObject['__'+property];
	});
	baseObject.__defineSetter__(property, function(value){
		// TODO add a link toward the origin error
		debug.assert(value instanceof klass, "property "+property+" not of proper class");
		baseObject['__'+property] = value;
	});
	// set the initialValue
	baseObject['__'+property]	= initialValue;
};

/**
 * Ensure the type of a variable with typeof() operator
 * 
 * @param {Object} baseObject the base object containing the property
 * @param {String} property the property to check
 * @param {function} setterFn the function called the property is set
*/
debug.checkOnSet	= function(baseObject, property, setterFn){
	var initialValue= baseObject[property];
	baseObject.__defineGetter__(property, function(){
		return baseObject['__'+property];
	});
	baseObject.__defineSetter__(property, function(value){
		setterFn(value);
		baseObject['__'+property] = value;
	});
	// set the initialValue
	baseObject['__'+property]	= initialValue;	
};

//////////////////////////////////////////////////////////////////////////////////
//		Implement queuable getter setter				//
//////////////////////////////////////////////////////////////////////////////////

(function(){
	var _QueuableGetterSetter	= function(baseObject, property){
		var _this	= this;
		this.getters	= [];
		this.setters	= [];
	
		var initialValue= baseObject[property];
		baseObject.__defineGetter__(property, function(){
			var value	= baseObject['__'+property];
			for(var i = 0; i < _this.getters.length; i++){
				value	= _this.getters[i](value)
			}
			return value;
		});
		baseObject.__defineSetter__(property, function(value){
			for(var i = 0; i < _this.setters.length; i++){
				value	= _this.setters[i](value)
			}
			baseObject['__'+property] = value;
		});
		// set the initialValue
		baseObject['__'+property]	= initialValue;
	};
	
	//////////////////////////////////////////////////////////////////////////////////
	// Override prototype of global ```Object```
	Object.prototype.__defineQGetter__	= function(property, getterFn){
		var baseObject	= this;
		if( !baseObject.__dbgGetSet ){
			baseObject.__dbgGetSet	= new _QueuableGetterSetter(baseObject, property);
		}
		var qGetSet	= baseObject.__dbgGetSet;
		qGetSet.getters.push(getterFn)
	};
	
	Object.prototype.__defineQSetter__	= function(property, setterFn){
		var baseObject	= this;
		if( !baseObject.__dbgGetSet ){
			baseObject.__dbgGetSet	= new _QueuableGetterSetter(baseObject, property);
		}
		var qGetSet	= baseObject.__dbgGetSet;
		qGetSet.setters.push(setterFn)
	};
})();
