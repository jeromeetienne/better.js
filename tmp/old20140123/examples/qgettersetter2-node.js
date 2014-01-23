#!/usr/bin/env node

// get the class
var QGetterSetter2	= QGetterSetter2	|| require('../src/qgettersetter2.js')

var foo		= {
	x	: 3
};

console.log('before new getter: foo.x ===', foo.x)

QGetterSetter2.defineGetter(foo, 'x', function(value){
	return value*2;
});

QGetterSetter2.defineSetter(foo, 'x', function(value){
	return value/2;
});

foo.x	= 5

console.log('after new getter: foo.x ===', foo.x)


console.log('properties', Object.keys(foo))