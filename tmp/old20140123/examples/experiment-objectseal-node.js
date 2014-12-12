'use strict';

var obj	= {
	prop	: function(){
		
	},
	foo	: "bar"
};

// New properties may be added, existing properties may be changed or removed
obj.foo		= "baz";
obj.lumpy	= "woof";
delete obj.prop;

 
Object.seal(obj);


obj.foo = "quux";

obj.foo2 = "quux";