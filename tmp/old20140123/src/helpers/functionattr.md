## functionattr.js

This part needs a total refactor


### Possible new api

For normal functions

```
FunctionAttr(function(label, quantity){
	
}, {
	arguments	: [String, Number],
	return		: String,
	onBefore	: function(){},
	onAfter		: function(){},
})
```


For functions which are methods of a given object.

```
var MyClass	= function(){
}

MyClass.prototype._myFunction	= FunctionAttr(function(){
	
}, {
	private	: true,
	class	: MyClass
})
```