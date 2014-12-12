//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Display current memory usage + garbage collection occurence
 * 
 * heavily based on @mrdoob stats.js
 */
var GcMonitorStatsCollection = function (){
	var container	= document.createElement( 'div' );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var divEl	= document.createElement( 'div' );
	divEl.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
	container.appendChild( divEl );

	var testEl	= document.createElement( 'div' );
	testEl.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	testEl.innerHTML= 'Mem';
	divEl.appendChild( testEl );

	var graphEl	= document.createElement( 'div' );
	graphEl.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	divEl.appendChild( graphEl );

	var currentValues	= [];
	var maxViewableValue	= 2*1024*1024;
	for(var i = 0; i < 74; i++){
		currentValues[i]	= 0;
		var barEl	= document.createElement( 'span' );
		barEl.style.cssText	= 'width:1px;height:30px;float:left;background-color:#131';
		graphEl.appendChild( barEl );
	}

	// get max of currentValues - used for autoscaling
	var cpuMaxCurrentValues	= function(){
		var max	= -Infinity;
		for(var i = 0; i < currentValues.length; i++){
			max	= Math.max(max, currentValues[i]);
		}
		return max;
	};
	// update the graph
	var updateGraph	= function(value, color){
		// update currentValues
		currentValues.shift();
		currentValues.push(value);
		// handle autoscaling
		var max	= cpuMaxCurrentValues();
		if( max > maxViewableValue ){
			maxViewableValue	= max * 1.2;
			reflowGraph();
		}else if( max < 0.5 * maxViewableValue ){
			maxViewableValue	= max * 1.2;
			reflowGraph();			
		}
		// compute the height
		var normValue	= value / maxViewableValue;
		var height	= Math.min(30, 30 - normValue * 30);		
		// display the height
		var childEl	= graphEl.appendChild( graphEl.firstChild );
		childEl.style.height	= height + 'px';
		// change color if needed
		if( color ) childEl.style.backgroundColor	= color;
	};
	// reflow the graph - used for autoscaling
	var reflowGraph	= function(){
		for(var i = 0; i < currentValues.length; i++){
			var value	= currentValues[i];
			// compute the height
			var normValue	= value / maxViewableValue;
			var height	= Math.min(30, 30 - normValue * 30);		
			// display the height
			var childEl	= graphEl.children[i];
			childEl.style.height	= height + 'px';
		}
	};

	var gcMonitor	= new GcMonitor();
	var lastTime	= 0;

	return {
		domElement	: container,
		update		: function(){
			// refresh only 30time per second
			if( Date.now() - lastTime < 1000/60 )	return;
			lastTime	= Date.now()
			// get value and color
			var color	= '#131';
			gcMonitor.check(function(delta, burnRate){
				color	= '#830';
			});	
			var value	= gcMonitor.usedHeapSize();
			// update graph
			updateGraph(value, color);
			// display label
			testEl.textContent = "Mem: " + bytesToSize(value, 2);			
			function bytesToSize( bytes, nFractDigit ){
				var sizes = ['B ', 'KB', 'MB', 'GB', 'TB'];
				if (bytes == 0) return 'n/a';
				nFractDigit	= nFractDigit !== undefined ? nFractDigit : 0;
				var precision	= Math.pow(10, nFractDigit);
				var i 		= Math.floor(Math.log(bytes) / Math.log(1024));
				return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
			};
		}
	}
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * display how heavily memory is allocated 
 * 
 * heavily based on @mrdoob stats.js
 */
var GcMonitorStatsBurnRate = function (){

	var container	= document.createElement( 'div' );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var divEl	= document.createElement( 'div' );
	divEl.style.cssText	= 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
	container.appendChild( divEl );

	var textEl	= document.createElement( 'div' );
	textEl.innerHTML= 'rate: ';
	textEl.style.cssText	= 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;line-height:15px';
	divEl.appendChild( textEl );

	var graphEl	= document.createElement( 'div' );
	graphEl.style.cssText	= 'position:relative;width:74px;height:30px;background-color:#0f0';
	divEl.appendChild( graphEl );

	var currentValues	= [];
	var maxViewableValue	= 2*1024*1024;
	for(var i = 0; i < 74; i++){
		currentValues[i]	= 0;
		var barEl	= document.createElement( 'span' );
		barEl.style.cssText	= 'width:1px;height:30px;float:left;background-color:#131';
		graphEl.appendChild( barEl );
	}

	// get max of currentValues - used for autoscaling
	var cpuMaxCurrentValues	= function(){
		var max	= -Infinity;
		for(var i = 0; i < currentValues.length; i++){
			max	= Math.max(max, currentValues[i]);
		}
		return max;
	};
	// update the graph
	var updateGraph	= function(value){
		// update currentValues
		currentValues.shift();
		currentValues.push(value);
		// handle autoscaling
		var max	= cpuMaxCurrentValues();
		if( max > maxViewableValue ){
			maxViewableValue	= max * 1.2;
			reflowGraph();
		}else if( max < 0.5*maxViewableValue ){
			maxViewableValue	= max * 1.2;
			reflowGraph();			
		}
		// compute the height
		var normValue	= value / maxViewableValue;
		var height	= Math.min(30, 30 - normValue * 30);		
		// display the height
		var childEl	= graphEl.appendChild( graphEl.firstChild );
		childEl.style.height	= height + 'px';
	};
	// reflow the graph - used for autoscaling
	var reflowGraph	= function(){
		for(var i = 0; i < currentValues.length; i++){
			var value	= currentValues[i];
			// compute the height
			var normValue	= value / maxViewableValue;
			var height	= Math.min(30, 30 - normValue * 30);		
			// display the height
			var childEl	= graphEl.children[i];
			childEl.style.height	= height + 'px';
		}
	};

	var gcMonitor	= new GcMonitor().start(function(){}, 1000/60);
	var lastTime	= 0;
	return {
		domElement	: container,
		update		: function(){
			// refresh only 5time per second
			if( Date.now() - lastTime < 1000/5 )	return;
			lastTime	= Date.now()
 			// get current value
			var value	= gcMonitor.burnRate();
			// update graph
			updateGraph(value);
			// display label
			textEl.textContent = "rate: " + bytesToSize(value, 2);			
			function bytesToSize( bytes, nFractDigit ){
				var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
				if (bytes == 0) return 'n/a';
				nFractDigit	= nFractDigit !== undefined ? nFractDigit : 0;
				var precision	= Math.pow(10, nFractDigit);
				var i 		= Math.floor(Math.log(bytes) / Math.log(1024));
				return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
			};
		}
	}
};


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * vuemeter on gc activity - stats.js like 
 * - union of GcMonitorStatsCollection/GcMonitorStatsBurnRate
 */
var GcMonitorStats	= function (){
	// build domElement container
	var container	= document.createElement('div');
	// instanciate GcMonitorStatsBurnRate
	var statsBurnRate	= new GcMonitorStatsBurnRate();
	container.appendChild(statsBurnRate.domElement);
	// instanciate GcMonitorStatsCollection
	var statsCollection	= new GcMonitorStatsCollection();
	container.appendChild(statsCollection.domElement);
	// return domElement and update()
	return {
		domElement	: container,
		update		: function(){
			statsCollection.update();
			statsBurnRate.update();
		}
	};
}

