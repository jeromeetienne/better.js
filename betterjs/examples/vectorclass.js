var Bjs	= Bjs	|| require('../better.js')

Bjs.overloadFunctionAttr()

//////////////////////////////////////////////////////////////////////////////////
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

var Vector	= function(x, y){
	this.x	= x
	this.y	= y
	
	Bjs.propertiesType(this, {
		x	: [Number, 'nonan'],
		y	: [Number, 'nonan'],
	})
}

/*
Vector	= Bjs.ctor(Vector, {
	accept		: [Number, Number],
	privatize	: true,	// assume any name starting with _ is private
	properties	: {
		x	: [Number, 'nonan'],
		y	: [Number, 'nonan'],	
	}
})
*/
Vector	= Bjs.fn(Vector)
		.typeCheck([Number, Number], [undefined])
		// .propertiesType({
		// 	x	: [Number, 'nonan'],
		// 	y	: [Number, 'nonan'],	
		// })
		// .privatize()
		.after(function(){
			console.log('after ctor', arguments)
		})
		.done()

Vector.prototype.add = function(other) {
	this.x	+= other.x
	this.y	+= other.y
	return this
}
.Bjs().typeCheck([Vector], [undefined]).done()

//////////////////////////////////////////////////////////////////////////////////
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

var v1	= new Vector(0,0)
// console.log('check instance', v1 instanceof Vector)
var v2	= new Vector(1,2)
// console.log('check instance', v2 instanceof Vector)
v1.add(v2)
console.log(v1)

// v1.x	= NaN
// console.log(v1)
