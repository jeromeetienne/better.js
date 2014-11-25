var jsDoced	= jsDoced	|| {}

/**
 * Extract jsdoc comment just above the bottomLine in the file at url
 * 
 * @param  {String} url        the url to load
 * @param  {Number} bottomLine the line number just below the comment
 * @return {String}            the content of jsdoc comment
 */
jsDoced.extractJsdoc	= function(url, bottomLine){
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
