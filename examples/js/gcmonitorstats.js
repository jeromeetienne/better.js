//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Display current memory usage + garbage collection occurence
 * 
 * heavily based on @mrdoob stats.js
 */
var GcMonitorStatsCollection = function (){

	var msMin	= 100;
	var msMax	= 0;

	var container	= document.createElement( 'div' );
	container.id	= 'stats';
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var msDiv	= document.createElement( 'div' );
	msDiv.id	= 'ms';
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
	container.appendChild( msDiv );

	var msText	= document.createElement( 'div' );
	msText.id	= 'msText';
	msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML= 'gcMem';
	msDiv.appendChild( msText );

	var msGraph	= document.createElement( 'div' );
	msGraph.id	= 'msGraph';
	msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	msDiv.appendChild( msGraph );

	while ( msGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
		msGraph.appendChild( bar );

	}

	var updateGraph = function ( dom, height, color ) {

		var child = dom.appendChild( dom.firstChild );
		child.style.height = height + 'px';
		if( color ) child.style.backgroundColor = color;

	}
	
	
	var gcMonitor	= new GcMonitor();

	var lastTime	= 0
	return {
		domElement	: container,
		update		: function(){

			// refresh only 30time per second
			if( Date.now() - lastTime < 1000/30 )	return;
			lastTime	= Date.now()

			var color	= '#131';
			gcMonitor.check(function(delta, burnRate){
				color	= '#830';
			})
			
			var val	= gcMonitor.usedHeapSize();
			msMin	= Math.min( msMin, val );
			msMax	= Math.max( msMax, val );
			msText.textContent = "gcMem: " + bytesToSize(val, 2);
			
			var normValue	= val / (20*1024*1024);
			var height	= Math.min( 30, 30 - normValue * 30 );
			updateGraph( msGraph, height, color);
			
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
	textEl.innerHTML= 'gcRate: ';
	textEl.style.cssText	= 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	divEl.appendChild( textEl );

	var graphEl	= document.createElement( 'div' );
	graphEl.style.cssText	= 'position:relative;width:74px;height:30px;background-color:#0f0';
	divEl.appendChild( graphEl );

	while ( graphEl.children.length < 74 ) {
		var barEl	= document.createElement( 'span' );
		barEl.style.cssText	= 'width:1px;height:30px;float:left;background-color:#131';
		graphEl.appendChild( barEl );
	}

	var updateGraph	= function ( height, color ) {
		var childEl	= graphEl.appendChild( graphEl.firstChild );
		childEl.style.height	= height + 'px';
		if( color )	childEl.style.backgroundColor = color;
	}
	
	
	var gcMonitor	= new GcMonitor();
	var lastTime	= 0;
	return {
		domElement	: container,
		update		: function(){
			// refresh only 30time per second
			if( Date.now() - lastTime < 1000/10 )	return;
			lastTime	= Date.now()
 
			gcMonitor.check();
			
			var value	= gcMonitor.burnRate();
			value	= 0;
			textEl.textContent = "gcRate: " + bytesToSize(value, 2);

			var normValue	= value / (5*1024*1024);
			var height	= Math.min(30, 30 - normValue * 30);
			updateGraph(height, '#131');
			
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
 * vuemeter on gc activity - stats.js like - union 
 * of GcMonitorStatsCollection/GcMonitorStatsBurnRate
 */
var GcMonitorStats	= function (){
	// build domElement container
	var container	= document.createElement('div');
	// instanciate GcMonitorStatsCollection
	var statsCollection	= new GcMonitorStatsCollection();
	container.appendChild(statsCollection.domElement);
	// instanciate GcMonitorStatsBurnRate
	var statsBurnRate	= new GcMonitorStatsBurnRate();
	container.appendChild(statsBurnRate.domElement);
	// return domElement and update()
	return {
		domElement	: container,
		update		: function(){
			statsCollection.update();
			statsBurnRate.update();
		}
	};
}

