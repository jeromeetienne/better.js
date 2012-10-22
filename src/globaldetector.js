/**
 * Used to detect globals. works in node.js and browser
 * 
 * from http://stackoverflow.com/questions/5088203/how-to-detect-creation-of-new-global-variables
 * 
 * @class detect globals
 */
var GlobalDetector	= function(){
	// take the namespace for global
	var inBrowser	= typeof(window) !== 'undefined'	? true : false
	var _global	= inBrowser	?  window	:  global;
	var _globalStr	= inBrowser	? 'window'	: 'global';
	// sanity check - a global namespace MUST be found
	console.assert( _global, 'failed to find a global namespace! bailing out!' );
	// init proplist
	_global.proplist = _global.proplist || {};
	// loop on _global _global object
	for(var propname in _global){
		_global.proplist[propname] = true;
	}
	
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
			console.warn(new Date + " -- Warning Global Detected!!! "+_globalStr+"['"+newProperty+"'] === ", _global[newProperty])
		}
		timerid	= setInterval(function(){
			_this.check(onChange);
		}, period);
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
	 */
	this.check	= function(onChange){
		// parameter polymorphism
		onChange	= onChange || function(property){}
		// new loop on _global object
	        for(var property in _global){
			if( _global.proplist[property] )	continue;
			// if this is already in the ignoreList, continue
			if( GlobalDetector.ignoreList.indexOf(property) !== -1 )	continue;
			// mark this property as init
			_global.proplist[property] = true;
			// notify callback
			onChange(property);
	        }
	}
}

/**
 * list of variables name to ignore. populated at constructor() time
 * @type {String[]}
 */
GlobalDetector.ignoreList	= [];


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= GlobalDetector;
