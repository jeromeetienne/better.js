#!/usr/bin/env node

// get the class
var debug	= require('../debug.js');

function foo(){
	console.log('trace', debug.stacktrace());
}

foo();