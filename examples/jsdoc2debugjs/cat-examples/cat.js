// var FunctionAttr= FunctionAttr	|| require('../../../src/functionattr.js')
// var PropertyAttr= PropertyAttr	|| require('../../../src/propertyattr.js')

/**
 * fake class for car
 * 
 * @constructor
 * @param  {String}	name the name of the cat
 */
var Cat = function(name){
	console.log('in constructor');

	this.name	= name;

	PropertyAttr.define(this, "name").typeCheck([String]);
}

/**
 * species of the cat
 * @type {String}
 */
Cat.species	= 'angora';

// snippet to include debug.js if it exists
// ;(function(){
// 	var filename	= require('path').basename(__filename, '.js')+'.debug.js'
// 	if( require('fs').existsSync(filename) === true ){
// 		var content	= require('fs').readFileSync(filename, 'utf8')
// 		eval(content);
// 	}
// })();

// to import the debug.js module if present
// require('debug.js').import(__filename)
// - what about the eval ?


module.exports = Cat;
