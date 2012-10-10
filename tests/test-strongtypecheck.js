var StrongTypeCheck	= StrongTypeCheck	|| require('../src/strongtypecheck.js');


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTypeCheck.value', function(){

	it('is valid with Number', function(){
		var value	= 99;
		var types	= [Number,];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= 99;
		var types	= [String,];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === false )
		// console.log('valid', valid)
		// console.log('value', value, valid ? 'is' : 'isnt', 'of types', types)
	});

	it('is valid with NaN', function(){
		var value	= NaN;
		var types	= [Number];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= NaN;
		var types	= [Number, 'noNaN'];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === false )

		var value	= 99;
		var types	= [Number, 'noNaN'];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= NaN;
		var types	= ['noNaN'];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === false )
	});
	
	it('is valid with String', function(){
		var value	= 'aString';
		var types	= [String,];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= 'aString';
		var types	= [Number,];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === false )
	});

	it('is valid with multiple types', function(){
		var value	= 'aString';
		var types	= [String,Number];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= 99;
		var types	= [String,Number];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === true )
	});

	it('is valid with {} as Object', function(){
		var value	= {};
		var types	= [String,Number];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === false )

		var value	= {};
		var types	= [Object];
		var valid	= StrongTypeCheck.value(value, types)
		console.assert( valid === true )
	});
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTypeCheck.fn', function(){
	// define the original function
	var fct		= function(aString, aNumber){
		return aString + aNumber;
	}
	// setup fn
	fct	= StrongTypeCheck.fn(fct, [[String, Number], Number], String);

	it('doesnt exception if function types match', function(){
		var result	= fct('bla', 99)
		console.assert(result === 'bla99');
	});

	it('does exception if one parameter types doesnt match', function(){
		var thrown	= false;
		try{	
			fct('bla', 'prout')
		}catch(e){ 
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});

	it('does exception if return type§ doesnt match', function(){
		var thrown	= false;
		try{	
			fct(10, 20)
		}catch(e){ 
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});

	it('does exception if function got more parameters than allowed', function(){
		var thrown	= false;
		try{	
			fct('bla', 99, 98)
		}catch(e){ 
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});

	it('does exception if function less parameters than allowed', function(){
		var thrown	= false;
		try{	
			fct('bla')
		}catch(e){ 
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});
	

});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTypeCheck.setter', function(){
	var foo		= {
		x	: 3
	};
	StrongTypeCheck.setter(foo, 'x', [Number, 'noNaN']);

	it('check accuratly the type thru a setter', function(){
		foo.x	= 4;		
	});
	
	it('fails when using an invalid type', function(){
		var thrown	= false;
		try{	
			foo.x	= 'aString';		
		}catch(e){ 
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});
});
