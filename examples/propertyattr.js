var PropertyAttr	= function(baseObject, property){
	this._baseObject= baseObject;
	this._property	= property; 
}

PropertyAttr.define	= function(baseObject, property){
	return new PropertyAttr(baseObject, property);
};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PropertyAttr;

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

var TypeCheck	= TypeCheck	|| require('../src/typecheck.js')

PropertyAttr.prototype.typeCheck	= function(allowedTypes){
	TypeCheck.setter(this._baseObject, this._property, allowedTypes);
}

