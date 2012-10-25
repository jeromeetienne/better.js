var Stacktrace	= Stacktrace	|| require('../src/stacktrace')

var foo	= {
	bar : function(){
		console.log('foobar', Stacktrace.parse()[0]);
	}
};

//foo.bar = eval(foo.bar.toString().replace(/^function \(\){/, 'function bar(){'))
//foo.bar();

function nameAnonymousFunction(fn, name){
	// sanity check 
	console.assert(fn.name === '', 'this function isnt anonymous');

	// set the name in a string
	var str = fn.toString().replace(/^function.*\(/, 'function '+name+' (');
	// eval the string to return it
	eval('var tmp = '+str);
	return tmp;
}

foo.bar	= nameAnonymousFunction(foo.bar, 'foo_bar')

foo.bar();
