var preventUndefinedProperties	= preventUndefinedProperties	|| require('../src/preventundefinedproperties.js');

describe('preventUndefinedProperties()', function(){

	var obj	= {
		foo	: 'bar'
	}
	var obj	= preventUndefinedProperties(obj)

	it('should assert() when reading undefined property', function(){
		try{	
			var dummy = obj.fooUnexisting
			console.assert(false, 'this point should never been reached')
		}catch(e){}
	});

	it('should not assert when reading defined property', function(){
		console.assert(obj.foo === 'bar')
	});
});