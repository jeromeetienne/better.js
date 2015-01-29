title: jsdoc2betterjs - Test your javascript with jsdoc
output: index.html
--


<base target='_blank'/>
<style>pre { background: lightgrey; font-size: 100%;}</style>

# jsdoc2betterjs
## - Test your Javascript with jsdoc -
## by [Jerome Etienne](http://twitter.com/jerome_etienne)

--

# What is jsdoc2betterjs ?

--

## It is A Mariage in Javascript World!

# [jsdoc](http://usejsdoc.org) + [better.js](http://betterjs.org)
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

## Now On The Other Hand, We Have...

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

## Now Let's Mix Them Together!

--

# [JSDOC](http://usejsdoc.org)
## To
# Get The Info

--

### JSDOC To Get The Info

* jsdoc has very valuable informations about the code

#### Examples
* Is that a function ? or is that constructor ?
* What is the type of this [@param](http://usejsdoc.org/tags-param.html) ?
* What is the type of the [@return](http://usejsdoc.org/tags-returns.html) value ?

--

# [better.js](http://betterjs.org)
## to
# Test Execution

--

### Better.js To Test During Execution

* jsdoc information is used to produce better.js code

#### Examples
* jsdoc says this [@param](http://usejsdoc.org/tags-param.html) is a ```Number```
* better.js checks it actually receives a ```Number```
* the same for [@return](http://usejsdoc.org/tags-returns.html) is a ```String```

--

# [jsdoc2betterjs](http://betterjs.org/docs/betterjs-jsdoc2betterjs.html)
# Automatize it all!

--

### What Is jsdoc2betterjs ?

* It do all this automatically!
* it extract jsdoc from your javascript files
* it produces a better.js version based on your jsdoc

```
jsdoc2betterjs myFile.js > myFile.better.js
```

* Now run the better.js version

--

### Tech Bits About jsdoc2betterjs
* it use [recast](https://github.com/benjamn/recast) to parse javascript. a Great tool!
* it is all 100% javascript
* it run on browser and node.js

--

## So now...

# Test your code with jsdoc

--

### Benefits - Error Detections
* Detect a new family of bugs
* Any typing error is detected immediately
* Unauthorized private access is detected immediately

**You just have to write jsdoc in your code**

--

### JSDOC Is Now More Than Doc

* it is a way to specify how your code should run
* it is a way to write tests for your application
* it is more than docs for other people

**The more your document your code...**

**The safer it becomes!**

--

# Check it out at [betterjs.org](http://betterjs.org/docs/betterjs-jsdoc2betterjs.html)
