/**
 * from http://stackoverflow.com/questions/5088203/how-to-detect-creation-of-new-global-variables
*/
var GlobalDetector	= function(){
	// init proplist
	window.proplist = window.proplist || {};
	// loop on window global object
	for(var propname in window){
		window.proplist[propname] = true;
	}
	
	// init a timer
	var _this	= this;
	var timerid	= null;
	
	this.start	= function(){
		timerid	= setInterval(function(){
			_this.check(function(newProperty){
				console.warn(new Date + " -- Warning Global Detected!!! window['"+newProperty+"'] === ", window[newProperty])
			});
		}, 1000);
	};
	this.stop	= function(){
		cancelInterval(this._timerid);	
	};
	this.check	= function(onChange){
		console.log("check")
		// parameter polymorphism
		onChange	= onChange || function(property){}
		// new loop on window global object
	        for(var propname in window){
			if( window.proplist[propname] )	continue;
			// if this is already in the ignoreList, continue
			if( GlobalDetector.ignoreList.indexOf(propname) !== -1 )	continue;
			// mark this property as init
			window.proplist[propname] = true;
			// notify callback
			onChange(propname);
	        }
	}
	this.start();
}
GlobalDetector.ignoreList	= [];

new GlobalDetector()
