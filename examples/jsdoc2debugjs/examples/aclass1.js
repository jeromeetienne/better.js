/**
 * Sample of class
 * 
 * @param  {String} 	aString   just a string
 * @param  {Function}	aFunction just a function
 * @return {Number} magic number
 */
var aClass1	= function(aString, aFunction){
	/**
	 * Great property
	 * 
	 * @memberOf aClass1
	 * @type {String}
	 */
	this._aProperty	= "super value";
}

/**
 * Sample of method
 * 
 * @deprecated not so good anymore
 * @param  {String} aString just a string
 * @return {Number} magic number
 */
aClass1.prototype._aMethod = function(aString) {
	return 42;
};