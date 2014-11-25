
/**
 * @todo do a Function.prototype.version
 * @todo do a jsDoced.Class() to force the generation of Class (instead of relying on @constructor)
 * @todo same for the jsDoced.Function for consistency
 */


var jsDoced	= function(originalFct, options){
	// default value for arguments
	options	= options	|| {}

	// console.log('prout')

	var jsdocJSON	= options.jsdocJSON
	if( jsdocJSON === undefined ){
		// find caller location and extract jsdoc from it
		var stackFrame	= Better.stack()[1]

		// TODO isstackFrame.url === 'repl'
		// the jsdoced is run inside the node.js interpreter
		// there is nothing to download
		// handle this case

		var jsdocContent= jsDoced.extractJsdoc(stackFrame.url, stackFrame.line)
		var jsdocJSON	= jsDoced.parseJsdoc(jsdocContent)
	}

	if( jsdocJSON.isClass ){
		var attributes	= jsDoced.jsdocToBetterClass(jsdocJSON)
		var betterClass	= Better.Class(originalFct, attributes)
		return betterClass
	}

	var attributes	= jsDoced.jsdocToBetterFunction(jsdocJSON)
	var betterFct	= Better.Function(originalFct, attributes)
	return betterFct
}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= jsDoced;

if( typeof(window) === 'undefined' )	var Better	= require('../../../build/better.js')


//////////////////////////////////////////////////////////////////////////////////
//		Helpers
//////////////////////////////////////////////////////////////////////////////////

// /**
//  * it is the same as ```jsDoced.Function``` but overloaded in Function.prototype
//  */
// Function.prototype.jsDoced	= function(){
// 	var originalFct	= this

// 	// find caller location
// 	var stackFrame	= Better.stack()[1]

// 	// extract jsdoc from called location 
// 	var fctNLines	= originalFct.toString().split('\n').length
// 	var jsdocContent= jsDoced.extractJsdoc(stackFrame.url, stackFrame.line - fctNLines + 1)
// 	var jsdocJSON	= jsDoced.parseJsdoc(jsdocContent)

// 	// call the actual jsDoced()
// 	var newFct	= jsDoced(originalFct, {
// 		jsdocJSON	: jsdocJSON
// 	})
// 	// return the jsdoced function
// 	return newFct
// }

var jsDoced	= jsDoced	|| {}

/**
 * Extract jsdoc comment just above the bottomLine in the file at url
 * 
 * @param  {String} url        the url to load
 * @param  {Number} bottomLine the line number just below the comment
 * @return {String}            the content of jsdoc comment
 */
jsDoced.extractJsdoc	= function(url, bottomLine){
	// return the cached jsdocContent if any
	var inBrowser 	= typeof(window) !== 'undefined'	? true : false
	var cache	= jsDoced.extractJsdoc.cache

	if( cache[url] !== undefined ){
		var content	= cache[url]
	}else if( inBrowser ){
		// load url via sync url
		var request = new XMLHttpRequest();
		var content;
		request.onload = function(){
			content		= request.responseText
		};
		request.open("get", url, false);
		request.send();
	}else{
		// load file sync
		var content	= require('fs').readFileSync(url, 'utf8')
	}

	// write content in cache
	cache[url]	= content

	// get jsdocContent from file content
	var jsdocContent= parseFileContent(content)
	
	return jsdocContent

	function parseFileContent(content){
		var lines	= content.split('\n')
		// console.log('loaded')


		var lineEnd	= bottomLine-2
		for(var lineStart = lineEnd;lineStart >= 0; lineStart--){
			var line	= lines[lineStart]
			// console.log('lineStart', lineStart)
			// console.log('line ('+line+')')
			var matches	= line.match(/^\s*\/\*\*\s*$/)
			var isJsdocHead	= matches !== null ? true : false
			// console.log('matches', matches)
			// console.log('isJsdocHead', isJsdocHead)
			if( isJsdocHead === true )	break
		}
		
		var jsdocContent	= lines.slice(lineStart, lineEnd+1).join('\n')
		return jsdocContent
	}
}

jsDoced.extractJsdoc.cache	= {}
var jsDoced	= jsDoced	|| {}

