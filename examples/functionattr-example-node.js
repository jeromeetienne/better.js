#!/usr/bin/env node

var FunctionAttr	= require('../src/functionattr.js');

function foo(){
	console.log('inside')
	return 'bar';
};

foo	= FunctionAttr.define(foo, 'Fn.foo')
	.log('bonjour')
	.after(function(){
		console.log('superafter');
	})
	.trackUsage()
	.done();

foo();

foo()

FunctionAttr.usageTracker.dump();


