//////////////////////////////////////////////////////////////////////////////////
//		Implement queuable getter setter				//
//////////////////////////////////////////////////////////////////////////////////

/**
 * by default __defineGetter__ support only one function. Same for __defineSetter
 * This is a annoying limitation. This little library declares 2 functions
 * Object.__defineQGetter__ and Object.__defineQGetter__.
 * They behave the same as their native sibling but support multiple functions.
 * Those functions are called in the same order they got registered.
 * 
 * (I have no idea of the reasoning behind this limitation to one function. It seems
 *  useless to me. This remind me of onclick of the DOM instead of a proper .addEventListener) 
*/


/**
 * Class to implement queueable getter/setter
 * @param  {Object} baseObject The base object on which we operate
 * @param  {String} property   The string of property
 */
var QGetterSetter	= {};

QGetterSetter.Property	= function(baseObject, property){
	// sanity check 
	console.assert( typeof(baseObject) === 'object' );
	console.assert( typeof(property) === 'string' );
	// backup the initial value
	var initialValue= baseObject[property];
	// init some local variables
	var _this	= this;
	this._getters	= [];
	this._setters	= [];
	// define the root getter
	baseObject.__defineGetter__(property, function getterHandler(){
		var value	= baseObject['__'+property];
		for(var i = 0; i < _this._getters.length; i++){
			value	= _this._getters[i](value, getterHandler.caller, property)
		}
		return value;
	});
	// define the root setter		
	baseObject.__defineSetter__(property, function(value){
		for(var i = 0; i < _this._setters.length; i++){
			value	= _this._setters[i](value)
		}
		baseObject['__'+property] = value;
	});
	// set the initialValue
	baseObject['__'+property]	= initialValue;
};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= QGetterSetter;

QGetterSetter.defineGetter	= function(baseObject, property, getterFn){
	var name	= "__dbgGetSet_" + property;
	// init QGetterSetter for this property if needed
	baseObject[name]= baseObject[name] || new QGetterSetter.Property(baseObject, property);
	// setup the new getter
	baseObject[name]._getters.push(getterFn)
}

QGetterSetter.defineSetter	= function(baseObject, property, setterFn){
	var name	= "__dbgGetSet_" + property;
	// init QGetterSetter for this property if needed
	baseObject[name]= baseObject[name] || new QGetterSetter.Property(baseObject, property);
	// setup the new setter
	baseObject[name]._setters.push(setterFn)
}

//////////////////////////////////////////////////////////////////////////////////
// Override prototype of global ```Object```
Object.prototype.__defineQGetter__	= function(property, getterFn){
	QGetterSetter.defineGetter(this, property, getterFn);
};
Object.prototype.__defineQSetter__	= function(property, setterFn){
	QGetterSetter.defineSetter(this, property, setterFn);
};

