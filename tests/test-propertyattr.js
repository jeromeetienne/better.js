var PropertyAttr	= PropertyAttr	|| require('../src/helpers/propertyattr.js');

describe('PropertyAttr', function(){
	
	var foo		= {
		bar	: 2
	};

	PropertyAttr.define(foo, 'bar')
		.typeCheck([Number, 'nonan'])
		.trackUsage('mocha-foo.bar');

	it('works with positive .typecheck()', function(){
		foo.bar	= 2;
	});

	it('works with negative .typecheck()', function(){
		try{
			foo.bar	= NaN;
			var fail= true;
		}catch(e){}
		console.assert(!fail, 'this should never be seen')		
	});

	it('works with negative .typecheck()', function(){
		try{
			foo.bar	= 'aString';
			var fail= true;
		}catch(e){}
		console.assert(!fail, 'this should never be seen')		
	});

	it('trackUsage properly', function(){
		var tracker	= PropertyAttr.usageTracker;
		console.assert( tracker.klasses()['mocha-foo.bar'].counter === 1 );
	});
});