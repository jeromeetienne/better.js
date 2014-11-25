var Better	= require('../../../build/better.js')

// kludgy way to include js code with node.js
eval(require('fs').readFileSync('../js/extractJsdoc.js', 'utf8'))

/**
 * add two values
 * @param {Number} value1 value one
 * @param {Number} value2 value two
 * @return {Number} the result
 */
var jsdocContent	= jsDoced.extractJsdoc(Better.__FILE__, Better.__LINE__)

console.log('jsdocContent')
console.log(jsdocContent)

