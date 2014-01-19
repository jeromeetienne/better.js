global.Bjs	= require('../better.js')

var foo		= {
	bar	: 2
};

Bjs.property(foo, 'bar')
	.type('noNaN', Number)
	.track()

foo.bar	= 3;

console.log('value', foo.bar)
try {
	foo.bar	= 'bla';
}catch(e){
	console.log('tried to write a string and got interrupted')
}
console.log('value', foo.bar)

console.log('PropertyAttr.usageTracker')
Bjs.PropertyAttr.usageTracker.dump();

//////////////////////////////////////////////////////////////////////////////////
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

var bar	= {
	foo	: 42,
	bar	: 'slota'
}

Bjs.propertiesType(bar, {
	foo	: Number,
	bar	: String,
})