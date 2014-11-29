var recast	= require("recast");
var types	= recast.types;
var namedTypes	= types.namedTypes;
var builders	= types.builders;

var jsdocParse	= require('./jsdocParse.js')

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * convert a jsdocContent and the function into a callExpression for react
 * 
 * @param  {String} 		jsdocContent - the actual jsdoc comment
 * @param  {FunctionExpression} functionExpression - the FunctionExpression from the parser associated with the jsdoc
 * @return {CallExpression}     the resulting call expression
 */
function jsContent2CallExpression(jsdocContent, functionExpression){

	// get json version of jsdocContent
	var jsdocJson	= jsdocParse.parseJsdoc( jsdocContent )

	//////////////////////////////////////////////////////////////////////////////////
	//		Build options for better.js depending on jsdocContent
	//////////////////////////////////////////////////////////////////////////////////
	var options	= []

	// honor jsdocJson.params
	if( jsdocJson.params ){
		var argumentsExpressions	= []
		Object.keys(jsdocJson.params).forEach(function(paramName){
			var param	= jsdocJson.params[paramName]
			var expression	= jsdocParam2Expression(param)
			argumentsExpressions.push(expression)
		})

		options.push(builders.property('init', 
			builders.identifier('arguments'), 
			builders.arrayExpression(argumentsExpressions)
		))
	}
	// honor jsdocJson.return
	if( jsdocJson.return ){
		var returnExpression	= jsdocParam2Expression(jsdocJson.return)
		options.push(builders.property('init', 
			builders.identifier('return'), 
			returnExpression
		))
	}

	// Enable .private : true by default classes
	if( jsdocJson.isClass ){
		options.push(builders.property('init', 
			builders.identifier('private'), 
			builders.literal(true)
		))		
	}

	// if there is no options to add, it means the jsdoc cant be used, do nothing
	if( options.length === 0 )	return functionExpression

	//////////////////////////////////////////////////////////////////////////////////
	//		build callExpression
	//////////////////////////////////////////////////////////////////////////////////

	var callIdentifier	= jsdocJson.isClass ? 'Better.Class' : 'Better.Function'
	var callExpression	= builders.callExpression(
		builders.identifier(callIdentifier),
		[
			functionExpression,
			builders.objectExpression(options)
		]
	)

	//////////////////////////////////////////////////////////////////////////////////
	//		return callExpression
	//////////////////////////////////////////////////////////////////////////////////
	return callExpression
}




//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * convert a parsed jsdocJson @param into a Expression for the parser
 * 
 * @param  {Object}	param - the @param parsed in jsdocJson
 * @return {Expression} the built expression
 */
function jsdocParam2Expression(param){

	var hasMultiple	= param.type.split('|').length > 1 ? true : false 
	if( hasMultiple ){
		var expressions	= []
		param.type.split('|').forEach(function(type){
			expressions.push( parseOne(type) )
		})
		return builders.arrayExpression(expressions)
	}

	return parseOne(param.type)

	//////////////////////////////////////////////////////////////////////////////////
	//		utility functions
	//////////////////////////////////////////////////////////////////////////////////

	/**
	 * parse one type. aka do not support multiple type
	 * 
	 * @param  {String}	type - the type string as found in the jsdoc comment @param
	 * @return {Expression}	the expression to put in the parser tree
	 */
	function parseOne(type){
		console.assert(type.match(/\|/) === null)
		// console.dir(param)
		if( type.toLowerCase() === 'string' ){
			var expression	= builders.identifier('String')	
		}else if( type.toLowerCase() === 'number' ){
			var expression	= builders.identifier('Number')	
		}else if( type.toLowerCase() === 'undefined' ){
			var expression	= builders.identifier('undefined')	
		}else{
			var expression	= builders.identifier( type )	
		}

		return expression

	}
}

//////////////////////////////////////////////////////////////////////////////////
//		exports
//////////////////////////////////////////////////////////////////////////////////

// export the module
module.exports	= {
	jsdocParam2Expression	: jsdocParam2Expression,
	jsContent2CallExpression: jsContent2CallExpression
}
