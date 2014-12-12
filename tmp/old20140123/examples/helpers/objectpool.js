/**
 * Implement a Object Pool
 * 
 * - only track the free objects
 * - TODO implement one which track used object too
 *   - which allocation is never released, from where
 * 
 * @class
 * @param {Function} klass the constructor of the class used in the pool
 */
var ObjectPool = function(klass){
	var _pool	= new Array();
	return {
		reset	: function()	{ _pool = [];		},
		put	: function(obj)	{ _pool.push(obj);	},
		get	: function(){			
			if( _pool.length === 0 )	this.grow();
			return _pool.pop();
		},
		grow	: function(){
			_pool.push(new klass());
		}
	};
};

/**
 * mixin an ObjectPool into a class
 * @param  {Function} klass constructor function of the class
 */
ObjectPool.mixin	= function(klass){
	var pool	= new ObjectPool(klass)
	// ### possible API
	// .create/.destroy
	// .acquire/.release
	// .create/.release
	// 
	// ### events ? onAcquire/onRelease
	// * with microevent.js
	// * where did you get it ?
	// * where have i seen this ?
	// * https://github.com/playcraft/gamecore.js/blob/master/src/pooled.js#L483

	klass.create	= function(){
		var obj	= pool.get();
		klass.prototype.constructor.apply(obj, arguments)
		return obj;
	}
	klass.prototype.release	= function(){
		pool.put(this);
	}
};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= ObjectPool;
