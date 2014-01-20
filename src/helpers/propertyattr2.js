/**
 * @fileOverview definition of PropertyAttr - based on other core libraries
 */

var TypeCheck2		= TypeCheck2	|| require('../typecheck2.js');
var PrivateForJS	= PrivateForJS	|| require('../privateforjs.js');

/**
 * [PropertyAttr2 description]
 * 
 * @param {Object} baseObject the base object
 * @param {String} property   the property name
 * @param {Object} attributes the attributes for this property
 */
var PropertyAttr2	= function(baseObject, property, attributes){
	// honor .type	
	if( attributes.type ){
		var allowedType	= attributes.type
		TypeCheck2.setter(baseObject, property, allowedType)
	}

	// honor .private (.class MUST be set)	
	// if( attributes.private ){
	// 	// TODO could it be baseObject.constructor ?
	// 	console.assert(typeof(attributes.class) === 'function', '.class MUST be set')
	// 	PrivateForJS.privateProperty(attributes.class, baseObject, property)	
	// }
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PropertyAttr2;


