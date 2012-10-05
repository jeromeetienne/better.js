#!/usr/bin/env node

function aClass(){
	var isConstructor	= this.constructor == aClass;
	if( isConstructor )	console.log('called with new')
	else			console.log('called normally')
	//aClass._callhisto	= [];
	//console.log(arguments.callee.caller)
};

console.log('without new')
aClass();

console.log('with a new')
new aClass();

