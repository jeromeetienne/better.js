#!/usr/bin/env node

var GcMonitor	= require('../src/gcmonitor.js');

new GcMonitor().start();

setInterval(function(){
	for(var j = 0; j < 10000; j++){
		arr	= new Array(10000)
		for(var i = 0; i < arr.length; i++){
			arr[i]	= i;
		}			
	}
}, 1000/100)
