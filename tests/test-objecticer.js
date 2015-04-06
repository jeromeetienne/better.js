var ObjectIcer	= ObjectIcer	|| require('../src/objecticer.js');


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
describe('ObjectIcer (read only)', function(){
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Handle when it isn't available
	//////////////////////////////////////////////////////////////////////////////////
	if( ObjectIcer.isAvailable === false ){
		console.log('ObjectIcer', ObjectIcer.isAvailable)
		it('should be available', function(){
			console.assert(false, 'And it isnt! Please reconfig the js VM on which you run this test')		
		});
		return
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
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
		console.assert(fail !== true, 'this should never be seen')		
	});

	it('should not assert() when reading an existing property equal to undefined', function(){
		var dummy = object.bla
		console.assert( dummy === undefined )
	});

	it('should not assert when reading defined property', function(){
		console.assert(object.foo === 'bar')
	});
});



//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
describe('ObjectIcer (write only)', function(){
	//////////////////////////////////////////////////////////////////////////////////
	//		Handle when it isn't available
	//////////////////////////////////////////////////////////////////////////////////
	if( ObjectIcer.isAvailable === false ){
		console.log('ObjectIcer', ObjectIcer.isAvailable)
		it('should be available', function(){
			console.assert(false, 'And it isnt! Please reconfig the js VM on which you run this test')		
		});
		return
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
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
		console.assert(fail !== true, 'this should never be seen')
	});
});


//////////////////////////////////////////////////////////////////////////////////
//		Comments
//////////////////////////////////////////////////////////////////////////////////
describe('ObjectIcer (rw)', function(){
	//////////////////////////////////////////////////////////////////////////////////
	//		Handle when it isn't available
	//////////////////////////////////////////////////////////////////////////////////
	if( ObjectIcer.isAvailable === false ){
		console.log('ObjectIcer', ObjectIcer.isAvailable)
		it('should be available', function(){
			console.assert(false, 'And it isnt! Please reconfig the js VM on which you run this test')		
		});
		return
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
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
		console.assert(fail !== true, 'this should never be seen')		
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
		console.assert(fail !== true, 'this should never be seen')
	});
});
