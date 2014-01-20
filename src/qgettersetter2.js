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
var QGetterSetter2	= {};

/**
 * Define a getter/setter for a property
 * 
 * @param {Object} baseObject the base object which is used
 * @param {String} property   the name of the property
 */
QGetterSetter2._Property	= function(baseObject, property){
	// sanity check 
	console.assert( typeof(baseObject) === 'object' || typeof(baseObject) === 'function' );
	console.assert( typeof(property) === 'string' );
	// backup the initial value
	var originValue	= baseObject[property];
	// init some local variables
	var _this	= this;
	this._getters	= [];
	this._setters	= [];
	// define the root getter
	// baseObject.__defineGetter__(property, function getterHandler(){
	// 	var value	= baseObject['__'+property];
	// 	for(var i = 0; i < _this._getters.length; i++){
	// 		// TODO why those extra param are needed
	// 		// - needed for privateforjs to identify the origin
	// 		// - is that the proper format ?
	// 		// - is that important for setter
	// 		value	= _this._getters[i](value, getterHandler.caller, property)
	// 	}
	// 	return value;
	// });

	// the storage value
	Object.defineProperty(baseObject, '__' + property, {
	        enumerable	: false,
	        writable	: true,
	        value		: baseObject[property],
	})
	// the accessed value
	Object.defineProperty(baseObject, property, {
	        enumerable	: true,
		get		: function getterHandler(){
			var value	= baseObject['__'+property];
			for(var i = 0; i < _this._getters.length; i++){
				value	= _this._getters[i](value, getterHandler.caller, property)
			}
			return value;
		},
		set		: function setterHandler(value){
			for(var i = 0; i < _this._setters.length; i++){
				value	= _this._setters[i](value)
			}
			baseObject['__'+property] = value;
		},
	})
};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= QGetterSetter2;

/**
 * init baseObject to be able to ahndle qGetterSetter
 * @param  {Object} baseObject the base object to modify
 * @param  {String} property   the property which is handled
 * @return {String}            the created property name
 */
QGetterSetter2._initObjectIfNeeded	= function(baseObject, property){
	var name	= "__bjsGetSet_" + property;
	// define the property to store all the getters/setter
	if( baseObject[name] === undefined ){
		Object.defineProperty(baseObject, name, {
		        enumerable	: false,
		        value		: new QGetterSetter2._Property(baseObject, property)
		});
	}
	return name
}

/**
 * define a getter 
 * 
 * @param  {Obejct} baseObject the object containing the property
 * @param  {string} property   the property name which gonna get the getter
 * @param  {Function} getterFn   function which handle the getter
 */
QGetterSetter2.defineGetter	= function(baseObject, property, getterFn){
	// init QGetterSetter2 on this property if needed
	var name	= QGetterSetter2._initObjectIfNeeded(baseObject, property)
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
QGetterSetter2.defineSetter	= function(baseObject, property, setterFn){
	// init QGetterSetter2 on this property if needed
	var name	= QGetterSetter2._initObjectIfNeeded(baseObject, property)
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
QGetterSetter2.overloadObjectPrototype	= function(){	
	Object.prototype.__defineQGetter__	= function(property, getterFn){
		QGetterSetter2.defineGetter(this, property, getterFn);
	};
	Object.prototype.__defineQSetter__	= function(property, setterFn){
		QGetterSetter2.defineSetter(this, property, setterFn);
	};
}
