/**
 * dump trackUsage() from globaldetector.js.
 * 
 * It doesn't use 
 * 
 * @return {String} the list of js commands to track global usage
 */
GlobalDetector.prototype.codeForUsageTracker	= function(){
	// for each foundGlobals
	var foundGlobals	= this.foundGlobals();
	// build the output
	var output	 = '/* Include PropertyAttr.js before. */\n';
	output		+= '/* PropertyAttr.usageTracker.dump() to dump usage records of all tracked properties */\n';
	// add tracking code for each foundGlobals
	Object.keys(foundGlobals).forEach(function(globalName){
		// take the namespace for global
		var inBrowser 	= typeof(window) !== 'undefined' ? true : false
		var _global	= inBrowser ?  window :  global;
		var globalStr	= inBrowser ? 'window': 'global';		
		// use functionattr.js if it is a function, propertyattr.js otherwise
		var cmd	 = 'PropertyAttr.define( '+globalStr+', \''+globalName+'\').trackUsage();';		
		output	+= cmd+'\n';
	})
	// return the output
	return output;
};

/**
 * display .codeForUsageTracker() in a new popup window
 */
GlobalDetector.prototype.codeForUsageTrackerWindow	= function(){
	var codeStr	= this.codeForUsageTracker();
	var url		= 'data:text/plain,' + codeStr;
	window.open(url);
};

/**
 * display .codeForUsageTracker() in the javascript console
 */
GlobalDetector.prototype.codeForUsageTrackerConsole	= function(){
	var codeStr	= this.codeForUsageTracker();
	console.log(codeStr)
};
