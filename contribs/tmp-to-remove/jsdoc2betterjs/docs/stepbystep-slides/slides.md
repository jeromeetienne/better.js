title: jsdoc2betterjs - Test your javascript with jsdoc
output: index.html
--


<base target='_blank'/>
<style>pre { background: lightgrey; font-size: 80%;}</style>

# jsdoc2betterjs
## - Test your Javascript with jsdoc -
## - Step By Step -
## by [Jerome Etienne](http://twitter.com/jerome_etienne)

--

## Step by Step

--

# Step 1

--

# You have yourFile.js

--

## Say it contains that

```
/**
 * Add 2 numbers 
 * @param  {Number} value1 - first value to add
 * @param  {Number} value2 - second value to add
 * @return {Number} The result of the addition
 */
var addNumbers = function(value1, value2){
        return value1 + value2;
};
```

--

### JSDOC is valuable information

* originally intended for documentation
* it contains valuable informations about types
* Ideally, jsdoc should be respected during execution

--

### jsdoc2betterjs helps you do that

* jsdoc2betterjs is a javascript-to-javascript compiler
* it converts your jsdoc into better.js code
* better.js code will make sure your jsdoc is respected

**Let me show you how.**

--

# Step 2

--

# yourFile.js goes thru jsdoc2betterjs

--

## You got a .better.js file as a result.

--

## It looks like that

```
/**
 * Add 2 numbers 
 * @param  {Number} value1 - first value to add
 * @param  {Number} value2 - second value to add
 * @return {Number} The result of the addition
 */
var addNumbers = Better.Function(function(value1, value2){
        return value1 + value2;
}, {
        arguments : [Number, Number],
        return    : Number,
};
```

--

### What Changed ?

* Added some lines for better.js
* They are based on the jsdoc above
* Still 100% javascript tho

--

### What is better.js ?
* It is a library which provide strong typing to javascript
* It provides private too and many other things
* Check it out [betterjs.org](http://betterjs.org)

*Let's focus on strong typing for now*

--

# Step 3

--

# Run file.better.js

--

## Now What ?

--

**better.js makes sure your jsdoc is respected**

--

## So What ?

--

# Step 4

--

# Check jsdoc is respected

--

### With Valid Usage

Without .better.js, no error

```
addNumbers(3, 3);
// 6
```

With .better.js, no error

```
addNumbers(3, 3);
// 6
```

--

### With Invalid Arguments Type

Without .better.js, *Error Not Detected*...

```
addNumbers('foo', 3);
// 'foo3'
```

With .better.js, **Error Notified Immediatly**!

```
addNumbers('foo', 3);
// Exception 'Invalid first parameters'
```

--

### With Too Many Arguments

Without .better.js, *Error Not Detected*...

```
addNumbers(1, 3, 5);
// 4
```

With .better.js, **Error Notified Immediatly**!

```
addNumbers(1,3,5);
// Exception 'Too Many Arguments, only 2 allowed!'
```

--

### Many other Errors Detected

* Invalid type of return value
* Private functions and properties
* And more

--

# Check it out [betterjs.org](http://betterjs.org)

