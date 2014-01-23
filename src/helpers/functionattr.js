/**
 * @fileOverview definition of PropertyAttr - based on other core libraries
 */

var TypeCheck2		= TypeCheck2	|| require('../typecheck2.js');
var PrivateForJS3	= PrivateForJS3	|| require('../privateforjs3.js');

/** 
 * plugin system
 * * seem cool, but you loose all the shortness of closure
 * * so not now
 */
// FunctionAttr.plugins	= {}
// FunctionAttr.plugins['arguments']	= {
// 	onBefore	: function(){
// 		var allowedTypes	= attributes.arguments
// 		console.assert(args.length <= allowedTypes.length, 'function received '+args.length+' parameters but allows only '+allowedTypes.length+'!');
// 		for(var i = 0; i < allowedTypes.length; i++){
// 			var isValid	= TypeCheck2.value(args[i], allowedTypes[i]);
// 			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', allowedTypes[i], 'It is ===', arguments[i])
// 		}		
// 	}
// }
// FunctionAttr.plugins['return']	= {
// 	onAfter		: function(instance, args, returnedValue){
// 		var allowedTypes= attributes.return
// // console.log('blabla', arguments)
// 		var isValid	= TypeCheck2.value(returnedValue, allowedTypes)
// 		console.assert(isValid, 'invalid type for returned value. MUST be of type', allowedTypes, 'It is ===', returnedValue)			
// 	}
// }

/**
 * [FunctionAttr description]
 * 
 * @param {Object} baseObject the base object
 * @param {String} property   the property name
 * @param {Object} attributes the attributes for this property
 */
var FunctionAttr	= function(originalFn, attributes){
	var functionName= attributes.name	|| originalFn.name

	return wrapFunction(originalFn, functionName, function(instance, args){
		// honor .arguments - check arguments type
		if( attributes.arguments !== undefined ){
			var allowedTypes	= attributes.arguments
			console.assert(args.length <= allowedTypes.length, 'function received '+args.length+' parameters but allows only '+allowedTypes.length+'!');
			for(var i = 0; i < allowedTypes.length; i++){
				var isValid	= TypeCheck2.value(args[i], allowedTypes[i]);
				console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', allowedTypes[i], 'It is ===', arguments[i])
			}			
		}
		
		// honor .private
		if( attributes.private === true ){
			// TODO honor .private
			console.assert(false, 'not yet implemented')
		}
	}, function(returnedValue, instance, args){
		// honor .return - check the result type
		if( attributes.return !== undefined ){
			var allowedTypes= attributes.return
	// console.log('blabla', arguments)
			var isValid	= TypeCheck2.value(returnedValue, allowedTypes)
			console.assert(isValid, 'invalid type for returned value. MUST be of type', allowedTypes, 'It is ===', returnedValue)			
		}
	})
	
	return
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	function wrapFunction(originalFn, functionName, onBefore, onAfter){
		// arguments default
		onBefore= onBefore	|| function(/* ... */){}
		onAfter	= onAfter	|| function(/* ... */){}
		var fn	= function SuperName(){
			// notify onBefore
			onBefore(this, arguments)
			// forward the call to original contructor
			var returnedValue	= originalFn.apply(this, arguments);
			// notify onAfter				
			onAfter(returnedValue, this, arguments)
			// actually return the value
			return returnedValue;
		}
		// mechanism to get fn with the propername
		// - see https://github.com/jeromeetienne/creatorpattern.js
		var jsCode	= fn.toString().replace(/SuperName/g, functionName) 
		eval('fn = '+jsCode+';')
		// return the just built function
		return fn
	}
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= FunctionAttr;


