#!/usr/bin/env node

var assertWhichStop	= assertWhichStop	|| require('../src/assertwhichstop.js');

var badValue	= 2000000;
var debug	= false;
var nItem	= 1000000;

console.time('empty loop - '+nItem+' times')
for(var i = 0; i < nItem; i++){
}
console.timeEnd('empty loop - '+nItem+' times');

console.time('console.assert()')
for(var i = 0; i < nItem; i++){
	console.assert( i !== badValue );
}
console.timeEnd('console.assert()');

console.time('debug && console.assert()')
for(var i = 0; i < nItem; i++){
	debug && console.assert( i !== badValue );
}
console.timeEnd('debug && console.assert()');

console.time('assertWhichStop')
for(var i = 0; i < nItem; i++){
	assertWhichStop( i !== badValue );
}
console.timeEnd('assertWhichStop');

console.time('debug && assertWhichStop()')
for(var i = 0; i < nItem; i++){
	debug && assertWhichStop( i !== badValue );
}
console.timeEnd('debug && assertWhichStop()');

assertWhichStop.overloadConsole();

console.time('assertWhichStop acting as console.assert()')
for(var i = 0; i < nItem; i++){
	console.assert( i !== badValue );
}
console.timeEnd('assertWhichStop acting as console.assert()');

console.time('debug && assertWhichStop() acting as console.assert()')
for(var i = 0; i < nItem; i++){
	debug && assertWhichStop( i !== badValue );
}
console.timeEnd('debug && assertWhichStop() acting as console.assert()');
