var QGetterSetter2	= QGetterSetter2	|| require('../src/qgettersetter2.js')

describe('QGetterSetter2.defineGetter', function(){
	// define sample object
	var foo	= {
		bar	: 32
	};

	// setup the object
	QGetterSetter2.defineGetter(foo, 'bar', function(value){
		return value*2
	})
	QGetterSetter2.defineGetter(foo, 'bar', function(value){
		return value+1
	})

	// do all the tests
	it('is able to get without error', function(){
		//console.log("foo.bar", foo.bar)
		console.assert( foo.bar === 65 )
	})

	it('should not define new enumerable properties', function(){
		console.assert( Object.keys(foo).length === 1 && 'bar' in foo )
	})
})

describe('QGetterSetter2.defineSetter', function(){
	// define sample object
	var foo	= {
		bar	: 32
	}

	// setup the object
	QGetterSetter2.defineSetter(foo, 'bar', function(value){
		return value*2
	})
	QGetterSetter2.defineSetter(foo, 'bar', function(value){
		return value+1
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////

	it('is able to set without error', function(){
		foo.bar	= 32;
	})

	it('is able to get without error', function(){
		console.assert(foo.bar === 65)
	})

	it('should not define new enumerable properties', function(){
		console.assert( Object.keys(foo).length === 1 && 'bar' in foo )
	})
})
