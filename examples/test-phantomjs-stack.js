// run it with 
// $ phantomjs test-phantomjs-stack.js


// define the url of the page to read
var url = 'http://127.0.0.1:8000/examples/test-phantomjs-stack.html'


// read the page
var page = require('webpage').create();
page.open(url, function(status) {
	// see if the page opened successfuly
	if (status !== 'success') {
		console.log('Unable to access network for', url);
		phantom.exit();
		return;
	}

	phantom.exit();
});

/**
 * hook console message from the page
 */
page.onConsoleMessage = function(msg, lineNum, sourceId) {
	console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

/**
 * Callback 
 * @param  {String} msg   - Error Message
 * @param  {*} trace - 
 */
phantom.onError = function(msg, trace){
	var msgStack = ['PHANTOM ERROR: ' + msg];
	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
			msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
		});
	}
	console.error(msgStack.join('\n'));
	phantom.exit(1);
};



