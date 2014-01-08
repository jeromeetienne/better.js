var Bjs	= Bjs	|| require('../better.js')

;(function(){
	// needed to trigger an exception in .iceWrite()
	"use strict";

	var foo	= {
		bar	: 'slota'
	}

	foo	= Bjs.iceWrite(foo)

	// console.log('unknown property', foo.bla)

	foo.bar	= 'bip'

	// foo.bla	= 'bop'

	console.log(foo)
})()



	