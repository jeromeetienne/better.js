#!/usr/bin/env node

var fnAttr	= require('../src/functionattr.js');

function foo(){
	console.log('inside')
	return 'bar';
}

foo	= fnAttr(foo, 'Fn.foo')
	.log('bonjour')
	.after(function(){
		console.log('superafter')
	})
	.end();

foo();

foo()


