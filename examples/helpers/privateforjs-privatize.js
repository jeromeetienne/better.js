var PrivateForJS	= PrivateForJS	|| require('../../src/privateforjs.js');

/**
 * Privatize all property/function which start with a _
 * 
 * @param  {Function} klass    constructor for the class
 * @param  {object} baseObject the instance of the object
 */
PrivateForJS.privatize	= function(klass, baseObject){
	console.assert( baseObject.constructor == klass );
	console.assert( baseObject instanceof klass );

// TODO what about the .prototype

	for(var property in baseObject){
		var value	= baseObject[property]
		if( property[0] !== '_' )		continue;
		if(!baseObject.hasOwnProperty(property))continue;		
		PrivateForJS.privateProperty(klass, baseObject, property);
	}
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

var FunctionAttr	= FunctionAttr	|| require('../../src/functionattr.js');

/**
 * plugin for functionattr.js
 * 
 * @param  {Function} klass    constructor for the class
 * @return {FunctionAttr.Builder} for chained API
 */
FunctionAttr.Builder.prototype.privatize	= function(klass){
	var _this	= this;
	this._currentFn	= function(){
		// call the function
		var value	= _this._currentFn.apply(this, arguments);
		// privatize
		PrivateForJS.privatize(klass, this);
		// actually return the value
		return value; 
	};	
	return this;	// for chained API	
};
