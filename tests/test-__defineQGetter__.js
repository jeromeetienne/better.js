Object.prototype.__defineQGetter__	|| require('../src/queueablegettersetter.js')

describe('Object.__defineQGetter__', function(){
	// define sample object
	var foo	= {
		bar	: 32
	};

	// setup the object
	foo.__defineQGetter__('bar', function(value){
		return value*2;
	});
	foo.__defineQGetter__('bar', function(value){
		return value+1;
	});

	// do all the tests
	it('is able to get without error', function(){
		//console.log("foo.bar", foo.bar)
		console.assert( foo.bar === 65 );
	});
});
