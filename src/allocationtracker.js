var Stacktrace	= Stacktrace	|| require('../src/stacktrace')

/**
 * @namespace
 */
var allocationTracker	= new Stacktrace.Tracker();

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= allocationTracker;
