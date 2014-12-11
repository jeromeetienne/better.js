// Get Better.js
var Better	= Better	|| require('../build/better.js')

// create a javascript object cat, which contains a string property 'name'
var cat         = {
        name    : 'kitty'
} 

// Make a better.js for cat.name property
Better.Property(cat, 'name', {
	type	: String,
})

// check value is actually the expected
console.assert(cat.name === 'kitty')

// set a new value, a valid value 
cat.name	= 'john'

// set a new value but invalid value
try{
	cat.name	= 99
	var failed	= true
}catch(e){}
console.assert(failed !== true, 'no exception thrown')

// report the end of the test
console.log('If you dont see any error, all is ok.')
