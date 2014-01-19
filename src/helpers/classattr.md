## ClassAttr.js

it is a better.js for class. 
It provides a way to define some properties as private, the same for functions.

It provide strong typing for the object properties.
The constructor arguements got strong type too.

Basic Usage

```
var MyClass	= ClassAttr(function(label, quantity){
	this.label	= label
	this.quantity	= quantity
}, {
	privatize	: true,
	accept		: [String, Number],
	properties	: {
		label	: String,
		quantity: Number
	}
})
```


## API

```
var MyClass	= ClassAttr(function(label, quantity){
	this._label	= label
	this._quantity	= quantity
}, {
	privatize	: true,
	accept		: [String, Number],
	properties	: {
		_label	: String,
		_quantity: Number
	},
	onBefore	: function(){},
	onAfter		: function(){},
})
```
