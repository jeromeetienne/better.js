#!/usr/bin/env node

// get the class
var GlobalDetector	= require('../src/globaldetector.js');

// declare a global which MUST NOT be detected
global.foo	= 'bar';

// start the detector
new GlobalDetector().start();


// dependancy
var Stacktrace	= require('../src/stacktrace.js')


// call that globaldetector-tracker.js ?

/**
 * localize where global are created
 */
function globalMonitorLocalizeCreation(varName, creationOnly){
	creationOnly	= creationOnly !== undefined ? creationOnly : false;
	var reported	= false;
	global.__defineSetter__(varName, function(value){
		// actually set the value in a proxy variable
		var realName	= 'globaldetector_valueof_'+varName;
		console.assert(this[realName] === undefined);
		this[realName]	= value;
		// if creationOnly must be reported and already reported, return now
		if( reported && creationOnly )	return;
		reported	= true;
		// mark proxy variable in ignoreList as it is a global
		GlobalDetector.ignoreList.push(realName);
		// get stackFrame and originId of the user
		var stackFrame	= Stacktrace.parse()[1];
		var originId	= stackFrame.fct + '@' + stackFrame.url + ':' + stackFrame.line;
		// actions to do notify the user
		console.log('global', "'"+varName+"'", 'created at', originId);
	});
	// TODO should it use qgettersetter.js ?
	global.__defineGetter__(varName, function(){
		var realName	= 'globaldetector_valueof_'+varName;
		var value	= this[realName];
		return value;
	});
}

// find a better name
globalMonitorLocalizeCreation('pif');

// declare a global which MUST be detected
global.pif	= 'paf';

// test getter
console.assert(global.pif === 'paf');
