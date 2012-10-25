// allocationtracker-monitor.js in examples/js


/**
 * monitor for allocation tracker. It open another window and display 
 * the AllocationTracker.reportString() in it
 * 
 * typical usage: new AllocationTrackerMonitor().start(); 
 * 
 */
var AllocationTrackerMonitor	= function(){
	this._timerId	= null;	
}

/**
 * destroy the object
 */
AllocationTrackerMonitor.prototype.destroy	= function(){
	this.stop();	
}


/**
 * start monitoring
 */
AllocationTrackerMonitor.prototype.start	= function(){
	// content of the other frame
	var content	= [
		"<!doctype html>",
		"<h1>AllocationTracker.js Reports</h1>",
		"Date: <span id='reportTime'></span>",
		"<pre id='report'></pre>",
		"<script>",
		"	window.addEventListener('message', function(event){",
		"		document.getElementById('reportTime').innerText	= new Date().toString();",
		"		document.getElementById('report').innerText	= event.data;",
		"	},false);",
		"<\/script> "
	].join('\n');
	// build the url for the other frame
	var url = "data:text/html;base64,"+window.btoa(content);

	// open a window and report current allocation
	var myPopup = window.open(url,'newtab');
	setInterval(function(){
		var reportString	= AllocationTracker.reportString();

		myPopup.postMessage(reportString,'*'); //send the message and target URI

		// reset counters every time
		AllocationTracker.reset();
	}, 1000);

}

/**
 * stop monitoring
 */
AllocationTrackerMonitor.prototype.stop		= function(){
	this._timerId	&& clearInterval(this._timerId);
}