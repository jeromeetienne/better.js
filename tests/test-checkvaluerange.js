var debug	= debug	|| require('../src/debug.js')

describe('debug.checkValueRange()', function(){
	// define sample object
	var foo	= {
		bar	: 32
	};

	// setup the object
	debug.checkValueRange(foo, 'bar', function(value){
		return value < 40;
	});

	// do all the tests
	it('is able to set with proper value without error', function(){
		foo.bar	= 32;
	});
	it('triggers error when setting to a improper value', function(){
		var thrown	= false;
		try{
			foo.bar	= 99;
		}catch(e){
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});
});
