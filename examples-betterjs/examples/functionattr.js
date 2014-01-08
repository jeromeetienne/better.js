var Bjs	= Bjs	|| require('../better.js')


function add(arg1, arg2){
	return arg1 + arg2
}

add	= Bjs.fn(add)
	.typeCheck([Number, Number], [Number])
	.done()

console.log('add', add(2,5))
