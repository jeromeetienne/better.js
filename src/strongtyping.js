/**
 * @fileOverview contains StrongTyping class
 * 
 * if input of type in text see 
 * * https://developers.google.com/closure/compiler/docs/js-for-compiler
 * * use same format
 * * autogenerate function parameter check
 */

/**
 * @namespace Strong typing for javascript
 */
var StrongTyping	= {};

// dependancy
var QGetterSetter	= QGetterSetter	|| require('../src/qgettersetter.js')

// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= StrongTyping;


/**
 * Check type with a object setter
 * 
 * @param  {Object} baseObject the base object which contains the property
 * @param  {String} property   the string of the property name
 * @param  {Array}  types      the allows tipe
 */
StrongTyping.setter	= function(baseObject, property, types){
	// check initial value
	var value	= baseObject[property];
	var isValid	= StrongTyping.value(value, types)
	console.assert(isValid, 'initial value got invalid type');
	// setup the setter
	QGetterSetter.defineSetter(baseObject, property, function(value){
		// check the value type
		var isValid	= StrongTyping.value(value, types);			
		console.assert(isValid, 'invalid type value='+value+' types='+types);
		// return the value
		return value;
	});
};

/**
 * function wrapper to check the type of function parameters and return value
 * 
 * @param  {Function} originalFn  the function to wrap
 * @param  {Array}    paramsTypes allowed types for the paramter. array with each item is the allowed types for this parameter.
 * @param  {Array}    returnTypes allowed types for the return value
 * @return {boolean}  return isValid, so true if types matche, false otherwise
 */
StrongTyping.fn	= function(originalFn, paramsTypes, returnTypes){
// TODO is this usefull ? isnt that a duplicate with propertyAttr2

	return function StrongTyping_fn(){
		// check arguments type
		console.assert(arguments.length <= paramsTypes.length, 'function received '+arguments.length+' parameters but allows only '+paramsTypes.length+'!');
		for(var i = 0; i < paramsTypes.length; i++){
			var isValid	= StrongTyping.value(arguments[i], paramsTypes[i]);			
			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', paramsTypes[i], 'It is ===', arguments[i])
		}
		// forward the call to the original function
		var result	= originalFn.apply(this, arguments);
		// check the result type
		var isValid	= StrongTyping.value(result, returnTypes);			
		console.assert(isValid, 'invalid type for returned value. MUST be of type', returnTypes, 'It is ===', result);
		// return the result
		return result;
	}
}

/**
 * Check the type of a value
 * 
 * @param  {*} value the value to check
 * @param  {Array.<function>} types the types allowed for this variable
 * @return {boolean} return isValid, so true if types matche, false otherwise
 */
StrongTyping.value	= function(value, types){
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
		}else if( type === Boolean ){
			var valid	= typeof(value) === 'boolean'
		}else if( type === Function ){
			var valid	= value instanceof Function;
		}else if( type === undefined ){
			var valid	= typeof(value) === 'undefined';
		}else if( type === null ){
			var valid	= value === null;
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'any' ){
			var valid	= true;
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'never' ){
			// return immediatly as a failed validator
			return false;
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonnull' ){
			var valid	= value !== null;
			if( valid === false )	return false;
			continue;	// continue as it is a validator
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonan' ){
			var valid	= value === value;
			if( valid === false )	return false;
			continue;	// continue as it is a validator
		}else if( type instanceof StrongTyping._ValidatorClass ){
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

/**
 * Convert a type to a user-friendly name
 *
 * @param  {*} type            The type to check
 * @return {String|Array}      The name of the type, or an array of names if the argument is an array of types
 */
StrongTyping.typename = function(type) {
	var stringified = '' + type;

	// if the type param is an array of types, return an array of typenames
	if (stringified === '[object Array]') {
		var typenames = new Array(type.length);
		for (var ii = 0; ii < type.length; ++ii) {
			typenames[ii] = StrongTyping.typename(type[ii]);
		}
		return typenames;
	}

	// shortcuts for known types
	if (type === Number) return 'Number';
	if (type === String) return 'String';
	if (type === Boolean) return 'Boolean';
	if (type === Function) return 'Function';
	if (type === Object) return 'Object';
	if (type === Array) return 'Array';
	if (type === undefined) return 'undefined';
	if (type === null) return 'null';

	if (typeof(type) === 'function' && type.name) {
		return type.name;
	}

	return stringified;
}

/**
 * Convert a value to a list of user-friendly type names
 *
 * @param  {*}          value Any value type to check
 * @return {String[]}   An array of matching typenames for the value
 */
StrongTyping.valuetypenames = function(value) {
	var typenames = [];

	var valtype = typeof(value);
	switch (valtype) {
		case 'number':
			typenames.push('Number');
			break;
		case 'string':
			typenames.push('String');
			break;
		case 'boolean':
			typenames.push('Boolean');
			break;
		case 'function':
			typenames.push('Function');
			break;
		case 'object':
			if (value === null) {
				typenames.push('null');
			} else if (value === '[object Array]') {
				typenames.push('Array');
			} else {
				typenames.push('Object');
				if (value.constructor) {
					typenames.push(value.constructor.name);
				}
			}
			break;
		default:
			// undefined falls through here
			typenames.push(valtype);
			break;
	}

	return typenames;
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
StrongTyping.Validator	= function(fn){
	return new StrongTyping._ValidatorClass(fn)
}

/**
 * Internal class to be recognisable by StrongTyping.value()
 * 
 * @param  {Function} fn function which return true if value is valid, false otherwise
 */
StrongTyping._ValidatorClass= function(fn){
	console.assert(fn instanceof Function);
	this.fn	= fn;
}
