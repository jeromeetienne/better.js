/**
 * dump trackUsage() from globaldetector.js.
 */
GlobalDetector.prototype.usageTrackerCode	= function(){
	// for each foundGlobals
	var foundGlobals	= this.foundGlobals();
	// build the output
	var output	 = '/* Include PropertyAttr.js before. */\n';
	output		+= '/* globalDetector.usageTrackerDump() to dump usage records of all tracked properties */\n';
	// add tracking code for each foundGlobals
	Object.keys(foundGlobals).forEach(function(globalName){
		// take the namespace for global
		var inBrowser 	= typeof(window) !== 'undefined' ? true : false
		var _global	= inBrowser ?  window :  global;
		var globalStr	= inBrowser ? 'window': 'global';		
		// use functionattr.js if it is a function, propertyattr.js otherwise
		var cmd	 = "PropertyAttr.define("+globalStr+", '"+globalName
				+"').trackUsage('"+globalStr+"."+globalName+"');";		
		output	+= cmd+'\n';
	})
	// return the output
	return output;
};

/**
 * display .usageTrackerCode() in a new popup window
 */
GlobalDetector.prototype.usageTrackerCodeWindow	= function(){
	var codeStr	= this.usageTrackerCode();
	var url		= 'data:text/plain,' + codeStr;
	window.open(url);
};

/**
 * display .usageTrackerCode() in the javascript console
 */
GlobalDetector.prototype.usageTrackerCodeConsole	= function(){
	var codeStr	= this.usageTrackerCode();
	console.log(codeStr)
};

/**
 * dump the usage
 * 
 * @see Stacktrace.Tracker.reportString
 */
GlobalDetector.prototype.usageTrackerDump	= function(){
	// forward to PropertyAttr.usageTracker.dump
	return PropertyAttr.usageTracker.dump.apply(PropertyAttr.usageTracker, arguments)
}