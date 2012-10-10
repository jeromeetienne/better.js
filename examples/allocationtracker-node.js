#!/usr/bin/env node

var allocationTracker	= require('../src/allocationtracker.js');



function aClass(){
	allocationTracker.record('aClass')
};

function aClass2(){
	allocationTracker.record('aClass2')
};

new aClass(); new aClass();
new aClass();
new aClass(); new aClass(); new aClass(); new aClass();
new aClass2();
new aClass2();


//console.dir(allocationTracker._klasses);
console.log(allocationTracker.reportString());
