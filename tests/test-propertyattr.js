var PropertyAttr	= PropertyAttr	|| require('../src/propertyattr.js');

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
		foo.bar	= NaN;
	});

	it('works with negative .typecheck()', function(){
		foo.bar	= 'aString';
	});

	it('trackUsage properly', function(){
		var tracker	= PropertyAttr.usageTracker;
		console.assert( tracker.klasses()['mocha-foo.bar'].counter === 3 );
	});
});