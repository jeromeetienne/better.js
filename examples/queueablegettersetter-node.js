#!/usr/bin/env node

// get the class
require('../src/queueablegettersetter.js');

var foo		= {
	x	: 3
};

console.log('before new getter: foo.x ===', foo.x)

foo.__defineQGetter__('x', function(value){
	return value*2;
});

console.log('after new getter: foo.x ===', foo.x)



require('./js/linefilegettersetter.js');

(function blabla(){
	console.log('super', __FILE__, __LINE__, __FUNCTION__)	
})();
