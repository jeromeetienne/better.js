#!/usr/bin/env node

var ConsoleLogger	= require('../src/consolelogger.js');

var foo	= function(){};

ConsoleLogger.pushFilter(function(stackFrame){
	return stackFrame.url.match(/\.js$/)	? true : false
}, 'nothing')

ConsoleLogger.log('bonjour');
