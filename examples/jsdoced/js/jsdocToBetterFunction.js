
//////////////////////////////////////////////////////////////////////////////////
//		jsdocToBetterFunction
//////////////////////////////////////////////////////////////////////////////////
function jsdocToBetterFunction(output){
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


//////////////////////////////////////////////////////////////////////////////////
//		parseJsdoc
//////////////////////////////////////////////////////////////////////////////////
function parseJsdoc(jsdocContent){
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
