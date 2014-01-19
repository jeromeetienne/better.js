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
	// classattr definition
	Cat	= ClassAttr(Cat, {
		arguments	: [String, Number],
		// privatize	: true,
		properties	: {
			name	: String,
			_weight	: Number	
		}
	})

	Cat.prototype		= Object.create( Animal.prototype )
	Cat.prototype.salute	= function(){
		return 'miaou'
	}
	


	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
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

	it('should be ok when property type are valid', function(){
		var cat	= new Cat('kitty', 1)
		cat.name= 'Super kitty'
	})

	it('should fail when property type are invalid', function(){
		var cat	= new Cat('kitty', 1)
		try{	
			cat.name	= 99
			var failed	= true
		}catch(e){};
		console.assert(failed !== true)
	})
})