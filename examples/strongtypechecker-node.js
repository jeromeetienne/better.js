#!/usr/bin/env node

//var debug		= require('../debug.js');
var StrongTypeChecker	= require('../strongtypechecker.js');


var value	= 'aString';
var types	= [Number,];
var valid	= StrongTypeChecker.checkValueType(value, types)
console.assert( valid === false )
//console.log('valid', valid);
//console.log('value', value, valid ? 'is' : 'isnt', 'of types', types)

var fct		= function(aString, aNumber){
	return aString + aNumber;
}

fct	= StrongTypeChecker.checkFunctionTypes(fct, [String, Number], String);

var result	= fct('bla', 99)
console.log('result', result)
