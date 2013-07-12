/**
 * prevent the default value of 
 * @param {Object} target the object on which we prevent undefined
 * @return {Object} the proxy
 */
function preventUndefinedProperties(target){
	console.assert(Proxy.create !== 'function', 'harmony proxy not enable. try chrome://flags or node --harmony')
	return Proxy.create({
		get	: function(proxy, name){
			console.assert( target[name] !== undefined, 'property '+name+' undefined' )
			return target[name]
		},
	})
	return proxy
}

preventUndefinedProperties.available	= typeof(Proxy) !== 'undefined' && typeof(Proxy.create) === 'function'

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= preventUndefinedProperties;