jsDoced.jsdocToBetterType	= function(type){
	if( type.toLowerCase() === 'number' ){
		return Number
	}else if( type.toLowerCase() === 'string' ){
		return String
	}else	console.warn('unhandled type', type)

	return undefined
}
//////////////////////////////////////////////////////////////////////////////////
//		jsdocToBetterFunction
//////////////////////////////////////////////////////////////////////////////////
jsDoced.jsdocToBetterClass	= function(jsdocJSON){
	var convertType	= jsDoced.jsdocToBetterType
	var options	= {}

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments
	//////////////////////////////////////////////////////////////////////////////////
	options.arguments	= []
	Object.keys(jsdocJSON.params).forEach(function(paramName){
		var param	= jsdocJSON.params[paramName]
		var argument	= convertType(param.type)
		options.arguments.push(argument)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		privatize
	//////////////////////////////////////////////////////////////////////////////////

	options.privatize	= true
	//////////////////////////////////////////////////////////////////////////////////
	//		privatize
	//////////////////////////////////////////////////////////////////////////////////

	return options
}


//////////////////////////////////////////////////////////////////////////////////
//		jsdocToBetterFunction
//////////////////////////////////////////////////////////////////////////////////
jsDoced.jsdocToBetterFunction	= function(jsdocJSON){
	var convertType	= jsDoced.jsdocToBetterType
	var options	= {}

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments
	//////////////////////////////////////////////////////////////////////////////////
	options.arguments	= []
	Object.keys(jsdocJSON.params).forEach(function(paramName){
		var param	= jsdocJSON.params[paramName]
		var argument	= convertType(param.type)
		options.arguments.push(argument)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments
	//////////////////////////////////////////////////////////////////////////////////
	if( jsdocJSON.return ){
		options.return		= convertType(jsdocJSON.return.type)
	}

	return options
}
var jsDoced	= jsDoced	|| {}

/**
 * parse jsdoc comment and return a 'json-ified' version of it
 * 
 * @param  {String} jsdocContent String containing the content
 * @return {Object} the json object
 */
jsDoced.parseJsdoc	= function(jsdocContent){
	var lines	= jsdocContent.split('\n')

	// remove first and last line
	lines.pop()
	lines.shift()

	// remove leading ```*``` if any
	for(var i = 0; i < lines.length; i++){
		lines[i]	= lines[i].replace(/^(\s*\*\s*)/, '')
	}

	var output	= {
		params	: {},
		tags	: {},
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		Description
	//////////////////////////////////////////////////////////////////////////////////
	for(var i = 0; i < lines.length; i++){
		var line	= lines[i]
		var matches	= line.match(/^@([^\s])+/)
		if( matches !== null )	continue
		if( output.description === undefined ){
			output.description	= ''
		}
		output.description	+= line.trim()
	}


	//////////////////////////////////////////////////////////////////////////////////
	//		Tags
	//////////////////////////////////////////////////////////////////////////////////
	lines.forEach(function(line){
		// console.log('line', line)
		// console.log('tag line', line.match(/^@/))
		if( line.match(/^@/) === null )	return
		var matches	= line.match(/^@([^\s])+/)
		// console.log('matches', matches)
		var tagName	= matches[0].replace(/^@/, '').toLowerCase()

		// console.log('tagName', tagName )
		if( tagName === 'param' ){
			var matches	= line.match(/^@([^\s]+)\s+{([^\s]+)}\s+([^\s]+)\s+(.*)$/)
			// console.log('matches', matches )
			console.assert(matches.length === 5)
			var paramType		= matches[2]
			var paramName		= matches[3]
			var paramDescription	= matches[4]
			output.params[paramName]	= {
				type		: paramType,
				description	: paramDescription
			}
		}else if( tagName === 'return' ){
			var matches	= line.match(/^@([^\s]+)\s+{([^\s]+)}\s+(.*)$/)
			// console.log('matches', matches )
			console.assert(matches.length === 4)
			var paramType		= matches[2]
			var paramDescription	= matches[3]
			output.return		= {
				type		: paramType,
				description	: paramDescription
			}
		}else{
			output.tags		= output.tags	|| {}
			output.tags[tagName]	= true
			// console.assert(false)
			// console.warn('unhandled tag tagName', tagName)
			// }else if( tagName.toLowerCase() === 'return' ){
		}
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		add meta info in output 
	//////////////////////////////////////////////////////////////////////////////////


	var hasConstructor	= Object.getOwnPropertyNames(output.tags).indexOf('constructor') !== -1 ? true : false
	var hasClass		= output.tags.class	? true : false 

	output.isClass	= ( hasClass || hasConstructor ) ? true : false


	// remove output.params if it is empty
	if( Object.keys(output.params).length === 0 )	delete output.params
	// remove output.tags if it is empty
	if( Object.keys(output.tags).length === 0 )	delete output.tags

	// return output
	return output
}
