#!/usr/bin/env node

var foo		= {
	bar	: 2
};

var PropertyAttr	= require('../src/propertyattr.js');


PropertyAttr.define(foo, 'bar').typeCheck([Number, 'nonan']);


foo.bar	= 3;

foo.bar	= NaN;