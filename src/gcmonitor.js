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
			console.warn(new Date + " -- GC occured!!! saved", bytesToSize(delta), ' consuming at ', bytesToSize(burnrate))
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
	
	var lastUsedHeap	= null;
	var lastTimestamp	= null;
	var burnrate		= null;	
	/**
	 * Check if currently used memory is less than previous check. If so it 
	 * is assume a GC occured
	 * 
	 * @param  {Function|undefined} onChange callback notified synchronously if gc occured
	 */
	this.check	= function(onChange){
		// parameter polymorphism
		onChange	= onChange || function(property){}

		if( lastUsedHeap === null ){
			lastUsedHeap	= usedHeapSize();
			lastTimestamp	= Date.now();
			return;
		}

		var present	= Date.now();
		var currUsedSize= usedHeapSize();

		// check if the heap size is this cycle is LESS than what we had last
		// cycle; if so, then the garbage collector has kicked in
		var deltaMem	= currUsedSize - lastUsedHeap;
		if( deltaMem < 0 ){
			onChange(-deltaMem, burnrate);		
		}else{
			var deltaTime	= present - lastTimestamp
			var newBurnrate	= deltaMem / (deltaTime/1000);
			// if there is a previous burnrate, smooth with it
			if( burnrate !== null ){
				burnrate	= burnrate * 0.7 + newBurnrate * 0.3;
			}else{
				burnrate	= newBurnrate;
			}
		}
		
		lastUsedHeap	= currUsedSize;
		lastTimestamp	= Date.now();
	}
	
	/**
	 * getter for the burnrate
	 * @type {Number}
	 */
	this.burnrate	= function(){
		return burnrate;
	}
}

/**
 * check if it is available on the plateform it runs on 
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
