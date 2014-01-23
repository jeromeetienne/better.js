/**
 * ensure private property/method stays private
 *
 * @namespace Strong typing for javascript
 */
var PrivateForJS	= {};

// include dependancies
var Stacktrace		= Stacktrace	|| require('./stacktrace.js');
var QGetterSetter	= QGetterSetter|| require('./qgettersetter.js')


// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PrivateForJS;

//////////////////////////////////////////////////////////////////////////////////
//		Handle PrivateOKFn						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * determine which function is considered private for klass 
 * 
 * @param  {function} klass  the constructor of the class
 * @param  {function} privateFn 	private function to add
 */
PrivateForJS.pushPrivateOkFn	= function(instance, privateFn){
	// create the storage value if needed - with non enumerable
	if( instance._privateOkFn === undefined ){
		Object.defineProperty(instance, '_privateOkFn', {
		        enumerable	: false,
		        writable	: true,
		        value		: [],
		})
	}
	// actually add the function
	instance._privateOkFn.push(privateFn)
}

//////////////////////////////////////////////////////////////////////////////////
//		core								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * define a private property on a given instance of a object class
 * @param  {Object} instance	the object instance
 * @param  {String} property	the property name
 * @return {undefined}		nothing
 */
PrivateForJS.privateProperty	= function(instance, property){
	console.assert( '_privateOkFn' in instance, 'this instance isnt init for PrivateForJS')
	// check private in the getter
	QGetterSetter.defineGetter(instance, property, function aFunction(value, caller, property){
console.log('check getter property', property)
		// if caller not privateOK, notify the caller
		if( instance._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[2]
			// log the event
			console.assert(false, 'access to private property "'+property+'" from '+stackFrame)
		}
		// actually return the value
		return value;
	});
	// check private in the setter
	QGetterSetter.defineSetter(instance, property, function aFunction(value, caller, property){
console.log('check setter property', property)
		// if caller not privateOK, notify the caller
		if( instance._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[2]
			// log the event
			console.assert(false, 'access to private property "'+property+'" from '+stackFrame)
		}
		// actually return the value
		return value;
	});
};


/**
 * define a private function
 * @param  {Object} instance	the object instance
 * @param  {Function} fn    the function to overload
 * @return {Function}       the overloaded function
 */
PrivateForJS.privateFunction	= function(instance, fn){
	var functionName= fn.name || 'anonymous'
	return function _checkPrivateFunction(){
		// get caller
		var caller	= _checkPrivateFunction.caller;
		// if caller not privateOK, notify the caller
console.log('check function', functionName)
		if( instance._privateOkFn.indexOf(caller) === -1 ){
			// get stackFrame for the originId of the user
			var stackFrame	= Stacktrace.parse()[1]
			// log the event
			console.assert(false, 'access to private function "'+functionName+'" from '+stackFrame)
		}
		// forward the call to the original function
		return fn.apply(this, arguments);
	};
};

//////////////////////////////////////////////////////////////////////////////////
//		Helpers								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * get all the functions of the instance, and declare them privateOK
 * 
 * @param  {Object} instance [description]
 */
PrivateForJS.initInstance	= function(instance){
	// populate the ._privateOkFn with the .prototype function which start by '_'
	for(var property in instance){
		// TODO should i do a .hasOwnProperty on a .prototype ?
		if( typeof(instance[property]) !== 'function')	continue;
		// console.log('PrivateOKFn', property)
		PrivateForJS.pushPrivateOkFn(instance, instance[property])
	}	
}


/**
 * declare any property/functions starting with '_' as private
 * 
 * @param  {object} instance	the instance of the object
 */
PrivateForJS.privatize	= function(instance){
	// sanity check
	console.assert( '_privateOkFn' in instance, 'this instance isnt init for PrivateForJS')
	// declare any property/functions starting with '_' as private	
	for(var property in instance){
		if( property[0] !== '_' )		continue;
		if( typeof(instance[property]) === 'function' ){
			// console.log('declare', property, 'as private function')
			instance[property] = PrivateForJS.privateFunction(instance, instance[property])
		}else{
			// console.log('declare', property, 'as private property')
			PrivateForJS.privateProperty(instance, property);		
		}
	}
};

