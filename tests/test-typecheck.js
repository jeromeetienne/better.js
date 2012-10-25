var TypeCheck	= TypeCheck	|| require('../src/typecheck.js');


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('TypeCheck.value', function(){

	it('is valid with Number', function(){
		var value	= 99;
		var types	= [Number,];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= 99;
		var types	= [String,];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === false )
		// console.log('valid', valid)
		// console.log('value', value, valid ? 'is' : 'isnt', 'of types', types)
	});

	it('is valid with NaN', function(){
		var value	= NaN;
		var types	= [Number];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= NaN;
		var types	= [Number, 'noNaN'];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === false )

		var value	= 99;
		var types	= [Number, 'noNaN'];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= NaN;
		var types	= ['noNaN'];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === false )
	});
	
	it('is valid with String', function(){
		var value	= 'aString';
		var types	= [String,];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= 'aString';
		var types	= [Number,];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === false )
	});

	it('is valid with multiple types', function(){
		var value	= 'aString';
		var types	= [String,Number];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === true )

		var value	= 99;
		var types	= [String,Number];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === true )
	});

	it('is valid with {} as Object', function(){
		var value	= {};
		var types	= [String,Number];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === false )

		var value	= {};
		var types	= [Object];
		var valid	= TypeCheck.value(value, types)
		console.assert( valid === true )
	});
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('TypeCheck.fn', function(){
	// define the original function
	var fct		= function(aString, aNumber){
		return aString + aNumber;
	}
	// setup fn
	fct	= TypeCheck.fn(fct, [[String, Number], Number], String);

	it('doesnt exception if function types match', function(){
		var result	= fct('bla', 99)
		console.assert(result === 'bla99');
	});

	it('does exception if one parameter types doesnt match', function(){
		try{	
			fct('bla', 'prout')
			console.assert(false, "No exception triggered!!");
		}catch(e){};
	});

	it('does exception if return type§ doesnt match', function(){
		try{	
			fct(10, 20)
			console.assert(false, "No exception triggered!!");
		}catch(e){};
	});

	it('does exception if function got more parameters than allowed', function(){
		try{	
			fct('bla', 99, 98)
			console.assert(false, "No exception triggered!!");
		}catch(e){};
	});

	it('does exception if function less parameters than allowed', function(){
		try{	
			fct('bla')
			console.assert(false, "No exception triggered!!");
		}catch(e){ };
	});
	

});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('TypeCheck.setter', function(){
	var foo		= {
		x	: 3
	};
	TypeCheck.setter(foo, 'x', [Number, 'noNaN']);

	it('check accuratly the type thru a setter', function(){
		foo.x	= 4;		
	});
	
	it('fails when using an invalid type', function(){
		try{
			foo.x	= 'aString';		
			console.assert(false, "No exception triggered!!");
		}catch(e){};
	});
});

describe('TypeCheck.Validator', function(){
	it('check accuratly NaN positive test', function(){
		var value	= 99;
		var types	= [Number, 'noNaN'];
		var valid	= TypeCheck.value(value, types);
		console.assert( valid === true )
	});

	it('check accuratly NaN negative test', function(){
		var value	= NaN;
		var types	= [Number, 'noNaN'];
		var valid	= TypeCheck.value(value, types);
		console.assert( valid === false )
	});

	it('check accuratly with BoundChecking positive', function(){
		var value	= 99;
		var types	= [Number, TypeCheck.Validator(function(value){
			return value < 100;
		})];
		var valid	= TypeCheck.value(value, types);
		console.assert( valid === true )
	});

	it('check accuratly with BoundChecking negative', function(){
		var value	= 101;
		var types	= [Number, TypeCheck.Validator(function(value){
			return value < 100;
		})];
		var valid	= TypeCheck.value(value, types);
		console.assert( valid === false )
	});
});
