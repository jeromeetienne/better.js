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


//////////////////////////////////////////////////////////////////////////////////
//		StrongTyping.valueTypeToString
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTyping.valueTypeToString', function(){		
	it('should detect numbers', function(){
		console.assert( StrongTyping.valueTypeToString(3) === 'Number' );
	});

	it('should detect strings', function(){
		console.assert( StrongTyping.valueTypeToString('foobar') === 'String' );
	});
});



//////////////////////////////////////////////////////////////////////////////////
//		StrongTyping.valueTypeToString
//////////////////////////////////////////////////////////////////////////////////

describe('StrongTyping.allowedTypesToString', function(){
		
	it('should detect numbers', function(){
		console.assert( StrongTyping.allowedTypesToString(Number) === 'Number' );
	});

	it('should detect strings', function(){
		console.assert( StrongTyping.allowedTypesToString(String) === 'String' );
	});

	it('should detect objects', function(){
		console.assert( StrongTyping.allowedTypesToString(Object) === 'Object' );
	});
});


