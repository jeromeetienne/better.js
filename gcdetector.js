/**
 * detect gabarge collector occurance. Require chrome for now
 * 
 * see details in http://buildnewgames.com/garbage-collector-friendly-code/
 */
var GcDetector	= function(){
	// init a timer
	var _this	= this;
	var timerid	= null;
	var period	= 100;
	var lastUsedHeap= 0;  // remember the heap size
// TODO how to make that in node.js
	var memory	= window.performance.memory;

	// sanity check	- the options MUST be present
	if( memory.totalJSHeapSize === 0 ){
		// open -a "/Applications/Google Chrome.app" --args --enable-memory-info
		console.warn('totalJSHeapSize === 0... have you enabled --enable-memory-info ?')
		console.warn('use this to launch "open -a "/Applications/Google Chrome.app" --args --enable-memory-info"')
	}

	/**
	 * Start monitoring periodically
	 * @param  {Function+} onChange optional function to notify when gc occurs
	 */
	this.start	= function(onChange){
		onChange= onChange || function(delta){
			function bytesToSize(bytes) {
				var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				if (bytes == 0) return 'n/a';
				var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
				return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
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
	 * @param  {Function+} onChange callback notified synchronously if gc occured
	 */
	this.check	= function(onChange){
		// parameter polymorphism
		onChange	= onChange || function(property){}
		// check if the heap size is this cycle is LESS than what we had last
		// cycle; if so, then the garbage collector has kicked in
		var delta	= window.performance.memory.usedJSHeapSize - lastUsedHeap;
		if( delta < 0 )	onChange(-delta);		
		lastUsedHeap	= memory.usedJSHeapSize;
	}
}

new GcDetector().start();
