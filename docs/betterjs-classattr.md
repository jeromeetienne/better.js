## ClassAttr.js

it is a better.js for class. 
It provides a way to define some properties as private, the same for functions.

It provide strong typing for the object properties.
The constructor arguements got strong type too.

## TODO
* to support privatize with the rest. currently it conflict with arguments
  * maybe to rewrite qgettersetter2 with Object.defineProperty
* to support Object.freeze
* to support default arguments
  * ClassAttr.defaults	= {}

## Basic Usage

```
var MyClass	= ClassAttr(function(label, quantity){
	this.label	= label
	this.quantity	= quantity
}, {
	privatize	: true,
	arguments	: [String, Number],
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
	
	freeze		: true,	// TODO to support Object.freeze 

	arguments	: [String, Number],
	properties	: {
		_label	: String,
		_quantity: Number
	},

	onBefore	: function(){},
	onAfter		: function(){},
})
```

if no attributes is provided, it will use ```ClassAttr.defaultAttributes```. 

## Notes

It is a front for 
[classattr.js](https://github.com/jeromeetienne/better.js/src/helpers/classattr.js).