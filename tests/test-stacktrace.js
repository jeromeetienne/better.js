var Stacktrace	= Stacktrace	|| require('../src/stacktrace.js');


describe('Stacktrace.parse()', function(){
	
	function getStack(){
		return Stacktrace.parse();
	}
	
	it('is able to get the function name of the stackframe', function(){
		var stackFrame	= getStack()[0];
		console.assert( stackFrame.fct === 'getStack' )
	});

	it('is able to get the line of the stackframe', function(){
		var stackFrame	= getStack()[0];
		console.assert( stackFrame.line === 7 )
	});
});

