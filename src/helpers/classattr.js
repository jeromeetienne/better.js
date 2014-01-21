/**
 * @fileOverview definition of ClassAttr - based on other core libraries
 * 
 * ## useful links
 * * object constructor https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
 */

/*
var MyClass	= ClassAttr(ctor, {
	ice		: true,	// to prevent read/write non existing properties
				// 'all' or true
				// 'none' or false
				// 'read'
				// 'write'


	privatize	: true;	// privatize functions and property
				// false
				// 'functions'	for later
				// 'properties'	for later
	arguments	: allowedTypeForFn,
	properties	: {
		'yourProp'	: [String, Number]
	}
})
*/

var TypeCheck2		= TypeCheck2	|| require('../typecheck2.js');
var PrivateForJS3	= PrivateForJS3	|| require('../privateforjs3.js');

var ClassAttr	= function(originalCtor, attributes){
	// handle arguments default values
	attributes	= attributes	|| ClassAttr.defaultAttributes
	
	// arguments parameter checks
	console.assert(originalCtor instanceof Function, 'invalid parameter type')

	var className	= attributes.name	|| originalCtor.name
	var onBefore	= attributes.onBefore	|| function(instance, args){}
	var onAfter	= attributes.onAfter	|| function(instance, args){}
	
	return wrapCtor(originalCtor, className, function(instance, args){
		// honor .arguments
		if( attributes.arguments ){
			var allowedTypes	= attributes.arguments
			for(var i = 0; i < allowedTypes.length; i++){
				var isValid	= TypeCheck2.value(args[i], allowedTypes[i]);			
				console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', allowedTypes[i], 'It is ===', args[i])
			}
		}

		// honor onBefore
		onBefore(instance, args)
	}, function(instance, args){
		// honor .properties
		if( attributes.properties ){
			Object.keys(attributes.properties).forEach(function(property){
				var allowedTypes	= attributes.properties[property]
				TypeCheck2.setter(instance, property, allowedTypes)
			})
		}


		// honor .ice
		// console.log('ice', attributes.ice, ObjectIcer.isAvailable)

		// if( attributes.ice && ObjectIcer.isAvailable === true ){
		// 	instance	= ObjectIcer(instance)
		// }

		// honor onAfter
		onAfter(instance, args)
		
		// honor .privatize
		if( attributes.privatize ){
			PrivateForJS3.privatize(instance)
		}

		return instance
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
		
	function wrapCtor(originalCtor, className, onBefore, onAfter){
		// arguments default
		onBefore= onBefore	|| function(instance, args){}
		onAfter	= onAfter	|| function(instance, args){}
		var fn	= function SuperName(){
			// notify onBefore
			onBefore(this, arguments)
			// forward the call to original contructor
			originalCtor.apply(this, arguments);
			// notify onAfter				
			onAfter(this, arguments)
		}
		// mechanism to get fn with the propername
		// - see https://github.com/jeromeetienne/creatorpattern.js
		var jsCode	= fn.toString().replace(/SuperName/g, className) 
		eval('fn = '+jsCode+';')
		// inherit from original prototype
		// - reference or copy with Object.Create() ?
		// - this is the old three.js to inherit
		fn.prototype	= originalCtor.prototype
		fn.prototype.constructor = originalCtor;
		// return the just built function
		return fn
	}
}

/**
 * default attributes value to use if not provided
 * 
 * @type {Object}
 */
ClassAttr.defaultAttributes	= {};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ClassAttr;


//////////////////////////////////////////////////////////////////////////////////
//		Helpers								//
//////////////////////////////////////////////////////////////////////////////////

/**
 *  overload global ```Function``` prototype to add ClassAttr
 *  
 *  ```
 *  var Cat = function(name){
 *  }.classAttr({ privatize : true })
 *  ```
 */
ClassAttr.overloadFunctionPrototype	= function(){
	Function.prototype.classAttr	= function(attributes){
		return ClassAttr(this, attributes)
	}
}
