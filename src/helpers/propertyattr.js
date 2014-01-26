/**
 * @fileOverview definition of PropertyAttr - based on other core libraries
 */

var StrongTyping= StrongTyping	|| require('../strongtyping.js');
var Privatize	= Privatize	|| require('../privatize.js');

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
		StrongTyping.setter(baseObject, property, allowedType)
	}

	// honor .private
	if( attributes.private ){
		Privatize.property(baseObject, property)
	}
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PropertyAttr;


