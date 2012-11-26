/**
 * ensure private property/method stays private
 *
 * @namespace Strong typing for javascript
 */
var PrivateForJS	= {};

// include dependancies
var Stacktrace		= Stacktrace	|| require('./stacktrace.js');
var QGetterSetter	= QGetterSetter	|| require('./qgettersetter.js')


// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PrivateForJS;

//////////////////////////////////////////////////////////////////////////////////
//		Handle PrivateOKFn						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * determine which function is considered private for klass 
 * @param  {function} klass  the constructor of the class
 * @param  {object|function|function[]} [source] private functions - if Function, use it directly.
 *                           if Array.<function>, then each item is a private function
 *                           if object, then each of its property which is a function is private
 *                           if undefined, use klass.prototype which trigger the Object case
 */
PrivateForJS.pushPrivateOkFn	= function(klass, source){
	// if source isnt provided, use klass.prototype
	if( source === undefined )	source	= klass.prototype;
	// init ._privateOkFn if needed
	klass._privateOkFn	= klass._privateOkFn	|| [];
	// handle various case of source
	if( typeof(source) === 'function' ){
		klass._privateOkFn.push(source)
	}else if( typeof(source) === 'object' ){
		Object.keys(source).forEach(function(key){
			var val	= source[key];
			if( typeof(val) !== 'function' )	return;
			klass._privateOkFn.push(val);			
		});
	}else if( source instanceof Array ){
		source.forEach(function(fn){
			console.assert( typeof(val) !== 'function' );
			klass._privateOkFn.push(fn);			
		});
	}else	console.assert(false);
}

/**
 * return the functions allowed to access private values
 * @param  {Function} klass the class to query
 * @return {Array.<function>} return the function
 */
PrivateForJS.getPrivateOkFn	= function(klass){
	// init ._privateOkFn if needed
	klass._privateOkFn	= klass._privateOkFn	|| [];
	// return current ones
	return klass._privateOkFn;
}

//////////////////////////////////////////////////////////////////////////////////
//		core								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * define a private property on a given instance of a object class
 * @param  {Function} klass	the class of the intenciated object
 * @param  {Object} baseObject	the object instance
 * @param  {String} property	the property name
 * @return {undefined}		nothing
 */
PrivateForJS.privateProperty	= function(klass, baseObject, property){
// @TODO should i put a setter too ?
	QGetterSetter.defineGetter(baseObject, property, function aFunction(value, caller, property){
		// generate privateOkFns if needed - functions which can access private properties
		klass._privateOkFn	= klass._privateOkFn || PrivateForJS.pushPrivateOkFn(klass);
		// if caller not privateOK, notify the caller
		var privateOkFns= klass._privateOkFn;
		if( privateOkFns.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[2];
			// log the event
			console.assert(false, 'access to private property', "'"+property+"'", 'from', stackFrame.orginId());			
		}
		// actually return the value
		return value;
	});
};

/**
 * define a private function
 * @param  {Function} klass the class of the intenciated object
 * @param  {Function} fn    the function to overload
 * @return {Function}       the overloaded function
 */
PrivateForJS.privateFunction	= function(klass, fn){
	// MUST NOT use .bind(this) as it change the .caller value
	var _this	= this;
	return function _checkPrivateFunction(){
		// get caller
		var caller	= _checkPrivateFunction.caller;
		// generate privateOkFns if needed - functions which can access private properties
		klass._privateOkFn	= klass._privateOkFn || PrivateForJS.pushPrivateOkFn(klass);
		// if caller not privateOK, notify the caller
		var privateOkFns= klass._privateOkFn;
		if( privateOkFns.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[1];
			// log the event
			console.assert(false, 'access to private property', "'"+property+"'", 'from', stackFrame.orginId());			
		}
		// forward the call to the original function
		return fn.apply(_this, arguments);
	};
};

