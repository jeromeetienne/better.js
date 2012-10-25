var PrivateForJS	= PrivateForJS	|| require('../src/privateforjs.js');

describe('PrivateForJS', function(){
	// define a simple class 
	var aClass	= function(){
		this._bar	= 2;
		
		// define a private property
		PrivateForJS.privateProperty(aClass, this, '_bar');
	};
	aClass.prototype.bar	= function(){
		return this._bar;
	}
	aClass.prototype.crossBar	= function(obj){
		return obj._bar;
	}
	// define function which are ok to push
	PrivateForJS.pushPrivateOkFn(aClass);
	
	
	it('should not trigger assert thru the getter', function(){
		var aInstance	= new aClass();
		console.assert( aInstance.bar() === 2 );
	});

	it('should trigger assert when accessed directly', function(){
		var aInstance	= new aClass();
		try {
			var tmp	= aInstance._bar;
			console.assert(false, "No exception triggered!!");
		} catch(e){};
	});

	it('should not trigger assert cross instance of the same class', function(){
		var aInstance1	= new aClass();
		var aInstance2	= new aClass();
		console.assert( aInstance2.crossBar(aInstance1) === 2 );
	});
});

