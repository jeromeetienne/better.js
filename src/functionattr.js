//////////////////////////////////////////////////////////////////////////////////
//		Function Attribute						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Function attribute builder
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

var FnAttrClass	= function(originalFn, fnName){
	this._currentFn	= originalFn;
	this._fnName	= fnName	|| 'fnAttr'
}

FnAttrClass.prototype.done	= function(){
	return this._currentFn;
}

FnAttrClass.fn	= FnAttrClass.prototype;

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= fnAttr;


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

FnAttrClass.fn.obsolete	= function(message){
	var used	= false;
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		if( used )	return;
		used	= true;
		console.warn(message || "Obsoleted function "+this._fnName+" called. Please update your code.");
		console.trace();
	}.bind(this));
	return this;	// for chained API
}

FnAttrClass.fn.timestamp	= function(){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		console.log("run at "+ new Date);
	});
	return this;	// for chained API
};


FnAttrClass.fn.log		= function(message){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		console.log(message);
	});
	return this;	// for chained API
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////


FnAttrClass.fn.before	= function(beforeFn){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, beforeFn, null);
	return this;	// for chained API
};

FnAttrClass.fn.after	= function(afterFn){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, null, afterFn);
	return this;	// for chained API
};


FnAttrClass.fn.warp	= function(beforeFn, afterFn){
	this._currentFn	= fnAttr.wrapCall(this._currentFn, beforeFn, afterFn);
	return this;	// for chained API
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

FnAttrClass.fn.time	= function(label){
	label	= label !== undefined ? label : this._fnName+".time()-"+Math.floor(Math.random()*9999).toString(36);
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		console.time(label)
	}, function(){
		console.timeEnd(label)
	});
	return this;	// for chained API
};
FnAttrClass.fn.profile	= function(label){
	label	= label !== undefined ? label : this._fnName+".profile-"+Math.floor(Math.random()*9999).toString(36);
	this._currentFn	= fnAttr.wrapCall(this._currentFn, function(){
		console.profile(label)
	}, function(){
		console.profileEnd(label)
	});
	return this;	// for chained API
};


