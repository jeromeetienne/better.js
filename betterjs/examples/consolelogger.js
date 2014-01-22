var Bjs	= require('../../build/better.js')

Bjs.log('hello')
Bjs.warn('prout')

// add a filter
Bjs.pushLogFilter('consolelogger.js', 'warn');

// example of .log/.warn/.error
Bjs.log('bonjour');
Bjs.warn('world!')
Bjs.error('Something is wrong.')

// overload the console.log/warn/error - optional
Bjs.overloadConsoleLog()

// example of .log/.warn/.error
console.log('bonjour');
console.warn('world!')
console.error('Something is wrong.')


