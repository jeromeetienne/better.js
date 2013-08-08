/**
 * @fileOverview contains TypeCheck class
 * 
 * if input of type in text see 
 * * https://developers.google.com/closure/compiler/docs/js-for-compiler
 * * use same format
 * * autogenerate function parameter check
 */

/**
 * @namespace Strong typing for javascript
 */
var TypeCheck	= {};

// dependancy
var QGetterSetter	= QGetterSetter	|| require('../src/qgettersetter.js')

// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= TypeCheck;



/**
 * Check type with a object setter
 * 
 * @param  {Object} baseObject the base object which contains the property
 * @param  {String} property   the string of the property name
 * @param  {Array}  types      the allows tipe
 */
TypeCheck.setter	= function(baseObject, property, types){
	// check initial value
	var value	= baseObject[property];
	var isValid	= TypeCheck.value(value, types)
	console.assert(isValid, 'initial value got invalid type');
	// setup the setter
	QGetterSetter.defineSetter(baseObject, property, function(value){
		// check the value type
		var isValid	= TypeCheck.value(value, types);			
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
TypeCheck.fn	= function(originalFn, paramsTypes, returnTypes){
	return function(){
		// check parameters type
		console.assert(arguments.length <= paramsTypes.length, 'function received '+arguments.length+' parameters but recevied only '+paramsTypes.length+'!');
		for(var i = 0; i < paramsTypes.length; i++){
			var isValid	= TypeCheck.value(arguments[i], paramsTypes[i]);			
			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', paramsTypes[i], 'It is ===', arguments[i])
		}
		// forward the call to the original function
		var result	= originalFn.apply(this, arguments);
		// check the result type
		var isValid	= TypeCheck.value(result, returnTypes);			
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
TypeCheck.value	= function(value, types){
	// handle parameter polymorphism
	if( types instanceof Array === false )	types	= [types];
	// if types array is empty, default to ['always'], return true as in valid
	if( types.length === 0 )	return true;
	// go thru each type
	var result	= false;
	for(var i = 0; i < types.length; i++){
		var type	= types[i];
		if( type === Number ){
			var valid	= typeof(value) === 'number';
		}else if( type === String ){
			var valid	= typeof(value) === 'string';
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'always' ){
			var valid	= true;
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'never' ){
			// return immediatly as a failed validator
			return false;
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonan' ){
			var valid	= value === value;
			if( valid === false )	return false;
			continue;	// continue as it is a validator
		}else if( type instanceof TypeCheck._ValidatorClass ){
			var valid	= type.fn(value);
			if( valid === false )	return false;
			continue;	// continue as it is a validator
		}else {
			var valid	= value instanceof type;
		}
		result	= result || valid;
	}
	// return the just computed result
	return result;
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Validator creator. a Validator is a function which is used to validate .value().
 * All the validators MUST be true for the checked value to be valid. 
 * 
 * @param {Function(value)} fn function which return true if value is valid, false otherwise
 */
TypeCheck.Validator	= function(fn){
	return new TypeCheck._ValidatorClass(fn)
}

/**
 * Internal class to be recognisable by TypeCheck.value()
 * 
 * @param  {Function} fn function which return true if value is valid, false otherwise
 */
TypeCheck._ValidatorClass= function(fn){
	console.assert(fn instanceof Function);
	this.fn	= fn;
}
