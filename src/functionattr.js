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
FnAttrClass.prototype.end	= function(){
	return this._currentFn;
}

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= fnAttr;


//////////////////////////////////////////////////////////////////////////////////
//										//
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
//										//
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
//										//
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


