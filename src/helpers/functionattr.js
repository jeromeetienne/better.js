/**
 * @fileOverview definition of PropertyAttr - based on other core libraries
 */

var StrongTyping= StrongTyping	|| require('../strongtyping.js');
var Privatize	= Privatize	|| require('../privatize.js');

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
// 			var isValid	= StrongTyping.value(args[i], allowedTypes[i]);
// 			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', allowedTypes[i], 'It is ===', arguments[i])
// 		}		
// 	}
// }
// FunctionAttr.plugins['return']	= {
// 	onAfter		: function(instance, args, returnedValue){
// 		var allowedTypes= attributes.return
// // console.log('blabla', arguments)
// 		var isValid	= StrongTyping.value(returnedValue, allowedTypes)
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
	
	// to honor .private
	var privateDone	= false

	return wrapFunction(originalFn, functionName, function(instance, args){
		// honor .private
		// TODO to change, this wait for the first call.... this is crappy
		// make it such as 'instance' MUST be provided by the caller
		if( privateDone === false && attributes.private === true ){
			Privatize.pushPrivateOkFn(instance, originalFn)
			privateDone	= true
		}

		// honor .arguments - check arguments type
		if( attributes.arguments !== undefined ){
			var allowedTypes	= attributes.arguments
			console.assert(args.length <= allowedTypes.length, 'function received '+args.length+' parameters but allows only '+allowedTypes.length+'!');
			for(var i = 0; i < allowedTypes.length; i++){
				var isValid	= StrongTyping.value(args[i], allowedTypes[i]);
				console.assert(isValid, 'type of argument['+i+'] is invalid! MUST be a'
					, StrongTyping.allowedTypesToString(allowedTypes[i])
					, 'and it is'
					, StrongTyping.valueTypeToString(args[i]))
			}			
		}
	}, function(returnedValue, instance, args){
		// honor .return - check the result type
		if( attributes.return !== undefined ){
			var allowedTypes= attributes.return
			var isValid	= StrongTyping.value(returnedValue, allowedTypes)
			console.assert(isValid, 'type of returned value is invalid! MUST be a'
				, StrongTyping.allowedTypesToString(allowedTypes)
				, 'and it is'
				, StrongTyping.valueTypeToString(returnedValue))
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
		
		// declare __betterjsOriginalFn
		Object.defineProperty(fn, '__betterjsOriginalFn', {
		        enumerable	: false,
		        writable	: false,
		        value		: originalFn,
		})
		
		// return the just built function
		return fn
	}
}


// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= FunctionAttr;
