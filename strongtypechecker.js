var StrongTypeChecker	= {};

StrongTypeChecker.checkFunctionTypes	= function(fct, paramsTypes, returnTypes){
	 var args	= Array.prototype.slice.call(arguments, 0);
	return function(){
		console.log('arguments', args)
		
	}	
}

StrongTypeChecker.checkValueType	= function(value, types){
	// handle parameter polymorphism
	if( types instanceof Array === false )	types	= [types];
	// go thru each type
	var result	= false;
	types.forEach(function(type){
		if( type === Number ){
			var valid	= typeof(value) === 'number';
		}else if( type === String ){
			var valid	= typeof(value) === 'string';			
		}else {
			var valid	= value instanceof type;
		}
		result	= result || valid;
	})
	// return the just computed result
	return result;
}

// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= StrongTypeChecker;