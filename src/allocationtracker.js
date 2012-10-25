var Stacktrace	= Stacktrace	|| require('../src/stacktrace')

/**
 * @namespace
 * http://stackoverflow.com/questions/367768/how-to-detect-if-a-function-is-called-as-constructor
 */
var AllocationTracker	= new Stacktrace.Tracker();

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= AllocationTracker;
