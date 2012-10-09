/**
 * @namespace Strong typing for javascript
 */
var StrongTypeCheck	= {};

Object.prototype.__defineQGetter__	|| require('./queuablegettersetter.js')

/**
 * Check type with a object setter
 * 
 * @param  {Object} baseObject the base object which contains the property
 * @param  {String} property   the string of the property name
 * @param  {Array}  types      the allows tipe
 */
StrongTypeCheck.setter	= function(baseObject, property, types){
	// check initial value
	var value	= baseObject[property];
	var isValid	= StrongTypeCheck.value(value, types)
	console.assert(isValid, 'initial value got invalid type');
	// setup the setter
	baseObject.__defineQSetter__(property, function(value){
		// check the value type
		var isValid	= StrongTypeCheck.value(value, types);			
		console.assert(isValid, 'invalid type');
		// return the value
		return value;
	});
};

/**
 * function wrapper to check the type of function parameters and return value
 * @param  {Function} originalFn  the function to wrap
 * @param  {Array}    paramsTypes allowed types for the paramter. array with each item is the allowed types for this parameter.
 * @param  {Array}    returnTypes allowed types for the return value
 * @return {boolean}  return isValid, so true if types matche, false otherwise
 */
StrongTypeCheck.fn	= function(originalFn, paramsTypes, returnTypes){
	return function(){
		// check parameters type
		console.assert(arguments.length <= paramsTypes.length, 'funciton received '+arguments.length+' parameters but recevied only '+returnTypes.length+'!');
		for(var i = 0; i < paramsTypes.length; i++){
			var isValid	= StrongTypeCheck.value(arguments[i], paramsTypes[i]);			
			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', paramsTypes[i], 'It is ===', arguments[i])
		}
		// forward the call to the original function
		var result	= originalFn.apply(this, arguments);
		// check the result type
		var isValid	= StrongTypeCheck.value(result, returnTypes);			
		console.assert(isValid, 'invalid type for returned value. MUST be of type', returnTypes, 'It is ===', result);
		// return the result
		return result;
	}
}

/**
 * Check the type of a value
 * @param  {*} value the value to check
 * @param  {Array.<function>} types the types allowed for this variable
 * @return {boolean} return isValid, so true if types matche, false otherwise
 */
StrongTypeCheck.value	= function(value, types){
	// handle parameter polymorphism
	if( types instanceof Array === false )	types	= [types];
	// go thru each type
	var result	= false;
	for(var i = 0; i < types.length; i++){
		var type	= types[i];
		if( type === Number ){
			var valid	= typeof(value) === 'number';
		}else if( type === String ){
			var valid	= typeof(value) === 'string';			
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonan' ){
			if( value !== value )	return false;
		}else {
			var valid	= value instanceof type;
		}
		result	= result || valid;
	}
	// return the just computed result
	return result;
}

// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= StrongTypeCheck;