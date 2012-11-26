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

/**
 * Define a getter/setter for a property
 * @param {Object} baseObject the base object which is used
 * @param {String} property   the name of the property
 */


QGetterSetter.Property	= function(baseObject, property){
	// sanity check 
	console.assert( typeof(baseObject) === 'object' );
	console.assert( typeof(property) === 'string' );
	// backup the initial value
	var originValue	= baseObject[property];
	// init some local variables
	var _this	= this;
	this._getters	= [];
	this._setters	= [];
	// define the root getter
	baseObject.__defineGetter__(property, function getterHandler(){
		var value	= baseObject['__'+property];
		for(var i = 0; i < _this._getters.length; i++){
			// TODO why those extra param are needed
			// - needed for privateforjs to identify the origin
			// - is that the proper format ?
			// - is that important for setter
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
	// set the originValue
	baseObject['__'+property]	= originValue;
};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= QGetterSetter;

/**
 * define a getter 
 * 
 * @param  {Obejct} baseObject the object containing the property
 * @param  {string} property   the property name which gonna get the getter
 * @param  {Function} getterFn   function which handle the getter
 */
QGetterSetter.defineGetter	= function(baseObject, property, getterFn){
	var name	= "__dbgGetSet_" + property;
	// init QGetterSetter for this property if needed
	baseObject[name]= baseObject[name] || new QGetterSetter.Property(baseObject, property);
	// setup the new getter
	baseObject[name]._getters.push(getterFn)
}

/**
 * define a setter 
 * 
 * @param  {Object} baseObject the object containing the property
 * @param  {string} property   the property name which gonna get the setter
 * @param  {Function} setterFn   function which handle the setter
 */
QGetterSetter.defineSetter	= function(baseObject, property, setterFn){
	var name	= "__dbgGetSet_" + property;
	// init QGetterSetter for this property if needed
	baseObject[name]= baseObject[name] || new QGetterSetter.Property(baseObject, property);
	// setup the new setter
	baseObject[name]._setters.push(setterFn)
}

//////////////////////////////////////////////////////////////////////////////////
//		.overloadObjectPrototype()					//
//////////////////////////////////////////////////////////////////////////////////

/**
 * overload the Object.prototype with .__defineQGetter__ and .__defineQSetter__
 * 
 * TODO put that in example/js ?
 */
QGetterSetter.overloadObjectPrototype	= function(){	
	Object.prototype.__defineQGetter__	= function(property, getterFn){
		QGetterSetter.defineGetter(this, property, getterFn);
	};
	Object.prototype.__defineQSetter__	= function(property, setterFn){
		QGetterSetter.defineSetter(this, property, setterFn);
	};
}
