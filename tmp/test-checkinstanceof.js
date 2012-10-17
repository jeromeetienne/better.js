var debug	= debug	|| require('../src/debug.js')

describe('debug.checkInstanceof()', function(){
	// define sample object
	var SuperClass	= function(){};
	var foo		= {
		bar	: new SuperClass()
	};

	// setup the object
	debug.checkInstanceof(foo, 'bar', SuperClass)

	// do all the tests
	it('is able to set with proper type without error', function(){
		foo.bar	= new SuperClass();
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
});
