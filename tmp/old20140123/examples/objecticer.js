var ObjectIcer	= ObjectIcer	|| require('../src/objecticer.js');

var foo	= {
	bar0	: undefined
}

foo	= ObjectIcer(foo)

console.log('bar', foo.bar)
// foo.bar	= 'bli'
// console.log('bar', foo.bar)
