#!/usr/bin/env node

var TypeCheck	= require('../src/typecheck.js');


var value	= 'aString';
var types	= [Number,];
var valid	= TypeCheck.value(value, types)
console.assert( valid === false )
//console.log('valid', valid);
//console.log('value', value, valid ? 'is' : 'isnt', 'of types', types)

var fct		= function(aString, aNumber){
	//console.log('in original fct', aString, aNumber)
	return aString + aNumber;
}

fct	= TypeCheck.fn(fct, [String, Number], String);

var result	= fct('bla', 99)
console.log('result', result)

// var result	= fct('bla', 'prout')
// console.log('result', result)

// var result	= fct('bla', 99, 98)
// console.log('result', result)

// var result	= fct('bla')
// console.log('result', result)