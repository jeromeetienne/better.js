#!/usr/bin/env node

var ConsoleLogger	= require('../src/consolelogger.js');

// setup a filter based on origin
// ConsoleLogger.pushFilter(function(stackFrame){
// 	return stackFrame.url.match(/\.js$/)	? true : false
// }, 'all')

ConsoleLogger.pushFilter('consolelogger-example-node.js', 'warn');

// setup a message formater
//ConsoleLogger.formatter	= ConsoleLogger.formatterOrigin;
ConsoleLogger.formatter	= ConsoleLogger.formatterTimeStamp;

// overload the console.log/warn/error - optional
//ConsoleLogger.overloadConsole();

// example of .log/.warn/.error
ConsoleLogger.log('bonjour');
ConsoleLogger.warn('world!')
ConsoleLogger.error('Something is wrong.')
