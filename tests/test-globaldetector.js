var GlobalDetector	= GlobalDetector	|| require('../src/globaldetector.js');

describe('GlobalDetector', function(){
	
	// declare something which is in chrome debugger or other extension
	GlobalDetector.ignoreList.push('__screenCapturePageContext__');
	GlobalDetector.ignoreList.push('notifyScript');

	var gDetector	= new GlobalDetector();
	var _global	= typeof(window) === 'undefined' ? global : window;
	
	it('should not detect anything when no new global are defined', function(){
		console.assert( gDetector.check() === false );
	});
	
	it('should detect new global', function(){
		_global.bla0	= true;
		console.assert( gDetector.check() === true );
		delete _global.bla0;
	});

	it('should detect new global with proper name', function(){
		_global.bla1	= true;
		gDetector.check(function(property){
			console.assert(property === 'bla1');
		});
		delete _global.bla1;
	});
});