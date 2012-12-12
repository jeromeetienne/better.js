#!/usr/bin/env node

var assertWhichStop	= assertWhichStop	|| require('../src/assertwhichstop.js');

// use debugger to stop
assertWhichStop.useDebugger	= true;

// overload console.assert
assertWhichStop.overloadConsole();

console.log('before assert');

console.assert( false );
//assertWhichStop(false)

console.log('after assert - this message should never show up');
