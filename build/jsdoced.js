
var JSDOCED	= JSDOCED	|| {}

/**
 * Extract jsdoc comment just above the bottomLine in the file at url
 * 
 * @param  {String} url        the url to load
 * @param  {Number} bottomLine the line number just below the comment
 * @return {String}            the content of jsdoc comment
 */
JSDOCED.extractJsdoc	= function(url, bottomLine){
	var inBrowser 	= typeof(window) !== 'undefined'	? true : false
	if( inBrowser ){
		// load url
		var request = new XMLHttpRequest();
		var jsdocContent;
		request.onload = function(){
			var content	= request.responseText
			jsdocContent	= parseFileContent(content)
		};
		request.open("get", url, false);
		request.send();
	}else{
		// load file sync
		var content	= require('fs').readFileSync(url, 'utf8')
		var jsdocContent= parseFileContent(content)
	}

	// console.log('returning')
	console.assert( jsdocContent )
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
var JSDOCED	= JSDOCED	|| {}

JSDOCED.jsdocToBetterType	= function(type){
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
JSDOCED.jsdocToBetterClass	= function(output){
	var convertType	= JSDOCED.jsdocToBetterType
	var options	= {}

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments
	//////////////////////////////////////////////////////////////////////////////////
	options.arguments	= []
	Object.keys(output.params).forEach(function(paramName){
		var param	= output.params[paramName]
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
JSDOCED.jsdocToBetterFunction	= function(output){
	var convertType	= JSDOCED.jsdocToBetterType
	var options	= {}

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments
	//////////////////////////////////////////////////////////////////////////////////
	options.arguments	= []
	Object.keys(output.params).forEach(function(paramName){
		var param	= output.params[paramName]
		var argument	= convertType(param.type)
		options.arguments.push(argument)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments
	//////////////////////////////////////////////////////////////////////////////////
	if( output.return ){
		options.return		= convertType(output.return.type)
	}

	return options
}
var JSDOCED	= JSDOCED	|| {}

/**
 * parse jsdoc comment and return a 'json-ified' version of it
 * 
 * @param  {String} jsdocContent String containing the content
 * @return {Object} the json object
 */
JSDOCED.parseJsdoc	= function(jsdocContent){
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
/**
 * @todo do a Function.prototype.version
 * @todo do a jsDoced.Class() to force the generation of Class (instead of relying on @constructor)
 * @todo same for the jsDoced.Function for consistency
 */


var jsDoced	= function(originalFct){
	// console.log('prout')
	
	var stackFrame	= Better.stack()[1]
	var jsdocContent= JSDOCED.extractJsdoc(stackFrame.url, stackFrame.line)
	// console.log('jsdocContent', jsdocContent)

	var output	= JSDOCED.parseJsdoc(jsdocContent)

	if( output.isClass ){
		var attributes	= JSDOCED.jsdocToBetterClass(output)
		var betterClass	= Better.Class(originalFct, attributes)
		return betterClass
	}else{
		var attributes	= JSDOCED.jsdocToBetterFunction(output)
		var betterFct	= Better.Function(originalFct, attributes)
		return betterFct
	}
	console.assert(false, 'this point should not be reached')
}



// /**
//  * it is the same as ```JSDOCED.Function``` but overloaded in Function.prototype
//  */
// Function.prototype.jsdocedFunction	= function(){
// 	var originalFct	= this

// 	// find caller location
// 	var stackFrame	= Better.stack()[1]

// 	// extract jsdoc from called location 
// 	var fctNLines	= originalFct.toString().split('\n').length
// 	var jsdocContent= JSDOCED.extractJsdoc(stackFrame.url, stackFrame.line - fctNLines + 1)

// 	var output	= JSDOCED.parseJsdoc(jsdocContent)

// 	var options	= JSDOCED.jsdocToBetterFunction(output)

// 	var betterFct	= Better.Function(originalFct, options)

// 	return betterFct
// }