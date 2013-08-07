#!/usr/bin/env node

var TypeCheck	= TypeCheck	||	require('../src/typecheck.js');

// to check a value
var value	= 'aString';
var types	= [Number];
var valid	= TypeCheck.value(value, types)
console.assert( valid === false )
console.log('value', value, 'is of type', types, ':', valid)


// to check a function
var fct		= function(aString, aNumber){
	//console.log('in original fct', aString, aNumber)
	return aString + aNumber;
}
// overload the function with TypeCheck.fn
fct	= TypeCheck.fn(fct, [String, Number], String);

// use the function
var result	= fct('bla', 99)
console.log('result', result)

// var result	= fct('bla', NaN)
// console.log('result', result)

// var result	= fct('bla', 'prout')
// console.log('result', result)

// var result	= fct('bla', 99, 98)
// console.log('result', result)

// var result	= fct('bla')
// console.log('result', result)