#!/usr/bin/env node

var assertWhichStop	= require('../src/assertwhichstop.js');

// overload console.assert
console.assert	= assertWhichStop

console.log('before assert');

console.assert( false );
//assertWhichStop(false)

console.log('after assert - this message should never show up');
