//////////////////////////////////////////////////////////////////////////////////
//		Modification							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * change global object function bar(){}.setAttr('bar').done();
 * 
 * @param {string} fnName the name of the function 
 */
Function.prototype.setAttr	= function(fnName){
	return FunctionAttr.define(this, fnName)
}

//////////////////////////////////////////////////////////////////////////////////
//		Function Attribute						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * @namespace
 */
var FunctionAttr	= {};

/**
 * Function attribute creator
 * 
 * @return {FunctionAttr.Builder} a FunctionAttr.Builder builder
*/
FunctionAttr.define	= function(originalFn, fnName){
	return new FunctionAttr.Builder(originalFn, fnName)
}

/**
 * Wrap a function between 2 functions
 * 
 * @param {Function} originalFn the original function
 * @param {Function} beforeFn the function to call *before* the original function
 * @param {Function} afterFn the function to call *after* the original function
 * @return {Function} The modified function
*/
FunctionAttr.wrapCall	= function(originalFn, beforeFn, afterFn){
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
FunctionAttr.Builder	= function(originalFn, fnName){
	this._currentFn	= originalFn;
	this._fnName	= fnName	|| 'aFunction';
}

/**
 * mark the end of the attributes declaration
 * 
 * @return {Function} The actual function with the attributes
*/
FunctionAttr.Builder.prototype.done	= function(){
	return this._currentFn;
}

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= FunctionAttr;


//////////////////////////////////////////////////////////////////////////////////
//		generic								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * display a message with a timestamp every time the function is used
 * @return {string} message optional message to display
 */
FunctionAttr.Builder.prototype.timestamp	= function(message){
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, function(){
		console.log(''+ new Date + ': '+this._fnName+' being called');
	}.bind(this));
	return this;	// for chained API
};

/**
 * log a message when the function is call
 * @param  {string} message the message to display
 */
FunctionAttr.Builder.prototype.log		= function(message){
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, function(){
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
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.deprecated	= function(message){
	var used	= false;
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, function(){
		if( used )	return;
		used	= true;
		console.warn(message || "Deprecated function "+this._fnName+" called. Please update your code.");
	}.bind(this));
	return this;	// for chained API
}

/**
 * mark the function as obsolete
 * @param  {string} message obsolete message to display
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.obsolete	= function(message){
	var used	= false;
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, function(){
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
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.before	= function(beforeFn){
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, beforeFn, null);
	return this;	// for chained API
};

/**
 * hook a function to be called after the actual function
 * @param  {Function} afterFn the function to be called after
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.after	= function(afterFn){
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, null, afterFn);
	return this;	// for chained API
};

//////////////////////////////////////////////////////////////////////////////////
//		Benchmarking							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Warp the function call in a console.time()
 * 
 * @param  {String} label the label to use for console.time(label)
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.time	= function(label){
	label	= label !== undefined ? label : this._fnName+".time()-"+Math.floor(Math.random()*9999).toString(36);
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, function(){
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
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.profile	= function(label){
	label	= label !== undefined ? label : this._fnName+".profile-"+Math.floor(Math.random()*9999).toString(36);
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, function(){
		console.profile(label)
	}, function(){
		console.profileEnd(label)
	});
	return this;	// for chained API
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Trigger the debugger when the function is called
 *
 * @param {Function} originalFn the original function
 * @param {Function} [conditionFn] this function should return true, when the breakpoint should be triggered. default to function(){ return true; }
 * @return {FunctionAttr.Builder} for chained API
*/
FunctionAttr.Builder.prototype.breakpoint	= function(fn, conditionFn){
	conditionFn	= conditionFn	|| function(){ return true; };
	this._currentFn	= function(){
		var stopNow	= conditionFn();
		// if stopNow, trigger debugger
		if( stopNow === true )	debugger;
		// forward the call to the original function
		return this._currentFn.apply(this, arguments);
	}.bind(this);
	return this;
}

/**
 * check function type as in ```TypeCheck.fn``` from typecheck.js
 * @param  {Array}    paramsTypes allowed types for the paramter. array with each item is the allowed types for this parameter.
 * @param  {Array}    returnTypes allowed types for the return value
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.typeCheck	= function(paramsTypes, returnTypes){
	this._currentFn	= TypeCheck.fn(this._currentFn, paramsTypes, returnTypes);
	return this;
}

//////////////////////////////////////////////////////////////////////////////////
//		.trackUsage()							//
//////////////////////////////////////////////////////////////////////////////////

var Stacktrace	= Stacktrace	|| require('../src/stacktrace.js');

// create the tracker for .trackUsage
FunctionAttr.usageTracker	= new Stacktrace.Tracker();

/**
 * track where this property is used (getter and setter)
 * 
 * @param {String|undefined} trackName	optional name for Stacktrace.Tracker. default to originId
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.trackUsage	= function(trackName){
	var tracker	= FunctionAttr.usageTracker;
	// handle polymorphism
	trackName	= trackName	|| 'FunctionAttr.trackUsage:'+Stacktrace.parse()[1].originId();
	// actually record the usage
	this._currentFn	= FunctionAttr.wrapCall(this._currentFn, function(){
		tracker.record(trackName, 1);
	});
	// for chained API
	return this;
}

//////////////////////////////////////////////////////////////////////////////////
//		.private()							//
//////////////////////////////////////////////////////////////////////////////////

var PrivateForJS	= PrivateForJS	|| require('../src/privateforjs.js');

/**
 * Mark this function as private
 * @param  {Function} klass the constructor of the function
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.private	= function(klass){
	// sanity check
	console.assert(klass !== undefined)
	// overload currenFn
	this._currentFn	= PrivateForJS.privateFunction(klass, this_currentFn);
	// for chained API
	return this;
}

