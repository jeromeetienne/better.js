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

	// sanity check - if not available, output a warning
	if( GcMonitor.isAvailable() === false ){
		// open -a "/Applications/Google Chrome.app" --args --enable-memory-info
		console.warn('memory info are unavailable... for chrome, use --enable-memory-info. Other browsers dont have this feature.')
	}

	/**
	 * Start monitoring periodically
	 * 
	 * @param {Function|undefined} onChange optional function to notify when gc occurs
	 * @param {Number|undefined} period period of the check. default to 50ms
	 */
	this.start	= function(onChange, period){
		period	= period	|| 1000/60;
		onChange= onChange	|| function(delta){
			function bytesToSize(bytes, nFractDigit) {
				var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				if (bytes == 0) return '0';
				nFractDigit	= nFractDigit !== undefined ? nFractDigit : 2;
				var precision	= Math.pow(10, nFractDigit);
				var i 		= Math.floor(Math.log(bytes) / Math.log(1024));
				return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
			};
			console.warn(new Date + " -- GC occured! saved", bytesToSize(delta), 'consuming at', bytesToSize(burnRate), 'per second')
		}
		timerid	= setInterval(function(){
			_this.check(onChange);
		}, period);
		return this;	// for chained api
	};
	/**
	 * Stop monitoring periodically
	 */
	this.stop	= function(){
		cancelInterval(timerid);	
	};
	
	var lastUsedHeap	= null;
	var lastTimestamp	= null;
	var burnRate		= null;	
	/**
	 * Check if currently used memory is less than previous check. If so it 
	 * is assume a GC occured
	 * 
	 * @param  {Function|undefined} onChange callback notified synchronously if gc occured
	 */
	this.check	= function(onChange){
		// parameter polymorphism
		onChange	= onChange || function(property){}

		var present	= Date.now();//console.log('present', (present - lastTimestamp)/1000)
		var currUsedSize= usedHeapSize();

		if( lastUsedHeap === null ){
			lastUsedHeap	= currUsedSize;
			lastTimestamp	= present;
			return;
		}

		// check if the heap size in this cycle is LESS than what we had last
		// cycle; if so, then the garbage collector has kicked in
		var deltaMem	= currUsedSize - lastUsedHeap;
		if( deltaMem < 0 ){
			onChange(-deltaMem, burnRate);		
		}else{
			var deltaTime	= present - lastTimestamp
			var newBurnrate	= deltaMem / (deltaTime/1000);
			if( burnRate === null )	burnRate	= newBurnrate;
			var friction	= 0.99;
			burnRate	= burnRate * friction + newBurnrate * (1-friction);
		}

		lastUsedHeap	= currUsedSize;
		lastTimestamp	= present;
	}
	
	/**
	 * getter for the burnRate
	 * @type {Number}
	 */
	this.burnRate	= function(){
		if( burnRate === null )	return 0;
		return burnRate;
	}
	
	/**
	 * getter for the usedHeapSize
	 * @return {Number} used heap size in byte
	 */
	this.usedHeapSize	= function(){
		return usedHeapSize();
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
