#!/usr/bin/env node

var PrivateForJS2	= PrivateForJS2	|| require('../src/privateforjs2.js');

var aClass1	= function(){
	console.log('in aClass1 ctor');
	this._bar	= 2;

	// PrivateForJS2.privateProperty(aClass1, this, '_bar');
	PrivateForJS2.privatizeInstance(this)
};

aClass1.prototype.bar	= function aClass1_bar(){
	return this._foo();
}

aClass1.prototype._foo	= function aClass1__foo(){
	console.log('inside foo');
	return 3;
}

// PrivateForJS2.pushPrivateOkFn(aClass1);
// aClass1.prototype._foo	= PrivateForJS2.privateFunction(aClass1, aClass1.prototype._foo)

// PrivateForJS2.privatizeClass(aClass1)

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

var obj	= new aClass1

obj._foo();
//console.log('obj.bla()', obj.bar());
// console.log('obj._bla', obj._bar);



