#!/usr/bin/env node

var ConsoleLogger	= require('../src/consolelogger.js');

var foo	= function(){};

// ConsoleLogger.pushFilter(function(stackFrame){
// 	return stackFrame.url.match(/\.js$/)	? true : false
// }, 'all')

//ConsoleLogger.formatter	= ConsoleLogger.formatterOrigin;
ConsoleLogger.formatter	= ConsoleLogger.formatterTimeStamp;
ConsoleLogger.overloadConsole();


console.log('bonjour');

console.warn('world!')

console.error('Life is great.')

