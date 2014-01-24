var Bjs	= Bjs	|| require('../build/better.js')


//////////////////////////////////////////////////////////////////////////////////
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

var Cat	= function(name, weight){
	this.name	= name
	this._weight	= weight || 0
}

Cat.prototype.getWeight	= function(){
	return this._weight
}

//////////////////////////////////////////////////////////////////////////////////
//		Make a Better.js for Cat					//
//////////////////////////////////////////////////////////////////////////////////

Cat	= Bjs.Class(Cat, {
	arguments	: [String, [Number, undefined]],
	privatize	: true,
	properties	: {
		name	: String,
		_weight	: Number,
	},
})



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
