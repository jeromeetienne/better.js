#!/usr/bin/env node

var foo		= {
	bar	: 2
};

var PropertyAttr	= PropertyAttr	|| require('../src/propertyattr.js');

PropertyAttr.define(foo, 'bar')
	// .typeCheck(['nonan', Number])
	.typeCheck(['noNaN', Number])
	.trackUsage();

foo.bar	= 3;

console.log('value', foo.bar)
foo.bar	= 'bla';
console.log('value', foo.bar)

console.log('PropertyAttr.usageTracker')
PropertyAttr.usageTracker.dump();
