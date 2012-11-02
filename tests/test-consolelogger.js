var ConsoleLogger	= ConsoleLogger	|| require('../src/consolelogger.js');

describe('ConsoleLogger', function(){

	// hijack the underlying console.log for testing
	var lastLogArgs	= null;
	ConsoleLogger._origConsole.log	= function(){
		lastLogArgs	= arguments;
	};
	ConsoleLogger._origConsole.warn	= function(){
		lastLogArgs	= arguments;
	};
	ConsoleLogger._origConsole.error= function(){
		lastLogArgs	= arguments;
	};
	
	it('should log when there is no setup', function(){
		ConsoleLogger.log('foo', 'bar');
		console.assert( lastLogArgs[0] === 'foo' );
		console.assert( lastLogArgs[1] === 'bar' );
	});

	it('should not log when filtered above', function(){
		lastLogArgs		= null;
		ConsoleLogger._filters	= [];
		
		ConsoleLogger.pushFilter('test-consolelogger.js', 'warn')
		ConsoleLogger.log('foo', 'bar');
		console.assert( lastLogArgs === null );
		
	});	

	it('should log when filtered below', function(){
		lastLogArgs		= null;
		ConsoleLogger._filters	= [];
		ConsoleLogger.pushFilter('test-consolelogger.js', 'warn')
		lastLogArgs	= null;
		ConsoleLogger.error('foo', 'bar');
		console.assert( lastLogArgs[0] === 'foo' );
		console.assert( lastLogArgs[1] === 'bar' );
	});

	it('should go thru formater', function(){
		// set a console logger formatter for the message
		ConsoleLogger.formatter	= function(args, stackFrame, severity){
			// convert arguments into actual Array
			args	= Array.prototype.slice.call(args, 0);
			// prepend the prefix
			args.unshift('bouya');
			// return the result
			return args;
		}
		lastLogArgs	= null;
		ConsoleLogger.error('foo', 'bar');
		console.assert( lastLogArgs[0] === 'bouya' );
		console.assert( lastLogArgs[1] === 'foo' );
		console.assert( lastLogArgs[2] === 'bar' );	
	});
});