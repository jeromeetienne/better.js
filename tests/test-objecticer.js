var ObjectIcer	= ObjectIcer	|| require('../src/objecticer.js');

describe('ObjectIcer.readProperties()', function(){
	var objReadIced	= {
		foo	: 'bar',
		bla	: undefined
	}
	var objReadIced	= ObjectIcer.readProperties(objReadIced)

	it('should assert() when reading undefined property', function(){
		try{	
			var dummy = objReadIced.fooUnexisting
			var fail= true;
		}catch(e){}
		console.assert(!fail, 'this should never be seen')		
	});

	it('should not assert() when reading an existing property equal to undefined', function(){
		var dummy = objReadIced.bla
	});

	it('should not assert when reading defined property', function(){
		console.assert(objReadIced.foo === 'bar')
	});
});


describe('ObjectIcer.writeProperties()', function(){
	"use strict";

	var objWriteIced= {
		foo	: 'bar'
	}
	var objWriteIced= ObjectIcer.writeProperties(objWriteIced)

	it('should be able to write on existing property', function(){
		objWriteIced.foo	= "baz";
	});
	
	it('should assert when creating a new property', function(){
		try{	
			objWriteIced.foo2	= "quux";
			var fail= true;
		}catch(e){}
		console.assert(!fail, 'this should never be seen')
	});
});