var jsDoced	= require('../build/jsdoced.js')

/**
 * add two values
 * @param {Number} value1 value one
 * @param {Number} value2 value two
 * @return {Number} the result
 */
var add	= jsDoced(function(value1, value2){
	return value1 + value2
})

// console.log('add(1,1)', add(1,1))

// console.log('add(1,\"foo\") is an error case. trying anyway ...')
// add(1, "foo")