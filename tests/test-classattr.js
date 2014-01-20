var ClassAttr	= ClassAttr	|| require('../src/helpers/classattr.js');

describe('ClassAttr', function(){

	//////////////////////////////////////////////////////////////////////////////////
	//		normal class definition						//
	//////////////////////////////////////////////////////////////////////////////////
	
	var Animal	= function(){
	}

	Animal.prototype.isVegetal	= function(){
		return false;
	}

	var Cat	= function(name, weight){
		Animal.call( this );
		this.name	= name
		this._weight	= weight
	}

	Cat.prototype		= Object.create( Animal.prototype )
	Cat.prototype.salute	= function(){
		return 'miaou, i weight '+this._weight
	}
	Cat.prototype.getWeight	= function(){
		return this._weight
	}
	

	// classattr definition
	Cat	= ClassAttr(Cat, {
		arguments	: [String, Number],
		privatize	: true,
		// properties	: {
		// 	name	: String,
		// 	_weight	: Number	
		// }
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments							//
	//////////////////////////////////////////////////////////////////////////////////
	
	it('should be ok if arguments are valid', function(){
		var cat	= new Cat('kitty', 1)
	})

	it('should fail if arguments are invalid', function(){
		try{	
			var cat		= new Cat(3, 'bar')
			var failed	= true
		}catch(e){};
		console.assert(failed !== true)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		properties							//
	//////////////////////////////////////////////////////////////////////////////////
	
	// it('should be ok when property type are valid', function(){
	// 	var cat	= new Cat('kitty', 1)
	// 	cat.name= 'Super kitty'
	// })

	// it('should fail when property type are invalid', function(){
	// 	var cat	= new Cat('kitty', 1)
	// 	try{
	// 		cat.name	= 99
	// 		var failed	= true
	// 	}catch(e){};
	// 	console.assert(failed !== true)
	// })

	//////////////////////////////////////////////////////////////////////////////////
	//		privatize							//
	//////////////////////////////////////////////////////////////////////////////////
	
	it('should be ok when reading a public property', function(){
		var cat	= new Cat('kitty', 1)
		console.assert(cat.name === 'kitty')
	})

	it('should fail when reading a private property', function(){
		var cat	= new Cat('kitty', 1)
		try{	
			console.assert(cat._weight === 1)
			var failed	= true
		}catch(e){};
		console.assert(failed !== true)
	})
})