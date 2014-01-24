var ClassAttr	= ClassAttr	|| require('../src/helpers/classattr.js')

/**
 * cat constructor
 */
var Cat	= function(name, weight){
	this._name	= name
	this.weight	= weight || 0
}

Cat.prototype.getName	= function(){
	return this._name
}



//////////////////////////////////////////////////////////////////////////////////
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

Cat	= ClassAttr(Cat, {
	arguments	: [String],
	privatize	: true,
	properties	: {
		name	: String,		
	},
	onAfter		: function(instance, args){
		console.log('onAfter')
	}
})

var cat	= new Cat('kitty')

console.assert(cat instanceof Cat)
console.assert(cat instanceof Animal)
console.assert(typeof(cat.name) === 'string')

// cat.name	= 99
console.log('name', cat.name)

// cat.prout	= 99

console.log('salute', cat.salute())
