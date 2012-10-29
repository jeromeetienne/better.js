var GcMonitor	= GcMonitor	|| require('../src/gcmonitor.js');

describe('GcMonitor', function(){
	
	var monitor	= new GcMonitor();
	
	it('should be available', function(){
		console.assert(GcMonitor.isAvailable())
	});
	
	it('should have .usedHeapSize() returning a number > 0 if available', function(){
		if( GcMonitor.isAvailable() ){
			var usedHeapSize	= monitor.usedHeapSize();
			console.assert(usedHeapSize > 0);	
			console.assert( typeof(usedHeapSize) === 'number');	
		}
	});
	
	it('should have .burnRate() returning a number', function(){
		if( GcMonitor.isAvailable() ){
			var burnRate	= monitor.burnRate();
			console.assert( typeof(burnRate) === 'number');	
		}
	});
});