var StrongTypeChecker	= StrongTypeChecker	|| require('../strongtypechecker.js');

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
