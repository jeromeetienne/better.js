
var FunctionAttr	= FunctionAttr	|| require('../src/functionattr.js');
require('./helpers/privateforjs-privatize.js');

var aClass1	= function(){
	console.log('in aClass1 ctor');
	this._bar	= 2;
};

aClass1.prototype.bar	= function aClass1_bar(){
	return this._bar;
};

aClass1	= FunctionAttr.define(aClass1)
	.privatize()
	.done();


var aObject	= new aClass1()

