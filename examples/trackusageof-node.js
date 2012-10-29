#!/usr/bin/env node

var Stacktrace		= Stacktrace	|| require('../src/stacktrace.js');
var QGetterSetter	= QGetterSetter	|| require('../src/qgettersetter.js')

var foo		= {
	x	: 3
};

var trackUsageOf	= function(baseObject, property){
	// define the tracker
	var tracker	= new Stacktrace.Tracker();
	// define the getter
	QGetterSetter.defineGetter(baseObject, property, function(value){
		tracker.record('getter', 1)
		return value;
	});
	// define the trac
	QGetterSetter.defineSetter(baseObject, property, function(value){
		tracker.record('setter', 1)
		return value;
	});
	return tracker;
};

var tracker	= trackUsageOf(foo, 'x');

console.log('foo.x', foo.x);

console.log(tracker.reportString())
