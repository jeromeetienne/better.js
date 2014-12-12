var recast      = require("recast");
var types       = recast.types;
var namedTypes  = types.namedTypes;
var builders    = types.builders;

var jsdocParse	= require('../../utils/jsdocParse.js')
var jsdocExpr	= require('../../utils/jsdocExpression.js')

// read the content
// - it is used to parse the jsdoc parts more easily
var filename	= process.argv[2]
var content	= require('fs').readFileSync(filename, 'utf8')
var contentLines= content.split('\n')

require("recast").run(function(ast, callback) {
	recast.visit(ast, {
		// visitVariableDeclaration: function(path){
		// 	console.log('assignement declaration')
		// 	this.traverse(path);
		// },
		visitAssignmentExpression: function(path){
			this.traverse(path);

			// assign some variables
			var assignementExpression	= path.node;
			var leftExpression		= assignementExpression.left
			var rightExpression		= assignementExpression.right

			// console.log('assignment expression', assignementExpression.left)

			//////////////////////////////////////////////////////////////////////////////////
			//		Comment								//
			//////////////////////////////////////////////////////////////////////////////////
			// if leftExpression isnt a 'MemberExpression', return now
			if( leftExpression.type !== 'MemberExpression' )	return

			//////////////////////////////////////////////////////////////////////////////////
			//		Comment								//
			//////////////////////////////////////////////////////////////////////////////////
			// get jsdocContent for this node
			var lineNumber		= path.value.loc.start.line-1
			var jsdocContent	= jsdocParse.extractJsdocContent(contentLines, lineNumber)
			// if no jsdocContent, do nothing
			if( jsdocContent === null )	return

			// get json version of jsdocContent
			var jsdocJson	= jsdocParse.parseJsdoc( jsdocContent )

			//////////////////////////////////////////////////////////////////////////////////
			//		Comment								//
			//////////////////////////////////////////////////////////////////////////////////

			var options	= []

			if( jsdocJson.type ){
				var typeExpression	= jsdocExpr.jsdocParam2Expression(jsdocJson.type)
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
			// get object name
			console.assert( leftExpression.object.type === 'Identifier' )
			var objectName	= leftExpression.object.name

			// get property name
			var propertyName= null
			if( leftExpression.property.type === 'Identifier' ){
				propertyName	= leftExpression.property.name
			}else if( leftExpression.property.type === 'Literal' ){
				propertyName	= leftExpression.property.value
			}else	console.assert(false)

			// console.log('objectName', objectName+'.'+propertyName)

			//////////////////////////////////////////////////////////////////////////////////
			//		Comment								//
			//////////////////////////////////////////////////////////////////////////////////
			var callExpression	= builders.callExpression(
				builders.identifier('Better.Property'),
				[
					builders.identifier(objectName),
					builders.literal(propertyName),
					builders.objectExpression(options),
				]
			)
			assignementExpression.right	= callExpression
		},
	});
	
	callback(ast);
});
