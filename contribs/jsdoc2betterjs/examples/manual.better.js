var Better	= Better	|| require('../../../build/better.js')

/**
 * @param  {!Number} aNumber - the string measure
 */
var displayNumber	= Better.Function(function(aNumber){
	console.log(aNumber)
}, {
        arguments: [["nonull","any"]]
})

displayNumber(3)
// console.log()