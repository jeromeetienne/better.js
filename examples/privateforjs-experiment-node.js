#!/usr/bin/env node


var PrivateForJS	= require('../src/privateforjs.js');

var aClass1	= function(){
	console.log('in aClass1 ctor');
	this._bar	= 2;

	//PrivateForJS.privateProperty(aClass1, this, 'bar');
	PrivateForJS.privatize(aClass1, this)
};

aClass1.prototype.bar	= function(){
	return this._bar;
}

aClass1.prototype._foo	= function(){
	return this.bar();
}


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

console.log('obj.bla()', obj.bar());
//console.log('obj._bla', obj._bar);



