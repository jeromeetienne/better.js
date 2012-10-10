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
(function(){
	/**
	 * Class to implement queueable getter/setter
	 * @param  {Object} baseObject The base object on which we operate
	 * @param  {String} property   The string of property
	 */
	var _QueueableGetterSetter	= function(baseObject, property){
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
		baseObject.__defineGetter__(property, function(){
			var value	= baseObject['__'+property];
			for(var i = 0; i < _this._getters.length; i++){
				value	= _this._getters[i](value)
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
	
	//////////////////////////////////////////////////////////////////////////////////
	// Override prototype of global ```Object```
	Object.prototype.__defineQGetter__	= function(property, getterFn){
		var name	= "__dbgGetSet_" + property;
		// init _QueueableGetterSetter for this property if needed
		this[name]	= this[name] || new _QueueableGetterSetter(this, property);
		// setup the new getter
		this[name]._getters.push(getterFn)
	};
	
	Object.prototype.__defineQSetter__	= function(property, setterFn){
		var name	= "__dbgGetSet_" + property;
		// init _QueueableGetterSetter for this property if needed
		this[name]	= this[name] || new _QueueableGetterSetter(this, property);
		// setup the new setter
		this[name]._setters.push(setterFn)
	};
})();

