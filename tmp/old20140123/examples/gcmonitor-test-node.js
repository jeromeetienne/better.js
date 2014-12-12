#!/usr/bin/env node

var GcMonitor	= GcMonitor	|| require('../src/gcmonitor.js');

new GcMonitor().start();

setInterval(function(){
	var nAlloc	= 100;
	var allocSize	= 10000;

	for(var j = 0; j < nAlloc; j++){
		arr	= new Array(allocSize)
		for(var i = 0; i < arr.length; i++){
			arr[i]	= i;
		}			
	}
}, 1000/100)
