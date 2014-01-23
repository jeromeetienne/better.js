#!/usr/bin/env node

var preventUndefinedProperties	= preventUndefinedProperties	|| require('../src/preventundefinedproperties.js');


var obj	= {
	foo	: 'bar'
}

var obj	= preventUndefinedProperties(obj)

try{	
	console.log('foo value', obj.foo2)
	console.assert(false, 'this point should never been reached')
}catch(e){
	console.assert(e.message !== 'this point should never been reached')
}

console.assert(obj.foo === 'bar')
