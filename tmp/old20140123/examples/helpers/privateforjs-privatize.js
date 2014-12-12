var PrivateForJS	= PrivateForJS	|| require('../../src/privateforjs.js');

/**
 * Privatize all property/function which start with a _
 * 
 * @param  {Function} klass	constructor for the class
 * @param  {object} instance	the instance of the object
 */
PrivateForJS.privatize	= function(klass, instance){
	console.assert( instance.constructor === klass );
	console.assert( instance instanceof klass );

// TODO what about the .prototype

	for(var property in instance){
		var value	= instance[property]
		if( property[0] !== '_' )		continue;
		if(!instance.hasOwnProperty(property))continue;		
		PrivateForJS.privateProperty(klass, instance, property);
	}
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

var FunctionAttr	= FunctionAttr	|| require('../../src/helpers/functionattr.js');

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
