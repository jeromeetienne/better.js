/**
 * dump trackUsage() from globaldetector.js
 * @return {String} the list of js commands to track global usage
 */
GlobalDetector.prototype.dumpTrackUsage	= function(){
	// for each foundGlobals	
	var foundGlobals	= this.foundGlobals();
	// build the output
	var output	 = '/* Here, include PropertyAttr.js and FunctionAttr.js */\n';
	output		+= '/* PropertyAttr.usageTracker.dump() to dump usage records of all tracked properties */\n';
	output		+= '/* FunctionAttr.usageTracker.dump() to dump usage records of all tracked functions */\n';
	// add tracking code for each foundGlobals
	Object.keys(foundGlobals).forEach(function(globalName){
		// take the namespace for global
		var inBrowser 	= typeof(window) !== 'undefined'	? true : false
		var _global	= inBrowser ?  window :  global;
		var globalStr	= inBrowser ? 'window': 'global';		
		// use functionattr.js if it is a function, propertyattr.js otherwise
		if( typeof(_global[globalName]) === 'function'){
			var cmd	 = globalStr+'.'+globalName+' = ';
			cmd	+= 'FunctionAttr.define('+globalStr+', \''+globalName+'\')';		
			cmd	+= '.trackUsage().done();'
			output	+= cmd+'\n';
		}else{
			var cmd	 = 'PropertyAttr.define( '+globalStr+', \''+globalName+'\').trackUsage();';		
			output	+= cmd+'\n';
		}
	})
	// return the output
	return output;
};

/**
 * display .dumpTrackUsage() in a new popup window
 */
GlobalDetector.prototype.dumpTrackUsageWindow	= function(){
	var codeStr	= this.dumpTrackUsage();
	var url		= 'data:text/plain,' + codeStr;
	window.open(url);
};

/**
 * display .dumpTrackUsage() in the javascript console
 */
GlobalDetector.prototype.dumpTrackUsageConsole	= function(){
	var codeStr	= this.dumpTrackUsage();
	console.log(codeStr)
};
