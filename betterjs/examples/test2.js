var Bjs	= Bjs	|| require('../better.js')

var wrapCtor	= function(originalCtor, className){
	// check arguments type
	console.assert( originalCtor instanceof Function )
	// 
	className	= className	|| originalCtor.name
	var fn	= function SuperName(){
		// forward the call to original contructor
		originalCtor.apply(this, arguments);
console.log('bla', this.sampleProp)
			
	}
	// mechanism to get fn with the propername
	// - see https://github.com/jeromeetienne/creatorpattern.js
	var jsCode	= fn.toString().replace(/SuperName/g, className) 
	eval('fn = '+jsCode+';')
	// inherit from original prototype
	// - reference or copy with Object.Create()
	fn.prototype	= originalCtor.prototype
	return fn
}

var Foo	= function Foo(value){
	this.sampleProp	= value
}

Foo.prototype.add	= function(arg1, arg2){
	return arg1 + arg2;
}

Foo	= wrapCtor(Foo)

var foo	= new Foo('bar')

console.assert(foo instanceof Foo)
console.assert(foo.sampleProp === 'bar')
console.assert(foo.add(2, 3) === 5)

console.log(foo.sampleProp)

console.dir(foo)

