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
 * @param  {Array}  allowedTypes      the allows tipe
 */
StrongTyping.setter	= function(baseObject, property, allowedTypes){
	// check initial value
	var value	= baseObject[property];
	var isValid	= StrongTyping.value(value, allowedTypes)
	console.assert(isValid, 'initial value got invalid type');
	// setup the setter
	QGetterSetter.defineSetter(baseObject, property, function(value){
		// check the value type
		var isValid	= StrongTyping.value(value, allowedTypes);

		console.assert(isValid, 'Invalid type. MUST be a'
			, StrongTyping.allowedTypesToString(allowedTypes)
			, 'and it is'
			, StrongTyping.valueTypeToString(value))

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
			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', StrongTyping.allowedTypesToString(paramsTypes[i]), 'It is ===', arguments[i])
		}
		// forward the call to the original function
		var result	= originalFn.apply(this, arguments);
		// check the result type
		var isValid	= StrongTyping.value(result, returnTypes);			
		console.assert(isValid, 'invalid type for returned value. MUST be of type', StrongTyping.allowedTypesToString(returnTypes), 'It is ===', result);
		// return the result
		return result;
	}
}



//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

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
        var result      = false
	for(var i = 0; i < types.length; i++){
		var type	= types[i];
		var match	= testTypeMatchesValue(type, value)
                // if match is 'NEVER', it will 
                if( match === 'NEVER')  return false;
                console.assert(match === true || match === false)
                
                result	= result || match;
	}
	// return the just computed result
	return result;


        /**
         * test if a type matches a value
         * @param {*} type  - the type
         * @param {*} value - the value
         * @return {Boolean|String} - true if they matches, false if they dont match, 'NEVER' to declare the value 
         * will never match
         */
        function testTypeMatchesValue(type, value){
                // PRIMITIVE TYPE
		if( type === Number ){
			return typeof(value) === 'number';
		}else if( type === String ){
			return typeof(value) === 'string';
		}else if( type === Boolean ){
			return typeof(value) === 'boolean'
		}else if( type === Function ){
			return value instanceof Function;
		}else if( type === undefined ){
			return typeof(value) === 'undefined';
		}else if( type === null ){
			return value === null;

                // CUSTOM TYPE
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'any' ){
			return true
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'never' ){
			return false;

                // VALIDATORS
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonnull' ){
			if( value === null )	return 'NEVER'
			return false;	// continue as it is a validator
		}else if( typeof(type) === 'string' && type.toLowerCase() === 'nonan' ){
			if( isNaN(value) === true )	return 'NEVER';
			return false;	// continue as it is a validator
		}else if( type instanceof StrongTyping._ValidatorClass ){
			var isValid	= type.fn(value);
			if( isValid === false )	return 'NEVER';
 			return false;	// continue as it is a validator
                
                // HANDLE 'TYPE-IN-STRING' case
		}else if( typeof(type) === 'string' ){
                        // this mean type is a string containing a type, so we eval it and test it
			return testTypeMatchesValue(eval(type), value)

                // INSTANCEOF
                }else{
                        // here type is supposedly a contructor function() so we use instanceof
        		return value instanceof type;                        
                }
        }
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


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * Convert allowed types into String
 * @param  {Array} allowedTypes - allowed types
 * @return {String}       the just-built string
 */
StrongTyping.allowedTypesToString	= function(allowedTypes){
	// handle parameter polymorphism
	if( allowedTypes instanceof Array === false ){
		return typeToString(allowedTypes)
	}

	var output = '['
	for(var i = 0; i < allowedTypes.length; i++){
		if( i > 0 )	output += ', '
		output += typeToString(allowedTypes[i])
	}
	output += ']'
	return output

	/**
	 * convert one allowed type to a string
	 * 
	 * @param  {any} allowedType - the allowed type
	 * @return {String}          - the string for this type
	 */
	function typeToString(allowedType){
		if( allowedType === Number )	return 'Number'
		if( allowedType === String )	return 'String'
		if( allowedType === Object )	return 'Object'
		if( allowedType === undefined )	return 'undefined'
		return allowedType.toString()
	}
}

/**
 * get the type of a value and return it as a String
 * 
 * @param  {any} value - allowed types
 * @return {String}       the just-built string
 */
StrongTyping.valueTypeToString	= function(value){
	if( typeof(value) === 'string' )	return 'String'
	if( typeof(value) === 'number' )	return 'Number'
	if( typeof(value) === 'object' )	return 'Object'

	return typeof(value)
}
