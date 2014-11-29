var jsDoced	= jsDoced	|| {}



if( typeof(window) === 'undefined' )	module.exports	= jsDoced;


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


//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
jsDoced.extractJsdocContent	= function(lines, bottomLine){
	var lineEnd	= bottomLine-1
// console.assert(false)
// console.log('lineEnd', lineEnd)
	// skip blank lines
	while( lineEnd >= 0 && lines[lineEnd].match(/^\s*$/) !== null ){
		lineEnd -- 
		console.log('skip')
	}		

// console.log('lineEnd', lineEnd, lines[lineEnd])
	// check if it is the signature end
	if( lines[lineEnd].match(/\*\/\s*$/) === null )	return null

	for(var lineStart = lineEnd;lineStart >= 0; lineStart--){
		var line	= lines[lineStart]
		var matches	= line.match(/^\s*\/\*\*\s*$/)
		var isJsdocHead	= matches !== null ? true : false
		if( isJsdocHead === true )	break
	}
	if( lineEnd <= lineStart )	return null
	var jsdocContent	= lines.slice(lineStart, lineEnd+1).join('\n')
	return jsdocContent
}
