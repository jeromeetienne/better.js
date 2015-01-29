#!/usr/bin/env node

var recast	= require("recast");
var builders	= recast.types.builders;

//////////////////////////////////////////////////////////////////////////////////
//		Inline help
//////////////////////////////////////////////////////////////////////////////////
if( process.argv[2] === '-h' || process.argv[2] === undefined ){
	console.log('Usage: jsdoc2betterjs [options] file.js file2.js...')
	console.log('')
	console.log('Makes sure jsdoc is respected during execution.')
	console.log('More about better.js at http://betterjs.org')

	console.log('')
	console.log('Options:')
	console.log('\t-m	Generate source map file. file.js into file.js.map')
	console.log('')
	console.log('\t-w	Write generated code from file.js into file.better.js')
	console.log('')
	console.log('\t-d DIR	Write generated code into DIR with a folder hierachie similar to relative')
	console.log('\t	path to the original file.js.')
	console.log('')
	console.log('\t-s	If @return or no @param are undefined in jsdoc, check it is nothing during execution')
	console.log('')
	console.log('\t-p	Privatize the classes')
	console.log('')
	console.log('\t--log	Log events on stderr')
	console.log('')
	console.log('\t--property	Enable Better.Property (beta)')
	console.log('\t--noproperty	Disable Better.Property (beta)')
	console.log('')
	console.log('\t-h	Display inline help')
	console.log('')
	console.log('\t-v	Display version')
	console.log('')
	console.log('servecachedir [DIR]	server this directory as cache directory. defalt to .betterjs')
	console.log('')
	process.exit()
}
if( process.argv[2] === '-v' ){
	var packageJson	= require('./../../package.json')
	console.log(packageJson.version)
	return
}
if( process.argv[2] === 'servecachedir' ){
	var cacheDirName= process.argv[3] || '.betterjs'
	// Create a node-static server instance to serve the './public' folder
	var fileServer	= new (require('node-static')).Server('.');
	var server	= require('http').createServer(function(request, response){
		// console.log('request', request.url)
		request.addListener('end', function(){
			var isJavascript	= request.url.match(/\.js$/) !== null ? true : false
			// server normal files
			if( isJavascript === false ){
				fileServer.serve(request, response);
				return
			}

			// test is betterjsPath exist
			var betterjsPath	= cacheDirName+request.url
			require('fs').exists(betterjsPath, function(exists){
				// if betterjs file doesnt exists, server it normally
				if( exists === false ){
					console.log('serve normal version', request.url)
					fileServer.serve(request, response);
				}else{
					// if betterjs file DOES exist, server it normally
					console.log('serve better.js version', betterjsPath)
					fileServer.serveFile(betterjsPath, 200, {}, request, response);
				}

			})
		})
		request.resume();
	})
	var port	= process.env.PORT	|| 8000
	var listenAddr	= process.env.IP	|| '0.0.0.0'
	console.log('jsdoc2betterjs: start serving better.js cache folder in "'+cacheDirName+'/"')
	console.log('Listening on '+listenAddr+':'+port)
	server.listen(port, listenAddr);
	return
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
var cmdlineOptions	= {
	strictParams		: false,
	strictReturns		: false,
	privatizeClasses	: false,
	logEvents		: false,
	propertyEnabled		: true,

	generateSourceMap	: false,
	codeFolderName		: null,
	fileNames		: [],
}

for(var i = 2; process.argv[i] !== undefined; i++){
	if( process.argv[i] === '-s' ){
		cmdlineOptions.strictParams	= true
		cmdlineOptions.strictReturns	= true
		continue;
	}else if( process.argv[i] === '-p' ){
		cmdlineOptions.privatizeClasses	= true
		continue;
	}else if( process.argv[i] === '-m' ){
		cmdlineOptions.generateSourceMap= true
		continue;
	}else if( process.argv[i] === '-d' ){
		cmdlineOptions.codeFolderName	= process.argv[++i]
		continue;
	}else if( process.argv[i] === '--log' ){
		cmdlineOptions.logEvents	= true
		continue;
	}else if( process.argv[i] === '--property' ){
		cmdlineOptions.propertyEnabled	= true
		continue;
	}else if( process.argv[i] === '--noproperty' ){
		cmdlineOptions.propertyEnabled	= false
		continue;
	}else{
		cmdlineOptions.fileNames.push( process.argv[i] )
	}
}

if( cmdlineOptions.fileNames.length === 0 ){
	console.error('jsdoc2betterjs: a filename MUST be provided!')
	process.exit()
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////


cmdlineOptions.fileNames.forEach(function(sourceFileName){

	var processOne	= require('./libs/processFile.js').processOne
	processOne(sourceFileName, cmdlineOptions, function(output){
		//////////////////////////////////////////////////////////////////////////////////
		//		write the code
		//////////////////////////////////////////////////////////////////////////////////
		var code	= output.code

		// Append the sourcemap url to the better.js files
		if( cmdlineOptions.generateSourceMap === true ){
			code += '\n\n//# sourceMappingURL=' + require('path').basename(recastOption.sourceMapName);
console.assert(cmdlineOptions.codeFolderName === null)
		}

/**
 * TODO make some sanity checck like relative path
 * TODO test the sourcemap writing with the codeFolderName
 * TODO find better naming
 */
		// honor cmdlineOptions.codeFolderName
		if( cmdlineOptions.codeFolderName !== null ){
			var codeFolderName	= cmdlineOptions.codeFolderName
			var codeFolderRoot	= require('path').dirname(codeFolderName)
			var relativePath	= require('path').relative(codeFolderRoot, sourceFileName)
			// console.assert( relativePath.startWith('..'))
			// console.log('sourceFileName', sourceFileName)
			// console.log('relativePath', relativePath)
			// console.log('codeFolderName', codeFolderName)
			// console.log('codeFolderRoot', codeFolderRoot)

			var dstJSName		= require('path').join(codeFolderName, relativePath)
			var dstFolder		= require('path').dirname(dstJSName)
			doMkdirPSync( dstFolder )
			// console.log('dstFolder', dstFolder, dstJSName)
			// actually write the destination files
			require('fs').writeFileSync(dstJSName, code, 'utf8');
		}else{
			// else output to stdout
			process.stdout.write(code)
		}

		//////////////////////////////////////////////////////////////////////////////////
		//		write the map
		//////////////////////////////////////////////////////////////////////////////////
		if( cmdlineOptions.generateSourceMap ){
			// var content	= ')]}' + JSON.stringify(output.map)
			var content	= JSON.stringify(output.map)
			require('fs').writeFileSync(recastOption.sourceMapName, content, 'utf8');
		}		
	})
})

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

function doMkdirPSync(path, mode){
	if( mode === undefined )	mode	= 0777 & (~process.umask())

// console.log('doMkdirPSync', path)
	try {
		require('fs').mkdirSync(path, mode)
	}catch(error){
		if( error.code === 'ENOENT' ){
			doMkdirPSync( require('path').dirname(path), mode)
			doMkdirPSync(path, mode)
			return
		}else if( error.code === 'EEXIST' ){
			return
		}
		throw error
	}
}