/**
 * use Proxy API to freeze access and creation of unexisting property.
 * After this, if you read a unexisting property, you will get an exception, instead of the usual undefined.
 * After this, if you write on a unexisting property, you will get an exception, instead of a new property.
 * 
 * @param  {Object} target the object to protect
 * @return {String} permission 'read' to protect only read, 'write' for write only, 'rw' for both
 * @return {Object}        the protected object
 */
var ObjectIcer	= function(target, permission){
	console.assert(ObjectIcer.isAvailable, 'harmony Proxy not enable. try chrome://flags or node --harmony')
	permission	= permission	|| 'rw'
	var checkRead	= permission === 'read'	|| permission === 'rw'
	var checkWrite	= permission === 'write'|| permission === 'rw'
	// use old proxy API because v8 doesnt have the new API, firefox got it tho
	return Proxy.create({
		get	: function(receiver, name){
			if( checkRead && (name in target) === false ){
				console.assert((name in target) === true, 'reading unexisting property '+name)			
			}
			return target[name]
		},
		set	: function(receiver, name, value){
			if( checkWrite && (name in target) === false ){
				console.assert((name in target) === true, 'setting unexisting property '+name)
			}
			target[name]	= value
			return true
		},
		// without this one, i receive errors ?
		// has: function (name) {
		// 	return name in target ? true : false
		// },
	})
}

/**
 * check if the feature is available or not
 * @type {Boolean}
 */
ObjectIcer.isAvailable        = typeof(Proxy) !== 'undefined' && typeof(Proxy.create) === 'function'

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ObjectIcer;
