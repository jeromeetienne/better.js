var assertWhichStop	= assertWhichStop	|| require('../src/assertwhichstop.js');

describe('assertWhichStop()', function(){

	it('should not stop on true', function(){
		assertWhichStop(true, 'this should NEVER be displayed')
	});

	it('should stop on false', function(){
		try{	
			assertWhichStop(false)
			console.assert(false, "No exception triggered!!");
		}catch(e){};
	});
});