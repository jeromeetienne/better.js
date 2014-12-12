#!/usr/bin/env node

var AllocationTracker	= require('../src/allocationtracker.js');


// define a sample class
function aClass1(){
	AllocationTracker.record('aClass1')
};

// define a sample class
function aClass2(){
	AllocationTracker.record('aClass2')
};

// simulate allocation
new aClass1(); new aClass1(); new aClass1();
new aClass2(); new aClass2();

// display the report in console
console.log(AllocationTracker.reportString());