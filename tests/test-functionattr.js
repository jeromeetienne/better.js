var FunctionAttr	= FunctionAttr	|| require('../src/helpers/functionattr.js');
var Privatize		= Privatize	|| require('../src/privatize.js');


describe('FunctionAttr-StrongTyping', function(){
	
	//////////////////////////////////////////////////////////////////////////////////
	//		function to test						//
	//////////////////////////////////////////////////////////////////////////////////
	
	var cat	= FunctionAttr(function(name){
		return 3;
	}, {
		arguments	: [String],
		return		: Number,
	})
	
	/**
	 * fails all the time to get valid attributes
	 * 
	 */
	var catBadReturn	= FunctionAttr(function(name){
		return 'aString';
	}, {
		arguments	: [String],
		return		: Number,	// fails on .return
	})
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		test .arguments							//
	//////////////////////////////////////////////////////////////////////////////////
	
	it('should be ok if arguments are valid', function(){
		cat('kitty')
	})

	it('should fail if arguments are invalid', function(){
		try{	
			cat(3)
			var failed	= true
		}catch(e){};
		console.assert(failed !== true)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		test .return							//
	//////////////////////////////////////////////////////////////////////////////////
	
	it('should be ok if returned value is valid', function(){
		cat('kitty')
	})

	it('should fail if returned value is invalid', function(){
		try{	
			catBadReturn('kitty')
			var failed	= true
		}catch(e){};
		console.assert(failed !== true)
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
})


describe('FunctionAttr-Privatize', function(){
	
	//////////////////////////////////////////////////////////////////////////////////
	//		class to test privatize						//
	//////////////////////////////////////////////////////////////////////////////////
	
	var aClass1	= function aClass1_ctor(){
		this.john	= 'smith'
		this._bar	= 2

		Privatize.prepare(this)
		Privatize.privatize(this)

		this.catPrivate	= FunctionAttr(function(name){
			return name+this._bar;
		}, {
			private		: true,
			arguments	: [String],
			return		: String,			
		})
		this.catNotPrivate	= FunctionAttr(function(name){
			return name+this._bar;
		}, {
			private		: false,
			arguments	: [String],
			return		: String,			
		})
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		test .arguments							//
	//////////////////////////////////////////////////////////////////////////////////
	
	it('should be ok to call private value if declared as private', function(){
		var aInstance	= new aClass1()
		console.assert( aInstance.catPrivate('kitty') === 'kitty2' )
	})

	it('should fail to call private if NOT declared as private', function(){
		try{	
			var aInstance	= new aClass1()
			console.assert( aInstance.catNotPrivate('kitty') === 'kitty2' )
			var failed	= true
		}catch(e){};
		console.assert(failed !== true)
	})
})