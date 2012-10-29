var FunctionAttr	= FunctionAttr	|| require('../src/functionattr.js');

describe('FunctionAttr', function(){

	function foo(){
		return 'bar';
	};
	
	it('notify the before() function', function(){
		var mark= false;
		// declare function attributes
		foo	= FunctionAttr.define(foo).before(function(){
			mark	= true;
		}).done();
		// call the function		
		foo();
		// check the result is the one expected
		console.assert( mark, 'before() function isnt called' )
	});
	
	
	it('notify the after() function', function(){
		var mark= false;
		// declare function attributes
		foo	= FunctionAttr.define(foo).after(function(){
			mark	= true;
		}).done();
		// call the function		
		foo();
		// check the result is the one expected
		console.assert( mark, 'after() function isnt called' )
	});


	it('notify the before(), original fn and after() in the proper order', function(){
		var state	= 'init';
		// declare the original function
		var foo		= function(){
			console.assert(state === 'postbefore' )
			state	= 'postOriginalFn';
		}
		// declare function attributes
		foo	= FunctionAttr.define(foo).before(function(){
			console.assert(state === 'init')
			state	= 'postbefore';	
		}).after(function(){
			console.assert(state === 'postOriginalFn')
			state	= 'postAfter';	
		}).done();

		// call the function		
		foo();
		// check the result is the one expected
		console.assert( state === 'postAfter', 'before(), after() not in the good order' )
	});	
});

