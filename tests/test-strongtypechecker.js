var StrongTypeChecker	= StrongTypeChecker	|| require('../src/strongtypechecker.js');


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTypeChecker.checkValueType', function(){

	it('is valid with Number', function(){
		var value	= 99;
		var types	= [Number,];
		var valid	= StrongTypeChecker.checkValueType(value, types)
		console.assert( valid === true )

		var value	= 99;
		var types	= [String,];
		var valid	= StrongTypeChecker.checkValueType(value, types)
		console.assert( valid === false )
		// console.log('valid', valid)
		// console.log('value', value, valid ? 'is' : 'isnt', 'of types', types)
	});

	it('is valid with String', function(){
		var value	= 'aString';
		var types	= [String,];
		var valid	= StrongTypeChecker.checkValueType(value, types)
		console.assert( valid === true )

		var value	= 'aString';
		var types	= [Number,];
		var valid	= StrongTypeChecker.checkValueType(value, types)
		console.assert( valid === false )
	});

	it('is valid with multiple types', function(){
		var value	= 'aString';
		var types	= [String,Number];
		var valid	= StrongTypeChecker.checkValueType(value, types)
		console.assert( valid === true )

		var value	= 99;
		var types	= [String,Number];
		var valid	= StrongTypeChecker.checkValueType(value, types)
		console.assert( valid === true )
	});

	it('is valid with {} as Object', function(){
		var value	= {};
		var types	= [String,Number];
		var valid	= StrongTypeChecker.checkValueType(value, types)
		console.assert( valid === false )

		var value	= {};
		var types	= [Object];
		var valid	= StrongTypeChecker.checkValueType(value, types)
		console.assert( valid === true )
	});
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTypeChecker.checkFunctionTypes', function(){
	// define the original function
	var fct		= function(aString, aNumber){
		return aString + aNumber;
	}
	// setup checkFunctionTypes
	fct	= StrongTypeChecker.checkFunctionTypes(fct, [[String, Number], Number], String);

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

describe('StrongTypeChecker.checkSetterType', function(){
	var foo		= {
		x	: 3
	};
	StrongTypeChecker.checkSetterType(foo, 'x', Number);

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
