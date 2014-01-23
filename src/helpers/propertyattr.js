/**
 * @fileOverview definition of PropertyAttr - based on other core libraries
 */

var TypeCheck2		= TypeCheck2	|| require('../typecheck2.js');
var PrivateForJS3	= PrivateForJS3	|| require('../privateforjs3.js');

/**
 * [PropertyAttr description]
 * 
 * @param {Object} baseObject the base object
 * @param {String} property   the property name
 * @param {Object} attributes the attributes for this property
 */
var PropertyAttr	= function(baseObject, property, attributes){
	// honor .type	
	if( attributes.type ){
		var allowedType	= attributes.type
		TypeCheck2.setter(baseObject, property, allowedType)
	}

	// honor .private
	if( attributes.private ){
		PrivateForJS3.privateProperty(baseObject, property)	
	}
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PropertyAttr;


