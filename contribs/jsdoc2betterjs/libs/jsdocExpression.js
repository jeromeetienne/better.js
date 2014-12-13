var jsdocExpression	= jsdocExpression	|| {}

if( typeof(window) === 'undefined' )	module.exports	= jsdocExpression;

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
 * @param  {Object} 		jsdocJson - the jsdoc in json
 * @param  {FunctionExpression} functionExpression - the FunctionExpression from the parser associated with the jsdoc
 * @return {CallExpression}     the resulting call expression
 */
jsdocExpression.jsdocJsonFunction2CallExpression	= function(jsdocJson, functionExpression, cmdlineOptions){

	// honor @nobetterjs - return identity
	if( jsdocJson.tags && jsdocJson.tags.nobetterjs )	return functionExpression

	//////////////////////////////////////////////////////////////////////////////////
	//		Build options for better.js depending on jsdocContent
	//////////////////////////////////////////////////////////////////////////////////
	var options	= []

	// honor jsdocJson.params
	if( jsdocJson.params ){
		var argumentsExpressions	= []
		Object.keys(jsdocJson.params).forEach(function(paramName){
			var param	= jsdocJson.params[paramName]
			var expression	= jsdocExpression.jsdocType2Expression(param.type)
			argumentsExpressions.push(expression)
		})

		options.push(builders.property('init', 
			builders.identifier('arguments'), 
			builders.arrayExpression(argumentsExpressions)
		))
	}else{
		// honor cmdlineOptions.strictParams
		if( cmdlineOptions.strictParams === true ){
			// if no @params are defined, specify a empty []
			options.push(builders.property('init', 
				builders.identifier('arguments'), 
				builders.arrayExpression([])
			))					
		}
	}

	// honor cmdlineOptions.strictReturn
	if( jsdocJson.return === undefined && cmdlineOptions.strictReturns === true && jsdocJson.isClass === false ){
		jsdocJson.return	= {
			type		: 'undefined',
			description	: 'default return type for strict'
		}			
	}
	// honor jsdocJson.return
	if( jsdocJson.return ){
		var returnExpression	= jsdocExpression.jsdocType2Expression(jsdocJson.return.type)
		options.push(builders.property('init', 
			builders.identifier('return'), 
			returnExpression
		))
	}

	// if cmdlineOptions.privatizeClass, Enable .private : true by default classes
	if( jsdocJson.isClass && cmdlineOptions.privatizeClasses === true ){
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
 * convert a jsdocContent and the function into a callExpression for react
 * 
 * @param  {Object} 		jsdocJson - the jsdoc in json
 * @param  {assignmentExpression} assignmentExpression - the FunctionExpression from the parser associated with the jsdoc
 * @return {CallExpression}     the resulting call expression
 */
jsdocExpression.jsdocJsonProperty2AssignmentExpression	= function(jsdocJson, assignmentExpression, cmdlineOptions){
	var leftExpression		= assignmentExpression.left
	var rightExpression		= assignmentExpression.right


	// console.log('assignment expression', assignmentExpression.right)

	//////////////////////////////////////////////////////////////////////////////////
	//		test we want to change this assignmentExpression
	//////////////////////////////////////////////////////////////////////////////////

	// honor @nobetterjs - return identity
	if( jsdocJson.tags && jsdocJson.tags.nobetterjs )	return assignmentExpression

	// if leftExpression isnt a 'MemberExpression', return now
	if( leftExpression.type !== 'MemberExpression' )	return assignmentExpression

	// if rightExpression is a 'CallExpression' with 'Better.Function' or 'Better.Class', return now
	// - thus it doesnt conflict with Better.Function
	if( rightExpression.type === 'CallExpression' 
			&& (rightExpression.callee.name === 'Better.Class'
				|| rightExpression.callee.name === 'Better.Function')
			){
		return assignmentExpression
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	var options	= []

	if( jsdocJson.type ){
		var typeExpression	= jsdocExpression.jsdocType2Expression(jsdocJson.type)
		options.push(builders.property('init', 
			builders.identifier('type'), 
			typeExpression
		))				
	}

	options.push(builders.property('init', 
		builders.identifier('value'), 
		rightExpression
	))
	//////////////////////////////////////////////////////////////////////////////////
	//		get objectName and propertyName
	//////////////////////////////////////////////////////////////////////////////////

	// get property name
	var propertyName= null
	if( leftExpression.property.type === 'Identifier' ){
		propertyName	= leftExpression.property.name
	}else if( leftExpression.property.type === 'Literal' ){
		propertyName	= leftExpression.property.value
	}else	console.assert(false)

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var callExpression	= builders.callExpression(
		builders.identifier('Better.Property'),
		[
			leftExpression.object,
			builders.literal(propertyName),
			builders.objectExpression(options),
		]
	)
	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	var newAssignmentExpression	= builders.assignmentExpression(
		assignmentExpression.operator,
		assignmentExpression.left,
		callExpression
	)
	return newAssignmentExpression
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
jsdocExpression.jsdocType2Expression	= function(type){

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////

	// handle the multiple param case
	var hasMultiple	= type.split('|').length > 1 ? true : false 
	if( hasMultiple ){
		var expressions	= []
		type.split('|').forEach(function(type){
			expressions.push( parseOne(type) )
		})
		return builders.arrayExpression(expressions)
	}

	// parse one param
	return parseOne(type)

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
