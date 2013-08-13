var ObjectIcer	= ObjectIcer	|| require('../src/objecticer.js');

describe('ObjectIcer()', function(){

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////

	var objReadIced	= {
		foo	: 'bar'
	}
	var objReadIced	= ObjectIcer.rwProperties(objReadIced)

	it('should assert() when reading undefined property', function(){
		try{	
			var dummy = objReadIced.fooUnexisting
			console.assert(false, 'this point should never been reached')
		}catch(e){}
	});
	it('should not assert when reading defined property', function(){
		console.assert(objReadIced.foo === 'bar')
	});

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////

	var objWriteIced= {
		foo	: 'bar'
	}
	var objWriteIced= ObjectIcer.writeProperties(objWriteIced)

	it('should be able to write on existing property', function(){
		objWriteIced.foo	= "baz";
	});
	
	it('should not assert when create a new property', function(){
		try{	
			objWriteIced.foo2 = "quux";
			console.assert(false, 'this point should never been reached')
		}catch(e){}
	});
});