var assertWhichStop	= assertWhichStop	|| require('../src/assertwhichstop.js');

describe('assertWhichStop()', function(){

	it('should not stop on true', function(){
		assertWhichStop(true, 'this should NEVER be displayed')
	});

	it('should stop on false', function(){
		var thrown	= false;
		try{	
			assertWhichStop(false)
		}catch(e){ 
			thrown	= true;
		};
		console.assert(thrown, "No exception triggered!!");
	});
});