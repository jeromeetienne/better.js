/**
 * detect gabarge collector occurance. Require v8 for now, so chrome or node.js.
 * typical usage: <code>new GcMonitor().start();</code>
 * 
 * @class monitor gabage collector activities
 * 
 * see details in http://buildnewgames.com/garbage-collector-friendly-code/
 */
var GcMonitor	= function(){
	// init a timer
	var _this	= this;
	var timerid	= null;
	var lastUsedHeap= 0;  // remember the heap size
	// define function to return used heap size
	var inNode	= typeof(window) === 'undefined' ? true : false;
	var usedHeapSize= inNode ? function(){
		return process.memoryUsage().heapUsed;	
	} : function(){
		if( !window.performance || !window.performance.memory )	return 0;
		return window.performance.memory.usedJSHeapSize;	
	};

	/**
	 * Start monitoring periodically
	 * 
	 * @param {Function|undefined} onChange optional function to notify when gc occurs
	 * @param {Number|undefined} period period of the check. default to 50ms
	 */
	this.start	= function(onChange, period){
		period	= period	|| 50;
		onChange= onChange || function(delta){
			function bytesToSize(bytes, nFractDigit) {
				var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				if (bytes == 0) return '0';
				nFractDigit	= nFractDigit !== undefined ? nFractDigit : 2;
				var precision	= Math.pow(10, nFractDigit);
				var i 		= Math.floor(Math.log(bytes) / Math.log(1024));
				return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
			};
			console.warn(new Date + " -- GC occured!!! saved", bytesToSize(delta))
		}
		timerid	= setInterval(function(){
			_this.check(onChange);
		}, period);
	};
	/**
	 * Stop monitoring periodically
	 */
	this.stop	= function(){
		cancelInterval(timerid);	
	};
	
	/**
	 * Check if currently used memory is less than previous check. If so it 
	 * is assume a GC occured
	 * 
	 * @param  {Function|undefined} onChange callback notified synchronously if gc occured
	 */
	this.check	= function(onChange){
		// parameter polymorphism
		onChange	= onChange || function(property){}
		// check if the heap size is this cycle is LESS than what we had last
		// cycle; if so, then the garbage collector has kicked in
		var delta	= usedHeapSize() - lastUsedHeap;
		if( delta < 0 )	onChange(-delta);		
		lastUsedHeap	= usedHeapSize();
	}
}

/**
 * check if it is available on this plateform
 * 
 * @return {Boolean} true if it is available, false otherwise
 */
GcMonitor.isAvailable	= function(){
	var inNode	= typeof(window) === 'undefined' ? true : false;
	if( inNode )	return true;
	if( !window.performance	)	return false;
	if( !window.performance.memory)	return false;
	return true;	
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= GcMonitor;
