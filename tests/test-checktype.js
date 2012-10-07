var debug	= debug	|| require('../src/debug.js')

describe('debug.checkType()', function(){
	// define sample object
	var SuperClass	= function(){};
	var foo	= {
		bar	: 32,
		instance: new SuperClass()
	};

	// setup the object
	debug.checkType(foo, 'bar', Number);
	debug.checkType(foo, 'instance', SuperClass);

	// do all the tests
	it('is able to set with proper type without error', function(){
		foo.bar	= 32;
	});
	
	it('triggers error when setting to a invalid type', function(){
		var thrown	= false;
		try{
			foo.bar	= "aString";
		}catch(e){
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});


	// do all the tests
	it('is able to set with proper type without error', function(){
		foo.instance	= new SuperClass();
	});
	it('triggers error when setting to a invalid type', function(){
		var thrown	= false;
		try{
			foo.instance	= "aString";
		}catch(e){
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});

});
