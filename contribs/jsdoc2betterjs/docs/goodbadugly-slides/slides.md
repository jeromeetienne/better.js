title: jsDoced Javascript
output: index.html
--

# jsDoced Javascript
## the good, the bad, and the ugly

--

# The Good

--

### Create Virtuous cycle

* documenting doc is good
* testing is good
* the more documented is your code, the more tested is safer it become

--

### Expand test coverage

* jsdoc provide plenty of useful information
* it was rarely/never use to test code
* it detects a new type of error.

--

### During Execution

* js is really dynamic
* it has to be tested during execution

--

### Plain old javascript

* jsdoced.js is actually valid javascript
* no tool chain to change
* no new language to learn
* no compilation

--

# The Bad

--

### Slow down execution

* All those checking costs time
* not that important during the test phase tho
  * don't use it in production

It is like a [debug build](http://vinayakgarg.wordpress.com/2012/03/31/difference-between-debug-build-and-release-build/)

--

### Source code is modified

* it is the tradeoff of not having compilation
* and testing at execution time
* would it be possible to make it less obtrusive ?
  * like adding jsDoced() automatically
  * it is certainly possible
  * just parse and rewrite the js
  * myfile.js -> myfile.jsdoced.js




--

# And The Ugly

--

### Sync file loading

* to get the jsdoc above the ```jsDoced()```
* the file is loaded synchronously
* it it rescource consuming
* possible improvement: extract jsdoc before


--

# jsDoc-ed Javascript

## [@jerome_etienne](http://twitter.com/jerome_etienne)
## [http://betterjs.org](http://betterjs.org)

--

