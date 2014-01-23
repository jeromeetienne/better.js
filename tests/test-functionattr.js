var FunctionAttr	= FunctionAttr	|| require('../src/helpers/functionattr.js');

describe('FunctionAttr', function(){
	
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
})