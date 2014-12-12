#!/usr/bin/env node

var Stacktrace	= Stacktrace	|| require('../src/stacktrace')


function aClass(){
	var isConstructor	= this.constructor == aClass;
	// if( isConstructor )	console.log('called with new')
	// else			console.log('called normally')
	
	var isConstructor	= this.constructor == aClass;
	if( isConstructor ){
		var stackItem		= Stacktrace.parse()[1];
		var origin		= stackItem.fct + '@' + stackItem.url + ':' + stackItem.line + ':' + stackItem.column;
		var counters		= aClass._newCounters;
		counters[origin]	= counters[origin] !== undefined ? counters[origin]  : 0;
		counters[origin]	+= 1;		
	}
};

aClass._newCounters	= {};

console.log('without new')
aClass();

console.log('with a new')
for(var i = 0; i < 20; i++){
	new aClass();
}

console.log('with a new')
for(var i = 0; i < 10; i++){
	new aClass();
}

console.log('with a new')
for(var i = 0; i < 3; i++){
	new aClass();
}

var counters	= aClass._newCounters;
var ranks	= Object.keys(counters);
ranks.sort(function(a, b){
	return counters[b] - counters[a];
})

//console.dir(aClass._newCounters)
console.log('ranks', ranks)

ranks.slice(0, 2).forEach(function(origin){
	console.log(counters[origin], "new aClass at ", origin);
})

