var jsDoced	= require('../../../build/jsdoced.js')

/**
 * add two values
 * @param {Number} value1 value one
 * @param {Number} value2 value two
 * @return {Number} the result
 */
var add	= jsDoced(function(value1, value2){
	return value1 + value2
})