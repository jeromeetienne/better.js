title: jsDoced Javascript
output: index.html
--

# jsdoc2betterjs
## or
## Test your Javascript with jsdoc.

--

## It is a Mariage

--

## It is..

# [jsdoc](http://usejsdoc.org) + [better.js](http://betterjs.org)

--

# kissing in a three...

--

## On One Hand, We Have...

# [jsdoc](http://usejsdoc.org)

--

### What is jsdoc ?

```
/**
 * Measure the length of a string
 * @param  {String} myString - the string to measure
 * @return {Number} The length of the string
 */
var stringLength = function(myString){
        return myString.length
}
```

--

### What is jsdoc ?

```
/**
 * Measure the length of a string
 * @param  {String} myString - the string to measure
 * @return {Number} The length of the string
 */
var stringLength = function(myString){
        return myString.length
}
```

* Defacto standard to doc javascript
* [usejsdoc](http://usejsdoc.org) effort
* [closure compiler](https://developers.google.com/closure/compiler/docs/js-for-compiler)
by [google](http://google.com)

--

### What is jsdoc ?

```
/**
 * Measure the length of a string
 * @param  {String} myString - the string to measure
 * @return {Number} The length of the string
 */
var stringLength = function(myString){
        return myString.length
}
```

* Similar to what other languages have
* [doxigen](http://en.wikipedia.org/wiki/Doxygen)
* TODO: find others

--

## OK...

--

## On The Other Hand, We Have...

# [better.js](http://betterjs.org)

--

### What is Better.js

```
var stringLength = Better.Function(function(myString){
        return myString.length
}, {
        arguments : [String],
        return    : Number,
})
```

--

### What is Better.js

```
var stringLength = Better.Function(function(myString){
        return myString.length
}, {
        arguments : [String],
        return    : Number,
})
```

* [better.js](http://betterjs.org) is a javascript library
* It provide tools to help you write a better javascript
* It enables strong typing and private visibility

**Yeah for real!**

--

## Now What If We Mary Them ?

--

### JSDOC for the info

* jsdoc provides the info about the code

#### Examples
* Is that a function ? or is that constructor ?
* What is the type of this [@param](http://usejsdoc.org/tags-param.html)
* What is the type of the [@return](http://usejsdoc.org/tags-returns.html) value ?

--

### Better.js for testing during execution

* jsdoc information is used to produce better.js code

#### Examples
* jsdoc says this [@param](http://usejsdoc.org/tags-param.html) is a ```Number```
  * better.js checks it is respected during execution
* jsdoc says this [@return](http://usejsdoc.org/tags-returns.html) is a ```String```
  * better.js checks it is respected during execution

--

## So now...

# Your Code is Tested With Your jsdoc

--

### JSDOC is now more than doc

* it is a way to specify how your code should run
* it is a way to write tests for your application
* it is more than docs for other people

--

## Let's go further

--

# jsdoc2betterjs

--

### jsdoc2betterjs

* It do all this automatically!
* it extract jsdoc from your javascript files
* it produces a better.js version based on your jsdoc

```
jsdoc2betterjs myFile.js > myFile.better.js
```

* Now run the better.js version

--

### Benefits
* Then any error in the type of a value will be notified.
* The same anybody accessing private members.

**You just have to write jsdoc in your code**

--

### Tech bits
* it use [recast](https://github.com/benjamn/recast) to parse javascript. a Great tool!
* it is all 100% javascript
* it run on browser and node.js

--

# Check it out at [betterjs.org](http://betterjs.org/docs/betterjs-jsdoc2betterjs.html)
