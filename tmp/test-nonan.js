var debug	= debug	|| require('../src/debug.js')

describe('debug.noNaN()', function(){
	// define sample object
	var foo	= {
		bar	: 32
	};

	// setup the object
	debug.noNaN(foo, 'bar')

	// do all the tests
	it('is able to get without error', function(){
		console.assert( foo.bar === 32 );
	});
	it('is able to set without error', function(){
		foo.bar	= 32;
	});
	it('triggers error when setting NaN', function(){
		var thrown	= false;
		try{
			foo.bar	= NaN;
		}catch(e){
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});
});
