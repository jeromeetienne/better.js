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
