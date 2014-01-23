strongtyping
============

This part check the type of variables and property.
It is used in various place in better.js to check 
property type for examples
or 
if the arguments your function received are like expected.
Everytime the strong type is define the same way.

## Definition of a strong type for variables

Here we describe the details about how to express the strong typing
is expressed for a single variable.

* a strong typing definition is an array of type
* [Number, String] means the variable may be be either Number or String
* [Vector3] means the variable must of an ```instanceof``` Vector3
* [Number, undefined] means the variable is an optional number, 
as undefined would be value when it isnt provided

As a shortcut, if you provide a non array value, it will be put in a array.
so ```Vector3``` will be converted as ```[Vector3]```.
It may be nice in case your variable has a single type.

## Definition of a strong typing for function arguments
When a function is called, it received arguments,
so like an array of variables.

In this case, you simply provide an array of strong type for single variables.

## Validator, the cherry on the cake

As a bonus, it is possible to have ```validators```.
Those are functions which return true if the value is ok with the variable, false otherwise.

You can do you own tho. here is one for range checking. Let's say the variable is an age.
So a Number between 0 and 130. Here is the validator.

```
[Number, TypeCheck2.Validator(function(value){
	return value >= 0 && value <= 130	
})]
```

Here is one in case your value is a selection among options, e.g. 'low', 'normal', 'high'

```
[TypeCheck2.Validator(function(value){
	return ['low', 'normal', 'high'].indexof(value) !== -1
})]
```



