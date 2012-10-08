/**
 * @namespace
 */
var allocationTracker	= {};

var parseStacktrace	= parseStacktrace	|| require('../src/parseStacktrace')

/**
 * record an allocation of a class
 * @param  {String} className The class name under which this record is made
 */
allocationTracker.record	= function(className){
	// init variable
	var at			= allocationTracker;
	var stackFrame		= parseStacktrace()[2];
	// init allocationTracker._klasses entry if needed
	at._klasses[className]	= at._klasses[className]	|| {
		counter		: 0,
		perOrigins	: {}
	}
	// increase the counter
	var klass		= at._klasses[className];
	klass.counter		+= 1;
	// build the originId from stackFrame
	var originId		= at.originIdFromStackFrame(stackFrame);
	// update counters for this originId
	var perOrigins		= klass.perOrigins;
	perOrigins[originId]	= perOrigins[originId] !== undefined ? perOrigins[originId]  : 0;
	perOrigins[originId]	+= 1;		
}

/**
 * reset all counters kepts by allocationTracker
 * @return {[type]} [description]
 */
allocationTracker.reset		= function(){
	allocationTracker._klasses	= {};
}

allocationTracker.originIdFromStackFrame= function(stackFrame){
	return stackFrame.fct + '@' + stackFrame.url + ':' + stackFrame.line;
}


/**
 * keep all the previous allocation
 * @type {Object}
 */
allocationTracker._klasses	= {};

// export the class in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= allocationTracker;


allocationTracker.reportString		= function(classNameRegExp, maxNOrigin){
	maxNOrigin	= maxNOrigin !== undefined ? maxNOrigin	: 3;
	var output	= [];
	var classNames	= Object.keys(allocationTracker._klasses);
	classNames.forEach(function(className){
		var klass	= allocationTracker._klasses[className];
		output.push(className+': allocated '+klass.counter+' times');
		
		var perOrigins	= klass.perOrigins;

		var ranks	= Object.keys(perOrigins);
		ranks.sort(function(a, b){
			return perOrigins[b] - perOrigins[a];
		});

		//console.dir(aClass._newCounters)
		//console.log('ranks', ranks)

		ranks.slice(0, maxNOrigin).forEach(function(originId){
			var perOrigin	= perOrigins[originId];
			output.push('\t'+originId+' - '+perOrigin+' times')
			//console.log(counters[origin], "new aClass at ", origin);
		})


	})
	return output.join('\n');
};


