#!/usr/bin/env node

var filename	= process.argv[2];
var cmdline	= "cat \'"+filename+"\'  | tr \"\\t\" ' ' | dox"
var child	= require('child_process').exec(cmdline, function (error, stdout, stderr) {
	var output	= JSON.parse(stdout);
	output.forEach(function(item){
		if( item.ctx.type === 'function' || item.ctx.type === 'method' ){
			handleCtxTypeFunction(item)
		}else if( item.ctx.type === 'property' ){
			handleCtxTypeProperty(item)			
		}
	})
})


function filterTags(item, tagType){
	// handle parameter polymorphism
	if( tagType instanceof Array === false )	tagType	= [tagType];
	return item.tags.filter(function(tag){
		return tagType.indexOf(tag.type) !== -1; 
	});
}


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//		PropertyAttr.js							//
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

/**
 * produce debug.js code for method/function
 * - @type - honor variable type with typecheck.js
 *   - http://code.google.com/p/jsdoc-toolkit/wiki/TagType
 * - @private honor public/private visibility with privateforjs.js
 *   - http://code.google.com/p/jsdoc-toolkit/wiki/TagPrivate
 * - @deprecated http://code.google.com/p/jsdoc-toolkit/wiki/TagDeprecated
 * - honor any other you can
 */
function handleCtxTypeProperty(item){
	// build the output	
	var output	= ''
	output		+= 'PropertyAttr.define('+item.ctx.receiver+', "'+item.ctx.name +'")\n';
	output		+= handlePropertyAttrTypeCheck(item);
	output		+= handlePropertyAttrPrivate(item)
	if( output[output.length-1] === '\n' )	output	= output.slice(0,-1);	
	output		+= ';';
	console.log(output);
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * - http://code.google.com/p/jsdoc-toolkit/wiki/TagType
 */
function handlePropertyAttrTypeCheck(item){
	var tagType	= filterTags(item, 'type');
	// get paramsType
	// - http://code.google.com/p/jsdoc-toolkit/wiki/TagParam
	var types	= "[]";
	tagType.forEach(function(tag, idx){
		types	= '['+tag.types.join(',') + ']';
	})
	// build the output	
	var output	= '\t.typeCheck('+types+')\n';
	// return the built output
	return output;
}


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

function handlePropertyAttrPrivate(item){
	var tagsPrivate	= filterTags(item, 'private');
	var tagsPublic	= filterTags(item, 'public');
	var isPrivate	= tagsPrivate.length > 0 || 
				(item.ctx.name.match(/^_/) && tagsPublic.length === 0);
	// build the output	
	var output	= isPrivate ? '\t.private('+item.ctx.receiver+')\n' : '';
	// return the built output
	return output;
}


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//		FunctionAttr.js							//
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

/**
 * produce debug.js code for method/function
 * - @param/@return - honor variable types with typecheck.js
 *   - http://code.google.com/p/jsdoc-toolkit/wiki/TagParam
 *   - http://code.google.com/p/jsdoc-toolkit/wiki/TagReturns
 * - @private honor public/private visibility with privateforjs.js
 *   - http://code.google.com/p/jsdoc-toolkit/wiki/TagPrivate
 * - @deprecated http://code.google.com/p/jsdoc-toolkit/wiki/TagDeprecated
 * - honor any other you can
 */
function handleCtxTypeFunction(item){
	// sanity check
	console.assert( item.ctx.type === 'function' || item.ctx.type === 'method' );
	// build function name
	var fnName	= item.ctx.name;
	fnName		= item.ctx.string.match(/(.*)\(/)[1];

	// build the output	
	var output	= ''
	output		+= fnName + ' = FunctionAttr.define(' +fnName+ ', "'+item.ctx.type +' '+fnName+'")\n';
	output		+= handleFunctionAttrTypeCheck(item);
	output		+= handleFunctionAttrDeprecated(item)
	output		+= handleFunctionAttrPrivate(item)
	output		+= '\t.done();';
	
	console.log(output);
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

function handleFunctionAttrPrivate(item){
	var tagsPrivate	= filterTags(item, 'private');
	var tagsPublic	= filterTags(item, 'public');
	var isPrivate	= tagsPrivate.length > 0 || 
				(item.ctx.name.match(/^_/) && tagsPublic.length === 0);
	var output	= isPrivate ? '\t.private('+item.ctx.constructor+')\n' : '';
	// return the built output
	return output;
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

function handleFunctionAttrDeprecated(item){
	var tagDeprecated	= filterTags(item, 'deprecated');
	var output		= "";
	tagDeprecated.forEach(function(tag, idx){
		output	= '\t.deprecated()\n';
	})
	// return the built output
	return output;
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * - http://code.google.com/p/jsdoc-toolkit/wiki/TagParam
 * - http://code.google.com/p/jsdoc-toolkit/wiki/TagReturns
 */
function handleFunctionAttrTypeCheck(item){
	var tagParams	= filterTags(item, 'param');
	var tagReturns	= filterTags(item, ['returns', 'return']);
	// get paramsType
	// - http://code.google.com/p/jsdoc-toolkit/wiki/TagParam
	var paramsTypes	= "[";
	tagParams.forEach(function(tag, idx){
		paramsTypes	+= idx > 0 ? ',' : '';
		paramsTypes	+= '['+tag.types.join(',') + ']';
	})
	paramsTypes	+= "]"

	// get returnTypes
	// - http://code.google.com/p/jsdoc-toolkit/wiki/TagReturns
	var returnTypes	= "[]";
	tagReturns.forEach(function(tag, idx){
		returnTypes	= '['+tag.types.join(',') + ']';
	})

	// build the output	
	var output	= '';
	output	+= '\t.typeCheck('+paramsTypes+', '+returnTypes+')\n';
	// return the built output
	return output;
}

