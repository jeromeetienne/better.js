describe('debug.noNaN()', function(){
	var foo	= {
		bar	: 32
	};
	
	it('is able to get without error', function(){
		console.assert( foo.bar === 32 );
	});
	it('is able to set without error', function(){
		foo.bar	= 32;
	});
	it('trigger error on setting NaN', function(){
		foo.bar	= NaN;
	});
});
