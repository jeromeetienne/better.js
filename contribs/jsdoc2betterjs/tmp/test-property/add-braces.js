#!/usr/bin/env node

var recast      = require("recast");
var types       = recast.types;
var namedTypes  = types.namedTypes;
var builders    = types.builders;

require("recast").run(function(ast, callback) {
	recast.visit(ast, {
		visitIfStatement: function(path) {
			var statement		= path.node;
			statement.consequent	= fix(statement.consequent);
			
			var alternate		= statement.alternate;
			if (namedTypes.IfStatement.check(alternate)) {
				statement.alternate	= fix(alternate);
			}
			
			this.traverse(path);
		},
		
		visitWhileStatement	: visitLoop,
		visitForStatement	: visitLoop,
		visitForInStatement	: visitLoop
	});
	
	callback(ast);
});

function visitLoop(path) {
	var loop	= path.node;
	loop.body	= fix(loop.body);
	this.traverse(path);
}

function fix(clause) {
	if( clause ){
		if( !namedTypes.BlockStatement.check(clause) ){
			clause = builders.blockStatement( [clause] );
		}
	}
	return clause;
}
