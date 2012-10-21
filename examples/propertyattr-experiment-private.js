#!/usr/bin/env node


var Stacktrace		= require('../src/stacktrace.js');
var QGetterSetter	= require('../src/qgettersetter.js');

var aClass1	= function(){
	console.log('in aClass1 ctor');
	this._bar	= 2;

	QGetterSetter.defineGetter(this, '_bar', function aFunction(value, caller, property){
		// console.log('in bar checker', aFunction.caller);
		// console.log('parse', Stacktrace.parse().slice(0,3));
		// console.log('caller in .prototype');

		// generate privateOkFns - list of functions which can access private properties
		// - TODO should be computed once. where to cache it
		var privateOkFns= [];
		var protoNames	= Object.keys(aClass1.prototype);
		for(var i = 0; i < protoNames.length; i++){
			var protoName	= protoNames[i];
			var fn		= aClass1.prototype[protoName];
			if( typeof(fn) !== 'function' )	continue;
			privateOkFns.push(fn);
		}

		// check if caller is privateOk
		var isPrivateOk	= privateOkFns.indexOf(caller) !== -1;
		if( isPrivateOk )	return value;
		// get stackFrame and originId of the user
		var stackFrame	= Stacktrace.parse()[2];
		var originId	= stackFrame.fct + '@' + stackFrame.url + ':' + stackFrame.line;
		// log the event
		console.assert(false, 'access to private property', "'"+property+"'", 'from', originId);
		// actually return the value
		return value;
	});
};

aClass1.prototype.bar	= function(){
	return this._bar;
}


//////////////////////////////////////////////////////////////////////////////////
//		Test protected							//
//////////////////////////////////////////////////////////////////////////////////

var aClass2	= function(){
	this.__proto__.constructor.apply(this, arguments);
}
aClass2.prototype	= Object.create( aClass1.prototype );

/**
 * Overload .bar() function 
 */
aClass2.prototype.bar	= function(){ return this._bar;	}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

var obj	= new aClass1

console.log('obj.bla()', obj.bar());
//console.log('obj._bla', obj._bar);



