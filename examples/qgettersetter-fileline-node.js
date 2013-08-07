#!/usr/bin/env node

// get the class
var QGetterSetter	= QGetterSetter	|| require('../src/qgettersetter.js')

require('./helpers/qgettersetter-fileline.js');

(function blabla(){
	// sanity check
	console.assert(__FILE__ === 'qgettersetter-fileline-node.js')
	console.assert(__LINE__ === 11)
	console.assert(__FUNCTION__ === 'blabla')
	// display output
	console.log('__FILE__=', __FILE__, '__LINE__=',__LINE__, '__FUNCTION__=', __FUNCTION__)	
})();
