#!/usr/bin/env node

var ConsoleLogger	= require('../src/consolelogger.js');

var foo	= function(){};

// ConsoleLogger.pushFilter(function(stackFrame){
// 	return stackFrame.url.match(/\.js$/)	? true : false
// }, 'all')

ConsoleLogger.log('bonjour');

ConsoleLogger.overloadConsole();

console.log('world')


