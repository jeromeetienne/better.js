#!/usr/bin/env node

var Stacktrace	= require('../src/stacktrace.js');

// get the class
require('../src/queueablegettersetter.js');

var foo		= {
	x	: 3
};

var trackUsageOf	= function(baseObject, property){
	// define the tracker
	var tracker	= new Stacktrace.Tracker();
	// define the getter
	baseObject.__defineQGetter__(property, function(value){
		tracker.record('getter', 3)
		return value;
	});
	// define the trac
	baseObject.__defineQSetter__(property, function(value){
		tracker.record('setter', 3)
		return value;
	});
	return tracker;
};

var tracker	= trackUsageOf(foo, 'x');

console.log('foo.x', foo.x);

console.log(tracker.reportString())
