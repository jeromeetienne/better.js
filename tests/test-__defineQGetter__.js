describe('Queuable Getter Setter', function(){
	var foo	= {
		bar	: 32
	};
	
	foo.__defineQGetter__('bar', function(value){
		return value*2;
	});

	it('is able to get without error', function(){
		console.assert( foo.bar === 64 );
	});
});
