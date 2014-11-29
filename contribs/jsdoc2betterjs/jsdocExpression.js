var recast	= require("recast");
var types	= recast.types;
var namedTypes	= types.namedTypes;
var builders	= types.builders;

var jsdocParse	= require('./jsdocParse.js')

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
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
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
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

module.exports	= {
	jsdocParam2Expression	: jsdocParam2Expression,
	jsContent2CallExpression: jsContent2CallExpression
}
