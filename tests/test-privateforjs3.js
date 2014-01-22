var PrivateForJS3	= PrivateForJS3	|| require('../src/privateforjs3.js');

describe('PrivateForJS3', function(){
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	var aClass1	= function aClass1_ctor(){
		this._add	= function aClass1_add(a,b){ return a+b }
		this.john	= 'smith'
		this._bar	= 2

		PrivateForJS3.initInstance(this)
		PrivateForJS3.privatize(this)
	};

	aClass1.prototype.bar	= function aClass1_bar(){
		return this._bar
	}
	aClass1.prototype.crossBar	= function(obj){
		return obj._bar;
	}
	aClass1.prototype._foo	= function aClass1__foo(){
		console.log('inside foo')
		return 3
	}	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	it('should assert when private properties are accessed directly', function(){
		var aInstance	= new aClass1()
		try {
			var tmp	= aInstance._bar;
			var failed	= true
		} catch(e){};
		console.assert(failed !== true, "No exception triggered!!")
	})

	it('should not assert thru the public getter function', function(){
		var aInstance	= new aClass1()
		console.assert( aInstance.bar() === 2 )
	})

	it('should not trigger assert cross instance of the same class', function(){
		var aInstance1	= new aClass1()
		var aInstance2	= new aClass1()
		console.assert( aInstance2.crossBar(aInstance1) === 2 )
	})
});

