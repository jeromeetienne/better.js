var PrivateForJS3	= PrivateForJS3	|| require('../src/privateforjs3.js')

var aClass1	= function aClass1_ctor(){
	this._add	= function aClass1_add(a,b){ return a+b }
	this.john	= 'smith'
	this._bar	= 2

	PrivateForJS3.privatize(this)
};

aClass1.prototype.bar	= function aClass1_bar(){
	return this._bar
}

aClass1.prototype._foo	= function aClass1__foo(){
	console.log('inside foo')
	return 3
}

// PrivateForJS3.pushPrivateOkFn(aClass1);
// aClass1.prototype._foo	= PrivateForJS3.privateFunction(aClass1, aClass1.prototype._foo)

// PrivateForJS3.privatizeClass(aClass1)

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

var obj	= new aClass1

// obj._foo();
// console.log('1+2', obj._add(1,2));
// console.log('obj._bla', obj._bar);

// console.log('obj.bla()', obj.bar());
// console.log('obj.john', obj.john);


