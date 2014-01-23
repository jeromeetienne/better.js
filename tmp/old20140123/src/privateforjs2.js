/**
 * ensure private property/method stays private
 *
 * @namespace Strong typing for javascript
 */
var PrivateForJS2	= {};

// include dependancies
var Stacktrace		= Stacktrace	|| require('./stacktrace.js');
var QGetterSetter2	= QGetterSetter2|| require('./qgettersetter2.js')


// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PrivateForJS2;

//////////////////////////////////////////////////////////////////////////////////
//		Handle PrivateOKFn						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * determine which function is considered private for klass 
 * 
 * @param  {function} klass  the constructor of the class
 * @param  {object|function|function[]} [source] private functions - if Function, use it directly.
 *                           if Array.<function>, then each item is a private function
 *                           if object, then each of its property which is a function is private
 *                           if undefined, use klass.prototype which trigger the Object case
 */
PrivateForJS2.pushPrivateOkFn	= function(klass, source){
	// if source isnt provided, use klass.prototype
	if( source === undefined )	source	= klass.prototype;
	// init ._privateOkFn if needed
	klass._privateOkFn	= klass._privateOkFn	|| [];
	// handle various case of source
	if( typeof(source) === 'function' ){
		klass._privateOkFn.push(source)
	}else if( typeof(source) === 'object' ){
		Object.keys(source).forEach(function(key){
			var value	= source[key];
			if( typeof(value) !== 'function' )	return;
			klass._privateOkFn.push(value);			
		});
	}else if( source instanceof Array ){
		source.forEach(function(fn){
			console.assert( typeof(fn) !== 'function' );
			klass._privateOkFn.push(fn);			
		});
	}else	console.assert(false);
}

//////////////////////////////////////////////////////////////////////////////////
//		core								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * define a private property on a given instance of a object class
 * @param  {Function} klass	the class of the intenciated object
 * @param  {Object} instance	the object instance
 * @param  {String} property	the property name
 * @return {undefined}		nothing
 */
PrivateForJS2.privateProperty	= function(klass, instance, property){
	// check private in the getter
	QGetterSetter2.defineGetter(instance, property, function aFunction(value, caller, property){
		// if caller not privateOK, notify the caller
		if( klass._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[2]
			// log the event
			console.assert(false, 'access to private property', "'"+property+"'", 'from', stackFrame)
		}
		// actually return the value
		return value;
	});
	// check private in the setter
	QGetterSetter2.defineSetter(instance, property, function aFunction(value, caller, property){
		// if caller not privateOK, notify the caller
		if( klass._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[2]
			// log the event
			console.assert(false, 'access to private property', "'"+property+"'", 'from', stackFrame)
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
PrivateForJS2.privateFunction	= function(klass, fn){
	var functionName= fn.name || 'anonymous'
	return function _checkPrivateFunction(){
		// get caller
		var caller	= _checkPrivateFunction.caller;
		// if caller not privateOK, notify the caller
console.log('check function private blabla', klass)
		if( klass._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[1]
			// log the event
			console.assert(false, 'access to private function', "'"+functionName+"'", 'from', stackFrame);
		}
		// forward the call to the original function
		return fn.apply(this, arguments);
	};
};

//////////////////////////////////////////////////////////////////////////////////
//		Helpers								//
//////////////////////////////////////////////////////////////////////////////////


/**
 * Privatize all property/function which start with a ```_```. 
 * Especially useful at the end of a constructor.
 * 
 * @param  {Function} klass	constructor for the class
 * @param  {object} instance	the instance of the object
 */
PrivateForJS2.privatizeClass	= function(klass){
	console.assert(klass.prototype)
	for(var property in klass.prototype){
console.log('blabla prototype property', property)
		if(!klass.prototype.hasOwnProperty(property))	continue;
		if( property[0] !== '_' )			continue;
		var fn	= klass.prototype[property]
console.log('add private fn', fn)
		klass.prototype[property]	= PrivateForJS2.privateFunction(klass, fn)
	}
};

PrivateForJS2.privatizeInstance	= function(instance){
	var klass	= instance.constructor
	console.assert( instance instanceof klass );
// console.log('privatize', arguments)
// TODO what about the .prototype

	for(var property in instance){
		if(!instance.hasOwnProperty(property))	continue;
console.log('blabla property', property)
		if( property[0] !== '_' )		continue;
		PrivateForJS2.privateProperty(klass, instance, property);
	}
};

