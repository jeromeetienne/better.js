var expect = require('chai').expect;
var StrongTyping	= StrongTyping	|| require('../src/strongtyping.js');

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTyping.value', function(){

	it('is valid with Number', function(){
		var value	= 99;
		var types	= [Number,];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === true )

		var value	= 99;
		var types	= [String,];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === false )
	});

	it('is valid with Boolean', function(){
		var value	= true;
		var types	= [Boolean,];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === true )

		var value	= 'aString';
		var types	= [Boolean,];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === false )
	});

	it('is valid with NaN', function(){
		var value	= NaN;
		var types	= [Number];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === true )

		var value	= NaN;
		var types	= [Number, 'noNaN'];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === false )

		var value	= 99;
		var types	= [Number, 'noNaN'];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === true )

		var value	= NaN;
		var types	= ['noNaN'];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === false )
	});
	
	it('is valid with String', function(){
		var value	= 'aString';
		var types	= [String,];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === true )

		var value	= 'aString';
		var types	= [Number,];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === false )
	});

	it('is valid with multiple types', function(){
		var value	= 'aString';
		var types	= [String,Number];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === true )

		var value	= 99;
		var types	= [String,Number];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === true )
	});

	it('is valid with {} as Object', function(){
		var value	= {};
		var types	= [String,Number];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === false )

		var value	= {};
		var types	= [Object];
		var valid	= StrongTyping.value(value, types)
		console.assert( valid === true )
	});
});

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTyping.typename', function(){

	it('returns the names of basic types', function(){
		expect( StrongTyping.typename(Number) ).to.equal( 'Number' )
		expect( StrongTyping.typename(String) ).to.equal( 'String' )
		expect( StrongTyping.typename(Boolean) ).to.equal( 'Boolean' )
		expect( StrongTyping.typename(Function) ).to.equal( 'Function' )
		expect( StrongTyping.typename(Object) ).to.equal( 'Object' )
		expect( StrongTyping.typename(Array) ).to.equal( 'Array' )
		expect( StrongTyping.typename(undefined) ).to.equal( 'undefined' )
		expect( StrongTyping.typename(null) ).to.equal( 'null' )
	});

	it('returns the names of functions', function(){
		function TestOne() {}
		function TestTwo() {}
		TestTwo.prototype.foo = function () {}

		expect( StrongTyping.typename(TestOne) ).to.equal( 'TestOne' )
		expect( StrongTyping.typename(TestTwo) ).to.equal( 'TestTwo' )
	});

	it('returns stringified version of unknown/invalid types', function(){
		expect( StrongTyping.typename(123) ).to.equal( '[object Number]' )
	});

	it('returns an array of names for an array of types', function(){
		var names = StrongTyping.typename([ Number, String, Array, null ])
		expect( names ).to.deep.equal([ 'Number', 'String', 'Array', 'null' ])
	});

});

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTyping.valuetypenames', function(){

	it('returns the names of basic types', function(){
		expect( StrongTyping.valuetypenames(0) ).to.deep.equal([ 'Number' ]);
		expect( StrongTyping.valuetypenames(123) ).to.deep.equal([ 'Number' ]);
		expect( StrongTyping.valuetypenames(NaN) ).to.deep.equal([ 'Number' ]);
		expect( StrongTyping.valuetypenames(-Infinity) ).to.deep.equal([ 'Number' ]);

		expect( StrongTyping.valuetypenames('') ).to.deep.equal([ 'String' ]);
		expect( StrongTyping.valuetypenames('hello') ).to.deep.equal([ 'String' ]);

		expect( StrongTyping.valuetypenames(false) ).to.deep.equal([ 'Boolean' ]);
		expect( StrongTyping.valuetypenames(true) ).to.deep.equal([ 'Boolean' ]);

		expect( StrongTyping.valuetypenames(function foo() {}) ).to.deep.equal([ 'Function' ]);

		expect( StrongTyping.valuetypenames([]) ).to.deep.equal([ 'Array' ]);
		expect( StrongTyping.valuetypenames([1, 2, 3]) ).to.deep.equal([ 'Array' ]);

		expect( StrongTyping.valuetypenames(null) ).to.deep.equal([ 'null' ]);
		expect( StrongTyping.valuetypenames(undefined) ).to.deep.equal([ 'undefined' ]);
	});

	it('returns the names of objects', function(){
		function TestOne() {}
		function TestTwo() {}
		TestTwo.prototype.foo = function () {}

		expect( StrongTyping.valuetypenames({}) ).to.deep.equal([ 'Object' ]);
		expect( StrongTyping.valuetypenames({ a:1, b:2 }) ).to.deep.equal([ 'Object' ]);

		expect( StrongTyping.valuetypenames(new TestOne()) ).to.deep.equal([ 'Object', 'TestOne' ]);
		expect( StrongTyping.valuetypenames(new TestTwo()) ).to.deep.equal([ 'Object', 'TestTwo' ]);
	});

});

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTyping.fn', function(){
	// define the original function
	var fct		= function(aString, aNumber){
		return aString + aNumber;
	}
	// setup fn
	fct	= StrongTyping.fn(fct, [[String, Number], Number], String);

	it('doesnt exception if function types match', function(){
		var result	= fct('bla', 99)
		console.assert(result === 'bla99');
	});

	it('does exception if one parameter types doesnt match', function(){
		try{	
			fct('bla', 'prout')
			var failed	= true
		}catch(e){};
		console.assert(failed !== true, "No exception triggered!!");
	});

	it('does exception if return type doesnt match', function(){
		try{	
			fct(10, 20)
			var failed	= true
		}catch(e){};
		console.assert(failed !== true, "No exception triggered!!");
	});

	it('does exception if function got more parameters than allowed', function(){
		try{	
			fct('bla', 99, 98)
			var failed	= true
		}catch(e){};
		console.assert(failed !== true, "No exception triggered!!");
	});

	it('does exception if function less parameters than allowed', function(){
		try{	
			fct('bla')
			var failed	= true
		}catch(e){};
		console.assert(failed !== true, "No exception triggered!!");
	});
	

});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTyping.setter', function(){
	var foo		= {
		x	: 3
	};
	StrongTyping.setter(foo, 'x', [Number, 'noNaN']);

	it('check accuratly the type thru a setter', function(){
		foo.x	= 4;		
	});
	
	it('fails when using an invalid type', function(){
		try{
			foo.x	= 'aString';		
			var failed	= true
		}catch(e){};
		console.assert(failed !== true, "No exception triggered!!");
	});
});

describe('StrongTyping.Validator', function(){
	it('check accuratly NaN positive test', function(){
		var value	= 99;
		var types	= [Number, 'noNaN'];
		var valid	= StrongTyping.value(value, types);
		console.assert( valid === true )
	});

	it('check accuratly NaN negative test', function(){
		var value	= NaN;
		var types	= [Number, 'noNaN'];
		var valid	= StrongTyping.value(value, types);
		console.assert( valid === false )
	});

	it('check accuratly with BoundChecking positive', function(){
		var value	= 99;
		var types	= [Number, StrongTyping.Validator(function(value){
			return value < 100;
		})];
		var valid	= StrongTyping.value(value, types);
		console.assert( valid === true )
	});

	it('check accuratly with BoundChecking negative', function(){
		var value	= 101;
		var types	= [Number, StrongTyping.Validator(function(value){
			return value < 100;
		})];
		var valid	= StrongTyping.value(value, types);
		console.assert( valid === false )
	});
});
