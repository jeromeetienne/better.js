var ClassAttr	= ClassAttr	|| require('../src/helpers/classattr.js')

ClassAttr.overloadFunctionPrototype()

//////////////////////////////////////////////////////////////////////////////////
//		parent class								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * animal ctos
 */
var Animal	= function(){
}

Animal.prototype.isVegetal	= function(){
	return false;
}

/**
 * cat constructor
 */
var Cat	= function(name){
	// Animal.call( this );
	this.name	= name
	this._yo	= 99
}

Cat.prototype = Object.create( Animal.prototype );

Cat.prototype.salute	= function(){
	return 'miaou'+this._yo
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
