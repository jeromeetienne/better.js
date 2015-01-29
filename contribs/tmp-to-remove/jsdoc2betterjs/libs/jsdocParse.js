var jsdocParse	= jsdocParse	|| {}



if( typeof(window) === 'undefined' )	module.exports	= jsdocParse;


/**
 * parse jsdoc comment and return a 'json-ified' version of it
 * 
 * @param  {String} jsdocContent String containing the content
 * @return {Object} the json object
 */
jsdocParse.parseJsdoc	= function(jsdocContent){
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
				type		: canonizeType(paramType),
				description	: paramDescription
			}
		}else if( tagName === 'return' ||  tagName === 'returns' ){
			var matches	= line.match(/^@([^\s]+)\s+{([^\s]+)}\s+(.*)$/)
			// console.log('matches', matches )
			console.assert(matches.length === 4)
			var paramType		= matches[2]
			var paramDescription	= matches[3]
			output.return		= {
				type		: canonizeType(paramType),
				description	: paramDescription
			}
		}else if( tagName === 'type' ){
			var matches	= line.match(/^@([^\s]+)\s+{([^\s]+)}(.*)$/)
			// console.log('matches', matches )
			console.assert(matches.length === 4)
			var paramType		= matches[2]
			output.type		= canonizeType(paramType)
		}else{
			output.tags		= output.tags	|| {}
			output.tags[tagName]	= true
			// console.assert(false)
			// console.warn('unhandled tag tagName', tagName)
			// }else if( tagName.toLowerCase() === 'return' ){
		}
	})

	/**
	 * canonize a @type.
	 * - it handles a good subset of http://usejsdoc.org/tags-type.html
	 * 
	 * @param  {String} type - the type as a string from jsdoc
	 * @return {String}      The type as a string for better.js
	 */
	function canonizeType(type){

		//////////////////////////////////////////////////////////////////////////////////
		//		Comments
		//////////////////////////////////////////////////////////////////////////////////

		// handle the multiple param case
		var hasMultiple	= type.split('|').length > 1 ? true : false 
		if( hasMultiple ){
			var canonizedType	= ''
			type.split('|').forEach(function(type, index){
				if( index > 0 )	canonizedType	+= '|'
				canonizedType	+= processOne(type)
			})
			return canonizedType
		}

		// parse one param
		return processOne(type)

		/**
		 * process one @type
		 * 
		 * @param  {String} paramType - the type as a string from jsdoc
		 * @return {String}           The type as a string for better.js
		 */
		function processOne(paramType){		
			if( paramType.toLowerCase() === 'function' )	return 'Function'
			if( paramType.toLowerCase() === 'object' )	return 'Object'
			if( paramType.toLowerCase() === 'boolean' )	return 'Boolean'
			if( paramType.toLowerCase() === 'number' )	return 'Number'
			if( paramType.toLowerCase() === 'date' )	return 'Date'
			if( paramType.toLowerCase() === 'array' )	return 'Array'

			// from http://usejsdoc.org/tags-type.html

			// honor "@type {?Number} - an number or null"
			// - return Number|null
			if( paramType[0] === '?' )	return canonizeType(paramType.slice(1))+'|null'
			// honor "@type {!Number} - an number but never null"
			// - return Number|"nonnull"
			if( paramType[0] === '!' )	return canonizeType(paramType.slice(1))+'|"nonnull"'
			// honor "@type {Number[]} - an array of number"
			if( paramType.match(/\[\]$/) )	return 'Array'
			// honor "@type {Array.<Number>} - an array of number"
			if( paramType.match(/^Array\./i) )	return 'Array'
			// honor "@type {Number=} - an option number"
			if( paramType.match(/=$/i) )	return canonizeType(paramType.slice(0,-1))+'|undefined'

			return paramType
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		post processing 
	//////////////////////////////////////////////////////////////////////////////////

	// honor output.isClass
	var hasConstructor	= Object.getOwnPropertyNames(output.tags).indexOf('constructor') !== -1 ? true : false
	var hasClass		= output.tags.class	? true : false 
	output.isClass	= ( hasClass || hasConstructor ) ? true : false

	// honor "@param {String} [myString] - this is a optional string"
	Object.keys(output.params).slice(0).forEach(function(paramName){
		// test if it is a optional parameter
		var matches	= paramName.match(/^\[(.*)\]$/);
		if( matches === null )	return
		// README: here the @param changes of paramName as we remove the []
		var newName	= matches[1]
		// recreate param with new name
		output.params[newName]	= output.params[paramName]
		output.params[newName].type	= output.params[newName].type + '|undefined'
		// delete old param
		delete	output.params[paramName]
	})

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
/**
 * [extractJsdocContent description]
 * @param  {String[]} 	lines      [description]
 * @param  {Number}	bottomLine [description]
 * @return {Object|null}           [description]
 */
jsdocParse.extractJsdocContent	= function(lines, bottomLine){
	console.assert(bottomLine >= 0)
// console.log('jsdocParse.extractJsdocContent', arguments)
	var lineEnd	= bottomLine-1

// console.assert(false)
// console.log('lineEnd', lineEnd)
	// skip blank lines
	while( lineEnd >= 0 && lines[lineEnd].match(/^\s*$/) !== null ){
		lineEnd -- 
		// console.log('skip')
	}

	if( lineEnd < 0 )	return null		

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

/**
 * extract jsdoc and return it as json
 * 
 * @param  {String[]} 	lines      [description]
 * @param  {Number}	bottomLine [description]
 * @return {Object|null}           [description]
 */
jsdocParse.extractJsdocJson	= function(lines, bottomLine){
	// get jsdocContent
	var jsdocContent	= jsdocParse.extractJsdocContent(lines, bottomLine)
	// if no jsdocContent, do nothing
	if( jsdocContent === null )	return null

	// get json version of jsdocContent
	var jsdocJson	= jsdocParse.parseJsdoc( jsdocContent )

	return jsdocJson
}
