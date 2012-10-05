#!/usr/bin/env node

var GcDetector	= require('../gcdetector.js');

new GcDetector().start();
setInterval(function(){
	for(var j = 0; j < 1000; j++){
		arr	= new Array(10000)
		for(var i = 0; i < arr.length; i++){
			arr[i]	= i;
		}			
	}
}, 300)
