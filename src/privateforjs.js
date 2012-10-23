/**
 * @namespace Strong typing for javascript
 * 
 * ### Possible API
 * - PrivateForJS.privateProperty();
 * - PrivateForJS.privateMethod();
 * - PrivateForJS.privatize();
 */
var PrivateForJS	= {};

var Stacktrace		= Stacktrace	|| require('.//stacktrace.js');
var QGetterSetter	= QGetterSetter	|| require('./qgettersetter.js')


// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= PrivateForJS;

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////


/**
 * extract local methods - they are the ones allowed to access private field 
 * 
 * @param  {Function} klass the class constructor
 */
PrivateForJS._extractLocalMethods	= function(klass){
	var privateOkFns= [];
	var protoNames	= Object.keys(klass.prototype);
	for(var i = 0; i < protoNames.length; i++){
		var protoName	= protoNames[i];
		var fn		= klass.prototype[protoName];
		if( typeof(fn) !== 'function' )	continue;
		privateOkFns.push(fn);
	}
	return privateOkFns;
};


/**
 * define a private property on a given instance of a object class
 * @param  {Function} klass	the class of the intenciated object
 * @param  {Object} baseObject	the object instance
 * @param  {String} property	the property name
 * @return {undefined}		nothing
 */
PrivateForJS.privateProperty	= function(klass, baseObject, property){
	QGetterSetter.defineGetter(baseObject, property, function aFunction(value, caller, property){
		// generate privateOkFns if needed - functions which can access private properties
		if( klass._PrivateForJS_OkFns === undefined ){
			klass._PrivateForJS_OkFns	= PrivateForJS._extractLocalMethods(klass);
		}
		// check if caller is privateOk
		var privateOkFns= klass._PrivateForJS_OkFns;
		var isPrivateOk	= privateOkFns.indexOf(caller) !== -1;
		if( isPrivateOk )	return value;
		// get stackFrame and originId of the user
		var stackFrame	= Stacktrace.parse()[2];
		var originId	= stackFrame.fct + '@' + stackFrame.url + ':' + stackFrame.line;
		// log the event
		console.assert(false, 'access to private property', "'"+property+"'", 'from', originId);
		// actually return the value
		return value;
	});
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Privatize 
 * @param  {[type]} klass      [description]
 * @param  {[type]} baseObject [description]
 * @return {[type]}            [description]
 */
PrivateForJS.privatize	= function(klass, baseObject){
	console.assert( baseObject.constructor == klass );
	for(var property in baseObject){
		var value	= baseObject[property]
		if( property[0] !== '_' )		continue;
		if(!baseObject.hasOwnProperty(property))continue;		
		console.log('privatisation of', property)
		PrivateForJS.privateProperty(klass, baseObject, property);
	}
}


