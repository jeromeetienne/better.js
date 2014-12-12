#!/usr/bin/env node

var PrivateForJS	= PrivateForJS	|| require('../src/privateforjs.js');

var aClass1	= function(){
	console.log('in aClass1 ctor');
	this._bar	= 2;

	//PrivateForJS.privateProperty(aClass1, this, 'bar');
	//PrivateForJS.privatize(aClass1, this)
};

aClass1.prototype.bar	= function aClass1_bar(){
	return this._foo();
}

aClass1.prototype._foo	= function aClass1__foo(){
	console.log('inside foo');
	return 3;
}

// TODO when to extract the privateOK Function
//aClass1._PrivateForJS_OkFns	= PrivateForJS._extractLocalMethods(aClass1);

PrivateForJS.pushPrivateOkFn(aClass1);

//aClass1.prototype._foo	= PrivateForJS.privateMethod(aClass1, aClass1.prototype._foo, '_foo');



//////////////////////////////////////////////////////////////////////////////////
//		Test protected							//
//////////////////////////////////////////////////////////////////////////////////

var aClass2	= function(){
	this.__proto__.constructor.apply(this, arguments);
}
aClass2.prototype	= Object.create( aClass1.prototype );

/**
 * Overload .bar() function 
 */
aClass2.prototype.bar	= function(){ return this._bar;	}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

var obj	= new aClass1

obj._foo();
//console.log('obj.bla()', obj.bar());
//console.log('obj._bla', obj._bar);



