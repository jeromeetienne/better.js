/**
 * Privatize all property/function which start with a _
 * 
 * @param  {Function} klass    constructor for the class
 * @param  {object} baseObject the instance of the object
 */
PrivateForJS.privatize	= function(klass, baseObject){
	console.assert( baseObject.constructor == klass );
	console.assert( baseObject instanceof klass );

// TODO what about the .prototype

	for(var property in baseObject){
		var value	= baseObject[property]
		if( property[0] !== '_' )		continue;
		if(!baseObject.hasOwnProperty(property))continue;		
		PrivateForJS.privateProperty(klass, baseObject, property);
	}
}


