var PropertyAttr2	= PropertyAttr2	|| require('../src/helpers/propertyattr2.js')


//////////////////////////////////////////////////////////////////////////////////
//		class								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * cat constructor
 */
var Cat	= function(name){
	// Animal.call( this );
	this.name	= name
	this._weight	= 2
}

Cat.prototype.getWheight= function(){
	return this._weight
}

//////////////////////////////////////////////////////////////////////////////////
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

var cat	= new Cat('kitty')

console.assert(cat instanceof Cat)

PropertyAttr2(cat, 'name', {
	type	: String,
})

console.assert(cat.name === 'kitty')
cat.name	= 'john'

try{
	cat.name	= 99
	var failed	= true
}catch(e){}
console.assert(failed !== true, 'no exception thrown')

console.log('my name is', cat.name)


PropertyAttr2(cat, '_weight', {
	// type	: Number,
	private	: true,
	class	: Cat,
})
console.log('ddd')
console.log('my weight is', cat._weight)



