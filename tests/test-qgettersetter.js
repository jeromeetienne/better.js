var QGetterSetter	= QGetterSetter	|| require('../src/qgettersetter.js')

describe('QGetterSetter.defineGetter', function(){
	// define sample object
	var foo	= {
		bar	: 32
	};

	// setup the object
	QGetterSetter.defineGetter(foo, 'bar', function(value){
		return value*2;
	});
	QGetterSetter.defineGetter(foo, 'bar', function(value){
		return value+1;
	});

	// do all the tests
	it('is able to get without error', function(){
		//console.log("foo.bar", foo.bar)
		console.assert( foo.bar === 65 );
	});
});

describe('QGetterSetter.defineSetter', function(){
	// define sample object
	var foo	= {
		bar	: 32
	};

	// setup the object
	QGetterSetter.defineSetter(foo, 'bar', function(value){
		return value*2;
	});
	QGetterSetter.defineSetter(foo, 'bar', function(value){
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
