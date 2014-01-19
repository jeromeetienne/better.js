var assertWhichStop	= assertWhichStop	|| require('../src/assertwhichstop.js');

describe('assertWhichStop()', function(){

	it('should not stop on true', function(){
		assertWhichStop(true, 'this should NEVER be displayed')
	});

	it('should stop on false', function(){
		try{	
			assertWhichStop(false)
			var failed	= true
		}catch(e){};
		console.assert(failed !== true, "No exception triggered!!");
	});
});