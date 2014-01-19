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
		this._name	= name
		this._weight	= weight
	}
	// classattr definition
	Cat	= ClassAttr(Cat, {
		arguments	: [String],
		privatize	: true,
		properties	: {
			_name	: String,
			_weight	: Number	
		},
		onAfter		: function(instance, args){
			console.log('onAfter')
		}
	})

	Cat.prototype		= Object.create( Animal.prototype )
	Cat.prototype.salute	= function(){
		return 'miaou'
	}
	


	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	it('works ok', function(){
		// console.assert(false)
	})

})