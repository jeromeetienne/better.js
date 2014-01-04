/**
 * use Proxy API to 
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
var ObjectIcer	= function(target, permission){
	console.assert(Proxy.create !== 'function', 'harmony proxy not enable. try chrome://flags or node --harmony')
	permission	= permission	|| 'rw'
	var checkRead	= permission === 'read'	|| permission === 'rw'
	var checkWrite	= permission === 'write'|| permission === 'rw'
	// use old proxy API because v8 doesnt have the new API, firefox got it tho
	return Proxy.create({
		get	: function(proxy, name){
			if( checkRead && (name in target) === false ){
				console.assert((name in target) === true, 'reading unexisting property '+name)			
			}
			return target[name]
		},
		set	: function(proxy, name, value){
			console.log('name', name, value)
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

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ObjectIcer;
