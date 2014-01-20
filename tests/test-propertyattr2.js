var PropertyAttr2	= PropertyAttr2	|| require('../src/helpers/propertyattr2.js');

describe('PropertyAttr2', function(){
	
	//////////////////////////////////////////////////////////////////////////////////
	//		class to test							//
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
	// instanciate the class
	var cat	= new Cat('kitty')
	PropertyAttr2(cat, 'name', {
		type	: String,
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		test .type							//
	//////////////////////////////////////////////////////////////////////////////////
	
	it('should be ok if .type are valid', function(){
		cat.name	= 'john'
	})

	it('should fail if .type is invalid when setted *after* declaration', function(){
		try{	
			cat.name	= 3
			var failed	= true
		}catch(e){};
		console.assert(failed !== true)
	})

	it('should fail if .type is invalid when setted *before* declaration', function(){
		try{
			var cat	= new Cat('kitty')
			PropertyAttr2(cat, 'name', {
				type	: Number,
			})
			var failed	= true
		}catch(e){};
		console.assert(failed !== true)
	})

	
})