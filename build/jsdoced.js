
var JSDOCED	= JSDOCED	|| {}

/**
 * Extract jsdoc comment just above the bottomLine in the file at url
 * 
 * @param  {String} url        the url to load
 * @param  {Number} bottomLine the line number just below the comment
 * @return {String}            the content of jsdoc comment
 */
JSDOCED.extractJsdoc	= function(url, bottomLine){
	var jsdocContent;
	// load url
	var request = new XMLHttpRequest();
	request.onload = function(){
		var content	= request.responseText
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
		
		jsdocContent	= lines.slice(lineStart, lineEnd+1).join('\n')
		// console.log('jsdocContent', jsdocContent)


	};
	request.open("get", url, false);
	request.send();

	// console.log('returning')
	console.assert( jsdocContent )
	return jsdocContent
}
var JSDOCED	= JSDOCED	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		jsdocToBetterFunction
//////////////////////////////////////////////////////////////////////////////////
JSDOCED.jsdocToBetterFunction	= function(output){
	var options	= {}

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments
	//////////////////////////////////////////////////////////////////////////////////
	options.arguments	= []
	Object.keys(output.params).forEach(function(paramName){
		var param	= output.params[paramName]
		var argument	= jsdocToBetterjs(param.type)
		options.arguments.push(argument)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		arguments
	//////////////////////////////////////////////////////////////////////////////////
	if( output.return ){
		options.return		= jsdocToBetterjs(output.return.type)
	}

	return options

	function jsdocToBetterjs(type){
		if( type.toLowerCase() === 'number' ){
			return Number
		}else	console.warn('unhandled type', type)

		return undefined
	}
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

	var output	= {}

	//////////////////////////////////////////////////////////////////////////////////
	//		Description	//////////////////////////////////////////////////////////////////////////////////
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
	output.params	= {}
	lines.forEach(function(line){
		// console.log('line', line)
		// console.log('tag line', line.match(/^@/))
		if( line.match(/^@/) === null )	return
		var matches	= line.match(/^@([^\s])+/)
		// console.log('matches', matches)
		var tagName	= matches[0].replace(/^@/, '')
		// console.log('tagName', tagName )
		if( tagName.toLowerCase() === 'param' ){
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
		}else if( tagName.toLowerCase() === 'return' ){
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
			// console.assert(false)
			console.warn('unhandled tag tagName', tagName)
		}
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	// return output
	return output
}
var JSDOCED	= JSDOCED	|| {}

JSDOCED.Function	= function(originalFct){
	// console.log('prout')
	
	var stackFrame	= Better.stack()[1]
	var jsdocContent= JSDOCED.extractJsdoc(stackFrame.url, stackFrame.line)
	// console.log('jsdocContent', jsdocContent)

	var output	= JSDOCED.parseJsdoc(jsdocContent)
	// console.log('output')
	// console.log(JSON.stringify(output, null, '\t'))

	var options	= JSDOCED.jsdocToBetterFunction(output)
	// console.log('options')
	// console.dir(options)

	var betterFct	= Better.Function(originalFct, options)

	return betterFct
}
var JSDOCED	= JSDOCED	|| {}

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