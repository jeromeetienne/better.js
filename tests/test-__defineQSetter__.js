Object.prototype.__defineQGetter__	|| require('../src/queueablegettersetter.js')

describe('Object.__defineQSetter__', function(){
	// define sample object
	var foo	= {
		bar	: 32
	};

	// setup the object
	foo.__defineQSetter__('bar', function(value){
		return value*2;
	});
	foo.__defineQSetter__('bar', function(value){
		return value+1;
	});

	// do all the tests
	it('is able to set without error', function(){
		foo.bar	= 32;
	});
	it('is able to get without error', function(){
		console.assert(foo.bar === 65);
	});
});
