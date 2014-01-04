var ObjectIcer	= ObjectIcer	|| require('../src/objecticer.js');

describe('ObjectIcer (read only)', function(){
	var object	= {
		foo	: 'bar',
		bla	: undefined
	}
	var object	= ObjectIcer(object, 'read')

	it('should assert() when reading undefined property', function(){
		try{	
			var dummy = object.fooUnexisting
			var fail= true;
		}catch(e){}
		console.assert(!fail, 'this should never be seen')		
	});

	it('should not assert() when reading an existing property equal to undefined', function(){
		var dummy = object.bla
		console.assert( dummy === undefined )
	});

	it('should not assert when reading defined property', function(){
		console.assert(object.foo === 'bar')
	});
});


describe('ObjectIcer (write only)', function(){
	"use strict";

	var object	= {
		foo	: 'bar'
	}
	var object	= ObjectIcer(object, 'write')

	it('should be able to write on existing property', function(){
		object.foo	= "baz";
		console.assert( object.foo === 'baz' )
	});
	
	it('should assert when creating a new property', function(){
		try{	
			object.foo2	= "quux";
			var fail= true;
		}catch(e){}
		console.assert(!fail, 'this should never be seen')
	});
});


describe('ObjectIcer (rw)', function(){
	var object	= {
		foo	: 'bar',
		bla	: undefined
	}
	var object	= ObjectIcer(object, 'rw')

	it('should assert() when reading undefined property', function(){
		try{	
			var dummy = object.fooUnexisting
			var fail= true;
		}catch(e){}
		console.assert(!fail, 'this should never be seen')		
	});

	it('should not assert() when reading an existing property equal to undefined', function(){
		var dummy = object.bla
	});

	it('should not assert when reading defined property', function(){
		console.assert(object.foo === 'bar')
	});
	
	it('should be able to write on existing property', function(){
		object.foo	= "baz";
	});
	
	it('should assert when creating a new property', function(){
		try{	
			object.foo2	= "quux";
			var fail= true;
		}catch(e){}
		console.assert(!fail, 'this should never be seen')
	});
});
