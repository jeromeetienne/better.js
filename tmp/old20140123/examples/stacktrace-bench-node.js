#!/usr/bin/env node

var Stacktrace	= require('../src/stacktrace.js')

console.time('10000times')
for(var i = 0; i < 10000; i++){
	var stack	= Stacktrace.parse();
}
console.timeEnd('10000times')

console.time('10000times')
for(var i = 0; i < 10000; i++){
	var stack	= Stacktrace.parse();
}
console.timeEnd('10000times')


