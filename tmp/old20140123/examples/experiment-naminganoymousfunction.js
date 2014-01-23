var Stacktrace	= Stacktrace	|| require('../src/stacktrace')

var foo	= {
	bar : function(){
		console.log('foobar', Stacktrace.parse()[0]);
	}
};

function nameAnonymousFunction(fn, name){
	// sanity check 
	console.assert(fn.name === '', 'this function isnt anonymous');
	// set the name in a string
	var str = fn.toString().replace(/^function.*\(/, 'function '+name+' (');
	// eval the string to return it
	eval('var namedFn = '+str);
	// returned the namedFn
	return namedFn;
}

foo.bar	= nameAnonymousFunction(foo.bar, 'foo_bar')

foo.bar();
