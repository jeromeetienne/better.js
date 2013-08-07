/**
 * Used to detect globals. works in node.js and browser
 * 
 * from http://stackoverflow.com/questions/5088203/how-to-detect-creation-of-new-global-variables
 * 
 * @class detect globals
 */
var GlobalDetector	= function(){
	// take the namespace for global
	var inBrowser 	= typeof(window) !== 'undefined'	? true : false
	var _global	= inBrowser ?  window :  global;
	// sanity check - a global namespace MUST be found
	console.assert( _global, 'failed to find a global namespace! bailing out!' );
	// init initialGlobals
	var initialGlobals	= {};
	// loop on _global object
	for(var propname in _global){
		initialGlobals[propname] = true;
	}
	// init foundGlobals
	var foundGlobals= {};
	
	// init a timer
	var _this	= this;
	var timerid	= null;
	
	/**
	 * Start periodically monitoring
	 * @param  {Function+}	onChange optional callback called when a new global is found
	 * @param  {Number+}	period   period at which it is checked
	 */
	this.start	= function(onChange, period){
		period	= period	|| 1000;
		onChange= onChange	|| function(newProperty){
			var str	= new Date + " -- Warning Global Detected!!! "
			str	+= (inBrowser ? 'window': 'global');
			str	+= "['"+newProperty+"'] === " + _global[newProperty];
			console.warn(str)
		};
		timerid	= setInterval(function(){
			_this.check(onChange);
		}, period);
		return this;	// for chained API
	};
	/**
	 * Stop periodically monitoring
	 */
	this.stop	= function(){
		cancelInterval(_timerid);	
	};
	/**
	 * Check if any new global has been declared
	 * @param  {Function+} onChange optional callback called synchronously if a new global is found
	 * @return {Boolean} true if some new globals have been detected, false otherwise
	 */
	this.check	= function(onChange){
		var newGlobal	= false;
		// parameter polymorphism
		onChange	= onChange || function(property){}
		// new loop on _global object
	        for(var property in _global){
	        	// if it is in the initialGlobals, goto the next
			if( initialGlobals[property] )	continue;
			// if this is already in the ignoreList, goto the next
			if( GlobalDetector.ignoreList.indexOf(property) !== -1 )	continue;
	        	// if it already found, goto the next
			if( foundGlobals[property] )	continue;
			// mark this property as init
			foundGlobals[property]	= true;
			// mark newGlobal
			newGlobal	= true;
			// notify callback
			onChange(property);
	        }
	        return newGlobal;
	};
	/**
	 * getter for the foundGlobals up to now
	 * @return {Object} object with keys as property names
	 */
	this.foundGlobals	= function(){
		return foundGlobals;
	};
};

/**
 * list of variables name to ignore. populated at constructor() time
 * @type {String[]}
 */
GlobalDetector.ignoreList	= [];


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= GlobalDetector;
