var express	= require('express')
var app		= express()

//////////////////////////////////////////////////////////////////////////////////
//		connect middleware for a better.js cache folder
//////////////////////////////////////////////////////////////////////////////////

/**
 * connect middleware for better.js cache folder.
 * All cached files are assumed to be children of the cache folder parent.
 * Made to fit one possible workflow to handle jsdoc2betterjs.
 * 
 * @param  {String}	cacheFolder - the better.js cache folder
 * @return {Function}	the configured middleware
 */
function connectBetterjsCacheFolder(cacheFolder){
	var rootFolder	= require('path').dirname(cacheFolder)
	return function(request, response, next){
		// get requested filename
		var fileName	= request.path
		// remove leading /
		fileName	= fileName.replace(/^\//, '')

		// if it is not for a .js file, return now
		if( fileName.match(/\.js$/) === null )	return next()

		// if fileName isnt below rootFolder, return now
		var relativePath= require('path').relative(rootFolder, fileName)
		var isSubFolder	= relativePath[0] !== '.' ? true : false
		if( isSubFolder === false )	return next()

		// if it isnt a static file, return now
		// TODO to remove this Sync() call
		var isStatic	= require('fs').existsSync(fileName)
		if( isStatic === false )	return next()

		// if it has a .better.js, return its content instead
		// TODO to remove this Sync() call
		var betterjsName= require('path').join(cacheFolder, relativePath)
		var hasBetterJS	= require('fs').existsSync(betterjsName)
		if( hasBetterJS ){
			response.sendfile(betterjsName, {
				root	: process.cwd()
			});
			return;
		}

		// if it has no .better.js, return its actual content
		response.sendfile(fileName, {
			root	: process.cwd()
		});
	}
}
//////////////////////////////////////////////////////////////////////////////////
//		use connectBetterjsCacheFolder
//////////////////////////////////////////////////////////////////////////////////
///
// app.use(connectBetterjsCacheFolder('.betterjs'))

var connectBetterjs	= require('./connect-betterjs.js')
app.use(connectBetterjs('.betterjs'))

//////////////////////////////////////////////////////////////////////////////////
//		Serve static content during dev
//////////////////////////////////////////////////////////////////////////////////
// serve static files and project index page

app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.send('Hello World!')
})

var server	= app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
})