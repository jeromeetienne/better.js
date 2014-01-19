var Bjs	= Bjs	|| require('../better.js')


console.log('line', Bjs.__LINE__, Bjs.__FILE__, Bjs.__FUNCTION__)

;(function blabla(){
	// sanity check
	console.assert(Bjs.__FILE__ === 'line-file-function.js')
	console.assert(Bjs.__LINE__ === 9)
	console.assert(Bjs.__FUNCTION__ === 'blabla')
	// display output
	console.log('__FILE__=', Bjs.__FILE__, '__LINE__=', Bjs.__LINE__, '__FUNCTION__=', Bjs.__FUNCTION__)
})();

