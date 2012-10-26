#!/usr/bin/env node

//var assertWhichStop	= require('../src/assertwhichstop.js');

// overload console.assert
//assertWhichStop.overloadConsole();


console.time('10000asserts')
for(var i = 0; i < 100000; i++){
	console.assert( i !== 200000 );
}
console.timeEnd('10000asserts')

