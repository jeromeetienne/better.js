var debug	= debug	|| require('../src/debug.js')

describe('debug.checkTypeof()', function(){
	// define sample object
	var foo	= {
		bar	: 32
	};

	// setup the object
	debug.checkTypeof(foo, 'bar', 'number')

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
});
